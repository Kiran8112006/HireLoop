"use client";

import { useEffect, useState } from "react";
import { auth, db, storage } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

export default function StudentPage() {
  const [user, setUser] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);

  // 🔥 FETCH STUDENT
  useEffect(() => {
    const fetchStudent = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const docRef = doc(db, "students", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStudent(docSnap.data());
      }
    };

    fetchStudent();
  }, []);

  // 🔥 FETCH JOBS
  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "jobs"));

      const jobsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setJobs(jobsList);
    };

    fetchJobs();
  }, []);
  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (u) => {
    if (u) {
      console.log("USER LOADED:", u.uid);
      setUser(u);
    }
  });

  return () => unsubscribe();
}, []);

  // 🔥 APPLY FUNCTION
  const handleApply = async (jobId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    await addDoc(collection(db, "applications"), {
      jobId,
      studentId: user.uid,
      createdAt: new Date(),
    });

    alert("Applied!");
  };

  // 🔥 RESUME UPLOAD
 const handleResumeUpload = async (e: any) => {
  try {
    const file = e.target.files[0];

    if (!file || !user) {
      alert("Missing file or user");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_upload");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    console.log("CLOUDINARY RESPONSE:", data); // 🔥 IMPORTANT

    // 🚨 CHECK IF UPLOAD FAILED
    if (!data.secure_url) {
      alert("Upload failed: " + (data.error?.message || "Unknown error"));
      return;
    }

    const url = data.secure_url;

    await updateDoc(doc(db, "students", user.uid), {
      resume: url,
    });

    alert("Resume uploaded!");

  } catch (err: any) {
    console.error(err);
    alert("Upload failed");
  }
};

  return (
    <div>
      <h1>Student Dashboard</h1>

      {/* STUDENT INFO */}
      {student ? (
        <div>
          <p><b>Name:</b> {student.name}</p>
          <p><b>Email:</b> {student.email}</p>
          <p><b>Major:</b> {student.major}</p>
          <p><b>CGPA:</b> {student.cgpa}</p>
          <p><b>Skills:</b> {student.skills?.join(", ")}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      <hr />

      {/* JOBS */}
      <h2>Available Jobs</h2>

      {jobs.map((job) => (
        <div key={job.id}>
          <p>{job.title}</p>
          <p>{job.salary}</p>

          <button onClick={() => handleApply(job.id)}>
            Apply
          </button>
        </div>
      ))}

      <hr />

      {/* RESUME */}
      <h2>Upload Resume</h2>
      <input
      type="file"
      disabled={!user}
      onChange={handleResumeUpload}
      />
    </div>
  );
}