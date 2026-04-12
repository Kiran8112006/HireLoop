"use client";
import { useState } from "react";
import { loginUser, sendResetPasswordEmail } from "@/lib/auth";
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
  "auth/missing-email": "Please enter your email address first.",
  "auth/email-already-in-use": "This email is already registered. Try logging in instead.",
  "auth/weak-password": "Password is too weak. Use at least 6 characters.",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network issue detected. Please check your internet connection.",
  "auth/operation-not-allowed": "Password reset is not enabled for this project.",
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

  const [isSignupFlow, setIsSignupFlow] = useState(false);
  const [signupStep, setSignupStep] = useState<"company" | "credentials">("company");
  const [companyName, setCompanyName] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companyLocation, setCompanyLocation] = useState("");
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

    if (!companyName.trim() || !recruiterName.trim()) {
      setError("Please complete the company profile before submitting.");
      return;
    }

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "recruiters", userCred.user.uid), {
        email: email.trim(),
        recruiterName: recruiterName.trim(),
        companyName: companyName.trim(),
        companyWebsite: companyWebsite.trim(),
        companyLocation: companyLocation.trim(),
        isApproved: false,
        approvalStatus: "pending",
        createdAt: new Date(),
        submittedAt: new Date(),
      });

      setSuccessMessage("Signup request sent. Please wait for admin approval.");
      setIsSignupFlow(false);
      setSignupStep("company");
      setCompanyName("");
      setRecruiterName("");
      setCompanyWebsite("");
      setCompanyLocation("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    }
  };

  const handleStartSignup = () => {
    setError("");
    setSuccessMessage("");
    setIsSignupFlow(true);
    setSignupStep("company");
  };

  const handleCancelSignup = () => {
    setError("");
    setSuccessMessage("");
    setIsSignupFlow(false);
    setSignupStep("company");
  };

  const handleContinueToCredentials = () => {
    setError("");
    setSuccessMessage("");

    if (!companyName.trim() || !recruiterName.trim()) {
      setError("Recruiter name and company name are required.");
      return;
    }

    setSignupStep("credentials");
  };

  const handleForgotPassword = async () => {
    setError("");
    setSuccessMessage("");

    try {
      const continueUrl = typeof window !== "undefined" ? `${window.location.origin}/auth` : undefined;
      await sendResetPasswordEmail(email, continueUrl);
      setSuccessMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(getFriendlyAuthError(err));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (!isSignupFlow) {
        handleLogin();
        return;
      }

      if (signupStep === "company") {
        handleContinueToCredentials();
        return;
      }

      handleSignup();
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
            <h1 className="auth-heading">
              {isSignupFlow
                ? signupStep === "company"
                  ? "Create recruiter account"
                  : "Set login credentials"
                : "Sign in to continue"}
            </h1>
            <p className="auth-subtitle">
              {isSignupFlow
                ? signupStep === "company"
                  ? "Step 1 of 2: add your company profile before account credentials."
                  : "Step 2 of 2: add email and password, then send your request for admin approval."
                : "Access your HireLoop account for placements, applications, and approvals."}
            </p>
          </div>

          <div className="auth-form-stack">
            {isSignupFlow && signupStep === "company" && (
              <>
                <Input
                  type="text"
                  placeholder="Recruiter name"
                  value={recruiterName}
                  onChange={(e) => setRecruiterName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Input
                  type="text"
                  placeholder="Company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Input
                  type="url"
                  placeholder="Company website (optional)"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Input
                  type="text"
                  placeholder="Company location (optional)"
                  value={companyLocation}
                  onChange={(e) => setCompanyLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </>
            )}
            {(!isSignupFlow || signupStep === "credentials") && (
              <>
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
              </>
            )}
             {error && <div className="auth-error-message" style={{color: '#ef4444', fontSize: '0.875rem', marginTop: '-8px'}}>{error}</div>}
             {successMessage && <div className="auth-success-message" style={{color: '#22c55e', fontSize: '0.875rem', marginTop: '-8px'}}>{successMessage}</div>}
            {!isSignupFlow && (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  className="full-width auth-forgot-btn"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </Button>
                <Button type="button" size="lg" className="full-width" onClick={handleLogin}>
                  Login
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="full-width"
                  onClick={handleStartSignup}
                >
                  Sign Up
                </Button>
              </>
            )}
            {isSignupFlow && signupStep === "company" && (
              <>
                <Button
                  type="button"
                  size="lg"
                  className="full-width"
                  onClick={handleContinueToCredentials}
                >
                  Continue
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="full-width"
                  onClick={handleCancelSignup}
                >
                  Back to Login
                </Button>
              </>
            )}
            {isSignupFlow && signupStep === "credentials" && (
              <>
                <Button type="button" size="lg" className="full-width" onClick={handleSignup}>
                  Submit for Approval
                </Button>
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  className="full-width"
                  onClick={() => setSignupStep("company")}
                >
                  Back to Company Profile
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
