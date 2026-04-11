import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors()); // Allow requests from your Next.js frontend

const razorpay = new Razorpay({
    key_id: process.env.TEST_API_KEY,
    key_secret: process.env.TEST_KEY_SECRET,
});

// Step 1: Create an Order
app.post('/create-order', async (req, res) => {
    try {
        const options = {
            amount: req.body.amount * 100, // amount in smallest currency unit (paise)
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

// Step 2: Verify Signature
app.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.TEST_KEY_SECRET)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        const orderDetails = await razorpay.orders.fetch(razorpay_order_id);
        const orderType = orderDetails.notes.user_id;
        console.log(orderType)
        return res.status(200).json({ message: "Payment verified successfully" });
    } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));