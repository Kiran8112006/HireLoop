"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import Papa from "papaparse";

export default function AdminPage() {
  const [recruiters, setRecruiters] = useState<any[]>([]);

  // 🔥 Fetch recruiters
  useEffect(() => {
    const fetchRecruiters = async () => {
      const snapshot = await getDocs(collection(db, "recruiters"));

      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));

      setRecruiters(data);
    };

    fetchRecruiters();
  }, []);

  // ✅ Approve recruiter
  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, "recruiters", id), {
      isApproved: true
    });

    alert("Recruiter approved!");

    // refresh list
    window.location.reload();
  };
 const handleFileUpload = async (e: any) => {
  console.log("UPLOAD TRIGGERED");
  const file = e.target.files[0];
  console.log("FILE:", file);

  if (!file) {
    alert("Please select a file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:5000/upload-students", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    alert(
      data.results
        .map((r: any) => `${r.email}: ${r.status}`)
        .join("\n")
    );

  } catch (err) {
    alert("Upload failed");
  }
};

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Recruiter Requests</h2>

      {recruiters.map((rec) => (
        <div key={rec.id}>
          <p>Email: {rec.email}</p>
          <p>Status: {rec.isApproved ? "Approved" : "Pending"}</p>

          {!rec.isApproved && (
            <button onClick={() => handleApprove(rec.id)}>
              Approve
            </button>
          )}

          <hr />
        </div>
        
      ))}
      <h2>Upload Students CSV</h2>

          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
          />
    </div>
  );
}
