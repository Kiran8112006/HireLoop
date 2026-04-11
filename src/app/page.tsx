"use client";
import { useState } from "react";
import { loginUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);

      if (res.role === "admin") {
        router.push("/admin");
      } else if (res.role === "student") {
        router.push("/student");
      } else {
        router.push("/recruiter");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message); 
    }
  };
  const handleSignup = async () => {
  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "recruiters", userCred.user.uid), {
      email,
      isApproved: false,
      createdAt: new Date()
    });

    alert("Signup successful! Wait for admin approval.");
  } catch (err: any) {
    alert(err.message);
  }
};

  return (
    <div>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}
