import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";

export const loginUser = async (email: string, password: string) => {
 
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const uid = userCred.user.uid;

 
  const adminDoc = await getDoc(doc(db, "admins", uid));
  if (adminDoc.exists()) {
    return { role: "admin", uid };
  }

  
  const studentDoc = await getDoc(doc(db, "students", uid));
  if (studentDoc.exists()) {
    return { role: "student", uid };
  }

 
  const recruiterDoc = await getDoc(doc(db, "recruiters", uid));
  if (recruiterDoc.exists()) {
    const data = recruiterDoc.data();

    if (!data.isApproved) {
      throw new Error("Waiting for admin approval");
    }

    return { role: "recruiter", uid };
  }

  // ❌ If no role found
  throw new Error("User role not found");
};

export const sendResetPasswordEmail = async (email: string, continueUrl?: string) => {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    throw new Error("Please enter your email address first.");
  }

  await sendPasswordResetEmail(
    auth,
    normalizedEmail,
    continueUrl ? { url: continueUrl, handleCodeInApp: false } : undefined
  );
};