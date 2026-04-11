import { db } from "./firebase";
import {
  query,
  where,
  getDocs,
  collection,
  updateDoc,
  doc
} from "firebase/firestore";

// Get applicants
export const getApplicants = async (jobId: string) => {
  const q = query(
    collection(db, "applications"),
    where("jobId", "==", jobId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

// Update status
export const updateStatus = async (id: string, status: string) => {
  await updateDoc(doc(db, "applications", id), {
    status
  });
};