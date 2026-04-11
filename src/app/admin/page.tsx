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
  const handleFileUpload = (e: any) => {
  const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const students = results.data;

        try {
          await fetch("http://localhost:5000/bulk-create-students", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ students }),
          });

          alert("Students uploaded successfully!");
        } catch (err) {
          console.error(err);
          alert("Upload failed");
        }
      },
    });
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
