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

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/missing-password": "Please enter your password.",
  "auth/invalid-credential": "Email or password is incorrect.",
  "auth/user-not-found": "No account exists with this email.",
  "auth/wrong-password": "Email or password is incorrect.",
  "auth/email-already-in-use": "This email is already registered. Try logging in instead.",
  "auth/weak-password": "Password is too weak. Use at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network issue detected. Please check your internet connection.",
};

function getFriendlyAuthError(err: unknown): string {
  let code = "";
  let message = "";

  if (typeof err === "object" && err !== null) {
    const maybeCode = (err as { code?: unknown }).code;
    const maybeMessage = (err as { message?: unknown }).message;
    if (typeof maybeCode === "string") code = maybeCode;
    if (typeof maybeMessage === "string") message = maybeMessage;
  }

  if (!code && message) {
    const match = message.match(/auth\/[a-z-]+/i);
    if (match) code = match[0].toLowerCase();
  }

  if (code && AUTH_ERROR_MESSAGES[code]) {
    return AUTH_ERROR_MESSAGES[code];
  }

  return "Something went wrong. Please try again.";
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async () => {
    setError("");
    setSuccessMessage("");
    try {
      const res = await loginUser(email, password);

      if (res.role === "admin") {
        router.push("/admin");
      } else if (res.role === "student") {
        router.push("/student");
      } else {
        router.push("/recruiter");
      }
    } catch (err) {
      console.error(err);
      setError(getFriendlyAuthError(err));
    }
  };

  const handleSignup = async () => {
    setError("");
    setSuccessMessage("");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "recruiters", userCred.user.uid), {
        email,
        isApproved: false,
        createdAt: new Date(),
      });

      setSuccessMessage("Signup successful! Wait for admin approval.");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
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
             {error && <div className="auth-error-message" style={{color: '#ef4444', fontSize: '0.875rem', marginTop: '-8px'}}>{error}</div>}
             {successMessage && <div className="auth-success-message" style={{color: '#22c55e', fontSize: '0.875rem', marginTop: '-8px'}}>{successMessage}</div>}
            <div className="password-wrap">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                 onKeyDown={handleKeyDown}
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
