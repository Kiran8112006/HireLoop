import { db } from "./firebase";
import {
  addDoc,
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

// Create job
export const createJob = async (jobData: any, recruiterId: string) => {
  await addDoc(collection(db, "jobs"), {
    ...jobData,
    recruiterId,
    createdAt: new Date()
  });
};

// Get recruiter jobs
export const getMyJobs = async (recruiterId: string) => {
  const q = query(
    collection(db, "jobs"),
    where("recruiterId", "==", recruiterId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};