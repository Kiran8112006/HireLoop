"use client";
import { useState } from "react";
import { loginUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { setDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, Grid2x2PlusIcon } from "lucide-react";
import { Particles } from "@/components/ui/particles";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        createdAt: new Date(),
      });

      alert("Signup successful! Wait for admin approval.");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-page">
      <Particles
        color="#b8c0cc"
        quantity={100}
        ease={16}
        minSize={0.35}
        maxSize={1.1}
        className="auth-particles"
      />

      <div aria-hidden className="auth-glow-layer">
        <div className="auth-glow auth-glow-primary" />
        <div className="auth-glow auth-glow-secondary" />
      </div>

      <div className="auth-shell">
        <Button variant="ghost" className="auth-home-btn" asChild>
          <a href="/">
            <ChevronLeftIcon className="icon-sm" />
            Home
          </a>
        </Button>

        <div className="auth-card">
          <div className="auth-brand-row">
            <Grid2x2PlusIcon className="icon-md" />
            <p className="auth-brand">HireLoop</p>
          </div>

          <div className="auth-heading-block">
            <span className="auth-pill">College hiring portal</span>
            <h1 className="auth-heading">Sign in to continue</h1>
            <p className="auth-subtitle">Access your HireLoop account for placements, applications, and approvals.</p>
          </div>

          <div className="auth-form-stack">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="password-wrap">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="password-input"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <Button type="button" size="lg" className="full-width" onClick={handleLogin}>
              Login
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outline"
              className="full-width"
              onClick={handleSignup}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
