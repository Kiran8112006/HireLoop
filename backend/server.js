import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import atsRouter from './ats.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); 
app.use('/', atsRouter);

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
        
        await db.collection(collectionName).doc(orderDetails.notes.user_id).set(
        {
            paymentDone: true,
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
app.post("/bulk-create-students", async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || students.length === 0) {
      return res.status(400).json({ error: "No students provided" });
    }

    const results = [];

    for (let student of students) {
      try {
    
        const userRecord = await admin.auth().createUser({
          email: student.email,
          password: student.password,
        });

       
        await db.collection("students").doc(userRecord.uid).set({
          email: student.email,
          createdAt: new Date(),
          paymentDone: false,
        });

        results.push({ email: student.email, status: "success" });

      } catch (err) {
        results.push({ email: student.email, error: err.message });
      }
    }

    res.json({
      message: "Bulk upload completed",
      results,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(5000, () => console.log("Server running on port 5000"));