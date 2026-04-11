"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

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
    </div>
  );
}
