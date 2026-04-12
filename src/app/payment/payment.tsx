"use client";
import Script from "next/script";

interface PaymentButtonProps {
    amount: number;
    orderType: string;
    userId: string;
}

export default function PaymentButton({ amount, orderType, userId }: PaymentButtonProps) {
    const handlePayment = async () => {
        // 1. Create order on Express Backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(
                {
                    amount: amount,
                    order_type: orderType,
                    user_id: userId
                }
            ), // ₹500
        });
        const order = await response.json();

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency,
            name: "Your Brand Name",
            description: "Order #123",
            order_id: order.id,
            handler: async function (response: any) {
                // 2. Verify payment on Express Backend
                const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/verify-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ ...response, order_type: orderType, user_id: userId }),
                });
                const vData = await verifyRes.json();
                if (vData.message === "Payment verified successfully") {
                    alert("Success!");
                }
            },
            theme: { color: "#3399cc" },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <button onClick={handlePayment} className="btn-primary">
                Checkout Now
            </button>
        </>
    );
}