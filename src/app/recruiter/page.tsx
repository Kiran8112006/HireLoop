"use client";
import { useState, useEffect } from "react"; // Added useEffect
import { onAuthStateChanged } from "firebase/auth"; // Added this import
import { auth } from "@/lib/firebase";
import PaymentButton from "../payment/payment";
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