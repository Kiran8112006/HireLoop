"use client";

import { useState } from "react";
import { createJob } from "@/lib/jobs";
import { auth } from "@/lib/firebase";

export default function RecruiterPage() {
  const [title, setTitle] = useState("");
  const [salary, setSalary] = useState("");

  const handleCreateJob = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert("Not logged in");
      return;
    }

    await createJob(
      {
        title,
        salaryRange: salary
      },
      user.uid
    );

    alert("Job Created!");
  };

  return (
    <div>
      <h1>Recruiter Dashboard</h1>

      <input
        placeholder="Job Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Salary"
        onChange={(e) => setSalary(e.target.value)}
      />

      <button onClick={handleCreateJob}>Post Job</button>
    </div>
  );
}