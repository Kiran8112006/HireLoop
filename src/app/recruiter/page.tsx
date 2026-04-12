"use client";

import { useState } from "react";
import { createJob } from "@/lib/jobs";
import { auth } from "@/lib/firebase";
import PaymentButton from "../payment/payment";
import { useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";

export default function RecruiterPage() {

  const [companyName, setCompanyName] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);

  useEffect(() => {
  const fetchJobs = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, "jobs"),
      where("recruiterId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    const jobList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setJobs(jobList);
  };

  fetchJobs();
}, []);

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
const fetchApplicants = async (jobId: string) => {
  const q = query(
    collection(db, "applications"),
    where("jobId", "==", jobId)
  );

  const snapshot = await getDocs(q);

  const applicantsData: any[] = []; // ✅ IMPORTANT

  for (let docSnap of snapshot.docs) {
    const appData = docSnap.data();

    const studentRef = doc(db, "students", appData.studentId);
    const studentSnap = await getDoc(studentRef);

    if (studentSnap.exists()) {
      const studentData = studentSnap.data();

      applicantsData.push({
        id: docSnap.id,
        ...(studentData || {}),
      });
    }
  }

  setApplicants(applicantsData);
};


  return (
    <div>
      <h1>Recruiter Dashboard</h1>
      <h2>Your Jobs</h2>

      {jobs.map((job) => (
        <div key={job.id}>
          <p>
            <b>{job.title}</b> ({job.companyName})
          </p>

          <button
            onClick={() => {
              setSelectedJob(job);
              fetchApplicants(job.id);
            }}
          >
            View Applicants
          </button>

          <hr />
        </div>
      ))}
      {selectedJob && (
        <div>
          <h2>Applicants for {selectedJob.title}</h2>

          {applicants.length === 0 ? (
            <p>No applicants yet</p>
          ) : (
            applicants.map((app, index) => (
              <div key={index}>
                <p><b>Name:</b> {app.name}</p>
                <p><b>Email:</b> {app.email}</p>
                <p><b>CGPA:</b> {app.cgpa}</p>
                <p><b>Skills:</b> {app.skills?.join(", ")}</p>

                {app.resume && (
                  <a href={app.resume} target="_blank">
                    View Resume
                  </a>
                )}

                <hr />
              </div>
            ))
          )}
        </div>
      )}

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