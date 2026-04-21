"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BriefcaseIcon, MapPinIcon, ChevronLeftIcon, SendIcon, CheckCircleIcon, PaperclipIcon } from "lucide-react";
import Link from "next/link";

export default function JobApplicationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    portfolio: "",
    coverLetter: "",
    resume: "", // URL to resume
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        router.push("/auth");
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) return;
      setLoading(true);

      try {
        // 1. Fetch Job
        const jobDoc = await getDoc(doc(db, "jobs", id as string));
        if (!jobDoc.exists()) {
          alert("Job not found");
          router.push("/student");
          return;
        }
        setJob({ id: jobDoc.id, ...jobDoc.data() });

        // 2. Fetch Student Profile
        const studentDoc = await getDoc(doc(db, "students", user.uid));
        if (studentDoc.exists()) {
          const sData = studentDoc.data();
          setStudent(sData);
          setFormData((prev) => ({
            ...prev,
            name: sData.name || user.displayName || "",
            email: sData.email || user.email || "",
            phone: sData.phone || "",
            resume: sData.resume || "",
          }));
        }

        // 3. Check if already applied
        const q = query(
          collection(db, "applications"),
          where("jobId", "==", id),
          where("studentId", "==", user.uid)
        );
        const appSnap = await getDocs(q);
        if (!appSnap.empty) {
          setAlreadyApplied(true);
        }
      } catch (err) {
        console.error("Error fetching application data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (alreadyApplied) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "applications"), {
        jobId: id,
        studentId: user.uid,
        status: "applied",
        createdAt: new Date(),
        // New fields from form
        applicantName: formData.name,
        applicantEmail: formData.email,
        applicantPhone: formData.phone,
        portfolio: formData.portfolio,
        coverLetter: formData.coverLetter,
        resume: formData.resume,
      });

      setSubmitted(true);
      setTimeout(() => {
        router.push("/student");
      }, 3000);
    } catch (err) {
      console.error("Error submitting application:", err);
      alert("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="sd-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="ad-spinner" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="sd-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div className="sd-modal" style={{ background: 'transparent', border: 'none', boxShadow: 'none' }}>
          <CheckCircleIcon size={80} style={{ color: 'var(--ad-emerald)', marginBottom: '1.5rem' }} />
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Application Sent!</h1>
          <p style={{ color: 'var(--ad-muted)', fontSize: '1.1rem' }}>
            Your application for <strong>{job?.title}</strong> has been successfully submitted.
            <br />
            Redirecting you back to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="sd-layout">
      {/* HEADER */}
      <div className="sd-header-wrap">
        <header className="sd-nav" style={{ padding: '1rem 2rem' }}>
          <Link href="/student" className="sd-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="sd-logo-icon"></div>
            HireLoop
          </Link>
          <div style={{ color: 'var(--ad-muted)', fontSize: '0.9rem' }}>
            Applying to {job?.companyName}
          </div>
        </header>
      </div>

      <div className="sd-content" style={{ maxWidth: '900px', display: 'block' }}>
        {/* BACK BUTTON */}
        <button 
          onClick={() => router.back()} 
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'var(--ad-muted)', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '2rem',
            transition: 'color 0.2s'
          }}
          className="hover:text-white"
        >
          <ChevronLeftIcon size={18} />
          Go Back
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
          {/* LEFT: THE FORM */}
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Job Application</h1>
            <p style={{ color: 'var(--ad-muted)', marginBottom: '2.5rem' }}>
              Complete the form below to apply for this position. Your details will be visible to the recruiter.
            </p>

            {alreadyApplied ? (
              <div style={{ 
                padding: '2rem', 
                background: 'rgba(56, 189, 248, 0.05)', 
                border: '1px solid var(--ad-cyan)', 
                borderRadius: '16px',
                textAlign: 'center'
              }}>
                <CheckCircleIcon size={40} style={{ color: 'var(--ad-cyan)', marginBottom: '1rem' }} />
                <h3>Already Applied</h3>
                <p style={{ color: 'var(--ad-muted)', marginTop: '0.5rem' }}>
                  You have already submitted an application for this position.
                </p>
                <button 
                  className="btn-secondary" 
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => router.push("/student")}
                >
                  Return to Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="sd-application-form-grid">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="sd-form-group">
                    <label>Full Name</label>
                    <Input 
                      placeholder="John Doe" 
                      required 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="sd-form-group">
                    <label>Email Address</label>
                    <Input 
                      placeholder="john@example.com" 
                      type="email" 
                      required 
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="sd-form-group">
                    <label>Phone Number</label>
                    <Input 
                      placeholder="+91 9876543210" 
                      required 
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div className="sd-form-group">
                    <label>Portfolio / Personal Website</label>
                    <Input 
                      placeholder="https://yourportfolio.com" 
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    />
                  </div>
                </div>

                <div className="sd-form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Cover Letter / Why should we hire you?</label>
                  <Textarea 
                    rows={6} 
                    placeholder="Tell the recruiter about your experience and motivation..." 
                    required 
                    value={formData.coverLetter}
                    onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                    style={{ background: 'rgba(15, 23, 42, 0.4)' }}
                  />
                </div>

                <div className="sd-form-group" style={{ marginBottom: '2.5rem' }}>
                  <label>Resume</label>
                  {formData.resume ? (
                    <div style={{ 
                      padding: '1rem', 
                      background: 'rgba(255, 255, 255, 0.02)', 
                      border: '1px solid var(--ad-border)', 
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '8px', 
                        background: 'rgba(56, 189, 248, 0.1)', 
                        display: 'grid', 
                        placeItems: 'center',
                        color: 'var(--ad-cyan)'
                      }}>
                        <PaperclipIcon size={20} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600' }}>Your Profile Resume</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--ad-muted)' }}>This resume will be submitted to the recruiter.</div>
                      </div>
                      <a 
                        href={formData.resume} 
                        target="_blank" 
                        rel="noreferrer" 
                        style={{ color: 'var(--ad-cyan)', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}
                      >
                        View
                      </a>
                    </div>
                  ) : (
                    <div style={{ 
                      padding: '1rem', 
                      background: 'rgba(248, 113, 113, 0.05)', 
                      border: '1px dashed #f87171', 
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <p style={{ color: '#f87171', fontSize: '0.9rem', margin: 0 }}>
                        No resume found in your profile. Please go to your dashboard to upload one.
                      </p>
                      <Link href="/student" style={{ color: 'white', fontSize: '0.85rem', fontWeight: 'bold', display: 'inline-block', marginTop: '0.5rem' }}>
                         Dashboard →
                      </Link>
                    </div>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={submitting || !formData.resume} 
                  className="btn-primary" 
                  style={{ 
                    width: '100%', 
                    height: '3.5rem', 
                    fontSize: '1.1rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '0.75rem',
                    boxShadow: '0 4px 20px rgba(56, 189, 248, 0.2)'
                  }}
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      Submit Application
                      <SendIcon size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* RIGHT: JOB SUMMARY */}
          <div>
            <div style={{ 
              padding: '2rem', 
              background: 'var(--ad-card-bg)', 
              border: '1px solid var(--ad-border)', 
              borderRadius: '20px',
              position: 'sticky',
              top: '2rem'
            }}>
              <div style={{ 
                width: '60px', 
                height: '60px', 
                borderRadius: '14px', 
                background: 'var(--ad-surface)', 
                display: 'grid', 
                placeItems: 'center', 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                border: '1px solid var(--ad-border)',
                marginBottom: '1.5rem'
              }}>
                {job?.companyName ? job.companyName.charAt(0).toUpperCase() : "C"}
              </div>
              
              <h2 style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{job?.title}</h2>
              <p style={{ color: 'var(--ad-cyan)', fontWeight: '600', marginBottom: '1.5rem' }}>{job?.companyName}</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--ad-muted)', fontSize: '0.95rem' }}>
                  <MapPinIcon size={18} />
                  {job?.location || "Remote"}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--ad-muted)', fontSize: '0.95rem' }}>
                  <BriefcaseIcon size={18} />
                  Full-time
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--ad-border)', margin: '1.5rem 0' }} />

              <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Key Requirements</h3>
              <div style={{ color: 'var(--ad-muted)', fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {job?.requirements || "No specific requirements listed."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
