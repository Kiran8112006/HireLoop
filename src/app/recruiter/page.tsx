"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { onAuthStateChanged } from "firebase/auth"; // Added this import
import { auth } from "@/lib/firebase";
import PaymentButton from "../payment/payment";

export default function RecruiterPage() {
  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ New state to track the verified User ID
  const [userId, setUserId] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ✅ New effect to listen for Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  const handlePostJob = async () => {
    if (!companyName || !title || !description || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    // Use our state variable instead of auth.currentUser
    if (!userId) {
      alert("Login first");
      return;
    }

    try {
      const res = await fetch("https://your-backend-url.onrender.com/post-job", { // Ensure this is your Render URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: userId,
          companyName,
          title,
          description,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }

      alert("Job posted successfully!");
      setCompanyName(""); setTitle(""); setDescription(""); setStartDate(""); setEndDate("");
    } catch (err) {
      alert("Error posting job");
    }
  };

  return (
    <div>
      <h1>Recruiter Dashboard</h1>

      {/* ... (Inputs remain the same) ... */}
      <input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
      <input placeholder="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea placeholder="Job Description" value={description} onChange={(e) => setDescription(e.target.value)} />

      <label>Start Date:</label>
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <label>End Date:</label>
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

      <hr className="my-4" />

      {/* 💳 SECURE PAYMENT SECTION */}
      {authLoading ? (
        <p>Verifying authentication...</p>
      ) : userId ? (
        <>
          <PaymentButton
            amount={500}
            orderType="listingfees"
            userId={userId} // ✅ Now passing a stable state variable
          />
          <p className="text-sm text-gray-500">Authenticated as: {userId}</p>
        </>
      ) : (
        <p className="text-red-500">Please log in to proceed with payment.</p>
      )}

      <button
        disabled={!companyName || !title || !description || !startDate || !endDate || !userId}
        onClick={handlePostJob}
        className="mt-4 block"
      >
        Post Job
      </button>
    </div>
  );
}