import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import atsRouter from './ats.js';
import { generateMockQuestions, evaluateAnswer } from './mockinterview.js';
import multer from "multer";
import csv from "csv-parser";
import fs from "fs";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', atsRouter);
const upload = multer({ dest: "uploads/" });

const razorpay = new Razorpay({
  key_id: process.env.TEST_API_KEY,
  key_secret: process.env.TEST_KEY_SECRET,
});

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});

const db = admin.firestore();

app.post('/create-order', async (req, res) => {
  try {
    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        order_type: req.body.order_type,
        user_id: req.body.user_id,
      }
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).send(err);
  }
});



app.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.TEST_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");

    if (razorpay_signature === expectedSign) {
        const orderDetails = await razorpay.orders.fetch(razorpay_order_id);
        const orderType = orderDetails.notes.order_type;
        const uid = orderDetails.notes.user_id;
        console.log (uid);
        const collectionName =
        orderType === "subscription" ? "students" : "recruiters";
        
        // Update recruiter document with payment info
        await db.collection(collectionName).doc(uid).set(
        {
            paymentDone: true,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            updatedAt: new Date(),
        },
        { merge: true }
        );

        // For recruiters, create a credits purchase history entry
        if (orderType !== "subscription") {
            const amount = orderDetails.amount / 100; // Convert from paise to rupees
            // Credit conversion: 1 credit = 500 INR
            const creditsAdded = amount / 500;
            
            // Add entry to credits subcollection
            await db.collection(collectionName).doc(uid).collection("credits").add({
                type: "purchase",
                creditsAdded: creditsAdded,
                amount: amount,
                currency: orderDetails.currency,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                timestamp: new Date(),
                description: `Purchased ${creditsAdded} credits for ₹${amount}`
            });

            // Update total credits in recruiter document
            const recruiterDoc = await db.collection("recruiters").doc(uid).get();
            const currentCredits = recruiterDoc.data()?.credits || 0;
            
            await db.collection("recruiters").doc(uid).update({
                credits: currentCredits + creditsAdded
            });
        }
        
        return res.status(200).json({ message: "Payment verified successfully" });
    } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
    }
});

// Endpoint to track credit usage (deduct credits when recruiter uses them)
app.post('/deduct-credits', async (req, res) => {
  try {
    const { recruiterId, creditsUsed, action, metadata } = req.body;

    if (!recruiterId || !creditsUsed || !action) {
      return res.status(400).json({ error: "Missing required fields: recruiterId, creditsUsed, action" });
    }

    const recruiterRef = db.collection("recruiters").doc(recruiterId);
    const recruiterDoc = await recruiterRef.get();

    if (!recruiterDoc.exists()) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    const currentCredits = recruiterDoc.data()?.credits || 0;

    if (currentCredits < creditsUsed) {
      return res.status(400).json({ error: "Insufficient credits" });
    }

    // Add entry to credits usage subcollection
    await recruiterRef.collection("credits").add({
      type: "usage",
      creditsUsed: creditsUsed,
      action: action, // e.g., "post_job", "send_interview", "contact_student"
      timestamp: new Date(),
      metadata: metadata || {}, // Can store additional info like jobId, studentId, etc.
      description: `Used ${creditsUsed} credits for ${action}`
    });

    // Update total credits
    await recruiterRef.update({
      credits: currentCredits - creditsUsed
    });

    return res.status(200).json({ 
      message: "Credits deducted successfully",
      remainingCredits: currentCredits - creditsUsed
    });
  } catch (err) {
    console.error("Error deducting credits:", err);
    res.status(500).json({ error: "Failed to deduct credits" });
  }
});

// Endpoint to get credit history for a recruiter
app.get('/credits-history/:recruiterId', async (req, res) => {
  try {
    const { recruiterId } = req.params;

    const recruiterRef = db.collection("recruiters").doc(recruiterId);
    const recruiterDoc = await recruiterRef.get();

    if (!recruiterDoc.exists()) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    // Get all credit transactions (both purchases and usage)
    const creditsSnapshot = await recruiterRef.collection("credits")
      .orderBy("timestamp", "desc")
      .get();

    const transactions = creditsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate?.() || doc.data().timestamp
    }));

    const totalCredits = recruiterDoc.data()?.credits || 0;

    return res.status(200).json({
      recruiterId,
      totalCredits,
      transactions,
      transactionCount: transactions.length
    });
  } catch (err) {
    console.error("Error fetching credits history:", err);
    res.status(500).json({ error: "Failed to fetch credits history" });
  }
});

app.post("/upload-students", upload.single("file"), async (req, res) => {
  try {


    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const students = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {

        students.push(row);
      })
      .on("end", async () => {

        const results = [];

        for (let student of students) {


          let uid;

          try {
            const userRecord = await admin.auth().createUser({
              email: student.email,
              password: student.password,
            });

            uid = userRecord.uid;

          } catch (err) {


            if (err.code === "auth/email-already-exists") {
              const existingUser = await admin.auth().getUserByEmail(student.email);
              uid = existingUser.uid;
            } else {
              results.push({
                email: student.email,
                status: "error",
                message: err.message,
              });
              continue;
            }
          }



          const skillsArray = student.skills
            ? student.skills.split("|")
            : [];

          await db.collection("students").doc(uid).set(
            {
              email: student.email,
              name: student.name,
              major: student.major,
              cgpa: parseFloat(student.cgpa),
              skills: skillsArray,
              resume: null,
              paymentDone: false,
              updatedAt: new Date(),
            },
            { merge: true }
          );

          results.push({
            email: student.email,
            status: "created/updated",
          });
        }

        fs.unlinkSync(filePath);

        res.json({ results });
      });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
app.post("/post-job", async (req, res) => {
  try {
    const { uid, companyName, title, description, startDate, endDate } = req.body;
    if (!uid || !companyName || !title || !description || !startDate || !endDate) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!uid) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔥 Get recruiter
    const recruiterRef = db.collection("recruiters").doc(uid);
    const recruiterSnap = await recruiterRef.get();

    if (!recruiterSnap.exists) {
      return res.status(404).json({ message: "Recruiter not found" });
    }

    const recruiterData = recruiterSnap.data();
    const credits = recruiterData.credits || 0;

    // ❌ No credits
    if (credits <= 0) {
      return res.status(403).json({
        message: "No credits available. Please make payment.",
      });
    }

    // ✅ Create job
    const jobRef = await db.collection("jobs").add({
    companyName,
    title,
    description,
    startDate,
    endDate,
    recruiterId: uid,
    createdAt: new Date(),
    });

    // ➖ Deduct credit
    await recruiterRef.update({
      credits: admin.firestore.FieldValue.increment(-1),
    });

    return res.status(200).json({
      message: "Job posted successfully",
      jobId: jobRef.id,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ============== MOCK INTERVIEW API ROUTES ==============

app.post("/mock/questions", async (req, res) => {
  try {
    const { jobRole, experienceLevel, skills } = req.body;

    if (!jobRole || !experienceLevel) {
      return res.status(400).json({ error: "jobRole and experienceLevel are required" });
    }

    const questions = await generateMockQuestions(jobRole, experienceLevel, skills || []);
    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error.message);
    res.status(500).json({ error: error.message });
  }
});

app.post("/mock/evaluate", async (req, res) => {
  try {
    const { question, userAnswer } = req.body;

    if (!question || !userAnswer) {
      return res.status(400).json({ error: "question and userAnswer are required" });
    }

    const feedback = await evaluateAnswer(question, userAnswer);
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error evaluating answer:", error.message);
    res.status(500).json({ error: error.message });
  }
});


const PORT = process.env.PORT || 5000; // Use Render's port or default to 5000 locally

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});