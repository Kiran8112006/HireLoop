"use client";

import { useState } from "react";
import { createJob } from "@/lib/jobs";
import { auth } from "@/lib/firebase";
import PaymentButton from "../payment/payment";

export default function RecruiterPage() {

  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handlePostJob = async () => {
    if (!companyName || !title || !description || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      alert("Login first");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/post-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          companyName,
          title,
          description,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("Job posted successfully!");

      // ✅ Clear fields after success
      setCompanyName("");
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");

    } catch (err) {
      alert("Error posting job");
    }
  };


  return (
    <div>
      <h1>Recruiter Dashboard</h1>

      {/* ✅ INPUTS */}
      <input
        placeholder="Company Name"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
      />

      <input
        placeholder="Job Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Job Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Start Date:</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />

      <label>End Date:</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />

      {/* 💳 PAYMENT */}
      <PaymentButton
        amount={500}
        orderType="listingfees"
        userId={auth.currentUser?.uid || ""}
      />
      <p>{auth.currentUser?.uid || "not found"}</p>
      <button
        disabled={
          !companyName || !title || !description || !startDate || !endDate
        }
        onClick={handlePostJob}
      >
        Post Job
      </button>
    </div>
  );
}