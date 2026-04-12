import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import atsRouter from './ats.js';
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
        
        await db.collection("recruiters").doc(uid).set(
        {
          credits: admin.firestore.FieldValue.increment(1),
          paymentId: razorpay_payment_id,
          orderId: razorpay_order_id,
          updatedAt: new Date(),
        },
        { merge: true }
        );
        
        return res.status(200).json({ message: "Payment verified successfully" });
    } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
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


app.listen(5000, () => console.log("Server running on port 5000"));