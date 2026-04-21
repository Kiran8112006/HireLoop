"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function StudentPage() {
  const [user, setUser] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      const u = auth.currentUser;
      if (!u) return;
      const docRef = doc(db, "students", u.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setStudent(docSnap.data());
      }
    };
    fetchStudent();
  }, [user]);

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

  return (
    <div>
      <h1>Student Dashboard</h1>
      {student ? (
        <div>
          <p><b>Name:</b> {student.name}</p>
          <p><b>Email:</b> {student.email}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
