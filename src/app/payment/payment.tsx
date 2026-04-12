"use client";
import Script from "next/script";

interface PaymentButtonProps {
    amount: number;
    orderType: string;
    userId: string;
    className?: string;
    style?: React.CSSProperties;
}

export default function PaymentButton({ amount, orderType, userId, className = "btn-primary", style }: PaymentButtonProps) {
    const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:5000").replace(/\/$/, "");
    const apiUrl = (path: string) => `${backendUrl}${path}`;

    const handlePayment = async () => {
        try {
            // 1. Create order on Express Backend
            const response = await fetch(apiUrl("/create-order"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: amount,
                    order_type: orderType,
                    user_id: userId,
                }),
            });

            if (!response.ok) {
                throw new Error(`Create order failed: ${response.status} ${response.statusText}`);
            }

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
                    const verifyRes = await fetch(apiUrl("/verify-payment"), {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...response, order_type: orderType, user_id: userId }),
                    });

                    if (!verifyRes.ok) {
                        throw new Error(`Verify payment failed: ${verifyRes.status} ${verifyRes.statusText}`);
                    }

                    const vData = await verifyRes.json();
                    if (vData.message === "Payment verified successfully") {
                        alert("Success!");
                        window.location.reload();
                    } else {
                        alert("Payment verification failed. Please try again.");
                    }
                },
                theme: { color: "#3399cc" },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment error:", error);
            alert(error instanceof Error ? error.message : "Unable to start payment. Check the backend server.");
        }
    };

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
            <button onClick={handlePayment} className={className} style={style}>
                Checkout Now
            </button>
        </>
    );
}