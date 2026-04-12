"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import PaymentButton from "../payment/payment";
import { Search, MapPin, Briefcase, SlidersHorizontal, Settings, Bell } from "lucide-react";
import Link from "next/link";

export default function StudentPage() {
  const [user, setUser] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  
  // Modals state
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isUploadResumeModalOpen, setIsUploadResumeModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // ATS State
  const [atsJobTitle, setAtsJobTitle] = useState("");
  const [atsJobDescription, setAtsJobDescription] = useState("");
  const [atsResumeFile, setAtsResumeFile] = useState<File | null>(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsSummary, setAtsSummary] = useState("");
  const [atsError, setAtsError] = useState("");

  // Dark modal subtle glow attributes
  const cardThemes = [
    { bg: "linear-gradient(180deg, rgba(56, 189, 248, 0.15), transparent)", border: "rgba(56, 189, 248, 0.4)" }, // cyan
    { bg: "linear-gradient(180deg, rgba(16, 185, 129, 0.15), transparent)", border: "rgba(16, 185, 129, 0.4)" }, // emerald
    { bg: "linear-gradient(180deg, rgba(139, 92, 246, 0.15), transparent)", border: "rgba(139, 92, 246, 0.4)" }, // violet
    { bg: "linear-gradient(180deg, rgba(245, 158, 11, 0.15), transparent)", border: "rgba(245, 158, 11, 0.4)" }, // amber
    { bg: "linear-gradient(180deg, rgba(248, 113, 113, 0.15), transparent)", border: "rgba(248, 113, 113, 0.4)" }, // red
  ];

  // 🔥 FETCH STUDENT
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
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔥 APPLY FUNCTION
  const handleApply = async (jobId: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, "applications"), {
        jobId,
        studentId: user.uid,
        createdAt: new Date(),
      });
      alert("Applied Successfully!");
    } catch (e) {
      alert("Error applying to job.");
    }
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
      formData.append("resource_type", "auto");

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (!data.secure_url) {
        alert("Upload failed: " + (data.error?.message || "Unknown error"));
        return;
      }
      const url = data.secure_url;
      await updateDoc(doc(db, "students", user.uid), {
        resume: url,
      });
      alert("Resume uploaded successfully!");
      setIsUploadResumeModalOpen(false);
    } catch (err: any) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleAtsAnalyze = async () => {
    if (!atsJobTitle.trim() || !atsJobDescription.trim() || !atsResumeFile) {
      setAtsError("Please fill all fields and select a PDF.");
      return;
    }
    setAtsLoading(true);
    setAtsError("");
    setAtsScore(null);
    setAtsSummary("");

    try {
      const formData = new FormData();
      formData.append("jobTitle", atsJobTitle);
      formData.append("jobDescription", atsJobDescription);
      formData.append("resume", atsResumeFile);

      const response = await fetch("http://localhost:5000/analyze-resume", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("ATS analyze request failed");

      const data = await response.json();
      setAtsScore(typeof data?.job_fit_score === "number" ? data.job_fit_score : null);
      setAtsSummary(typeof data?.summary === "string" ? data.summary : "");
    } catch (err) {
      console.error(err);
      setAtsError("Unable to get ATS score. Ensure backend is running via port 5000.");
    } finally {
      setAtsLoading(false);
    }
  };

  const getRandomTheme = (index: number) => {
    return cardThemes[index % cardThemes.length];
  };

  return (
    <div className="sd-layout">
      {/* HEADER WRAPPER */}
      <div className="sd-header-wrap">
        {/* NAV */}
        <header className="sd-nav">
          <div className="sd-logo">
            <div className="sd-logo-icon"></div>
            HireLoop
          </div>

          <div className="sd-header-search">
            <Search size={18} style={{color: 'var(--ad-muted)'}} />
            <input type="text" placeholder="Search Jobs..." className="sd-header-search-input" />
          </div>

          <div className="sd-nav-right">

            <div className="sd-user-actions">
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,rgba(56,189,248,0.22),rgba(16,185,129,0.26))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', border: '1px solid rgba(148,163,184,0.15)' }}>
                 {student?.name?.charAt(0) || "U"}
              </div>
              <button className="sd-icon-btn"><Settings size={18}/></button>
              <button className="sd-icon-btn"><Bell size={18}/></button>
            </div>
          </div>
        </header>

      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="sd-content">
        {/* LEFT SIDEBAR (Filters/Promo) */}
        <div className="sd-sidebar">
          
          <div className="sd-promo-card">
            <h2 className="sd-promo-title">Land Your Dream Job with HireLoop</h2>
            <button className="sd-promo-btn" onClick={() => setIsAtsModalOpen(true)}>ATS Analyzer</button>
            <div style={{marginTop: '1rem'}}>
              <button className="sd-promo-btn-secondary" onClick={() => setIsUploadResumeModalOpen(true)}>Upload Resume</button>
            </div>
             <div style={{marginTop: '1rem'}}>
              <button className="sd-promo-btn-premium" onClick={() => setIsPaymentModalOpen(true)}>Premium Features</button>
            </div>
          </div>


        </div>

        {/* RIGHT CONTENT (Feed) */}
        <div className="sd-feed">
          <div className="sd-feed-header">
            <div className="sd-feed-title">
              Recommended jobs
              <span className="sd-feed-count">{jobs.length > 0 ? jobs.length : 386}</span>
            </div>
            <div className="sd-sort-by">
              Sort by: <span>Last updated</span> <SlidersHorizontal size={18} style={{marginLeft: '0.5rem', color: '#e5eef8'}}/>
            </div>
          </div>

          <div className="sd-job-grid">
            {jobs.map((job, index) => {
              const theme = getRandomTheme(index);
              return (
                <div key={job.id} className="sd-job-card" style={{borderTopColor: theme.border}}>
                   <div className="sd-job-card-top" style={{ background: theme.bg }}>
                      <div className="sd-job-date-row">
                         <span className="sd-job-date">{new Date().toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                         <button className="sd-job-bookmark">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                         </button>
                      </div>
                      
                      <div className="sd-job-company">{job.companyName || "Company"}</div>
                      
                      <div className="sd-job-title-row">
                         <div className="sd-job-title">{job.title || "Job Title"}</div>
                         <div className="sd-job-logo">
                           {job.companyName ? job.companyName.charAt(0).toUpperCase() : "C"}
                         </div>
                      </div>

                      <div className="sd-job-tags">
                        <span className="sd-job-tag" style={{borderColor: theme.border, color: theme.border}}>Full time</span>
                        <span className="sd-job-tag" style={{borderColor: theme.border, color: theme.border}}>Senior level</span>
                        <span className="sd-job-tag" style={{borderColor: theme.border, color: theme.border}}>Remote</span>
                      </div>
                   </div>
                   
                   <div className="sd-job-bottom">
                      <div className="sd-job-bottom-left">
                         <div className="sd-job-location" style={{marginTop: 'auto'}}>{job.location || "Bengaluru, India"}</div>
                      </div>
                      <button className="sd-job-details-btn" onClick={() => handleApply(job.id)}>Apply</button>
                   </div>
                </div>
              );
            })}
             
             {/* If no jobs (or while loading), mock a few to match design state */}
             {jobs.length === 0 && Array.from({length: 6}).map((_, i) => {
               const theme = getRandomTheme(i);
               const mockCompanies = ["Flipkart", "TCS", "Infosys", "Wipro", "Zomato", "Swiggy"];
               const mockTitles = ["Senior Frontend Developer", "System Engineer", "Java Architect", "Backend Developer", "UI/UX Designer", "Product Manager"];
               const mockLocations = ["Bengaluru, India", "Mumbai, India", "Pune, India", "Hyderabad, India", "Gurugram, India", "Bengaluru, India"];
               return (
                <div key={i} className="sd-job-card" style={{borderTop: `2px solid ${theme.border}`}}>
                   <div className="sd-job-card-top" style={{ background: theme.bg }}>
                      <div className="sd-job-date-row">
                         <span className="sd-job-date">20 Oct, 2023</span>
                         <button className="sd-job-bookmark">
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                         </button>
                      </div>
                      <div className="sd-job-company">{mockCompanies[i]}</div>
                      <div className="sd-job-title-row">
                         <div className="sd-job-title" style={{maxWidth: '70%'}}>{mockTitles[i]}</div>
                         <div className="sd-job-logo">{mockCompanies[i].charAt(0)}</div>
                      </div>
                      <div className="sd-job-tags">
                        <span className="sd-job-tag">Full time</span>
                        <span className="sd-job-tag">Remote</span>
                      </div>
                   </div>
                   <div className="sd-job-bottom">
                      <div className="sd-job-bottom-left">
                         <div className="sd-job-location">{mockLocations[i]}</div>
                      </div>
                      <button className="sd-job-details-btn">Details</button>
                   </div>
                </div>
               )
             })}
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      
      {/* ATS Modal */}
      {isAtsModalOpen && (
        <div className="sd-modal-overlay">
          <div className="sd-modal">
            <button className="sd-modal-close" onClick={() => setIsAtsModalOpen(false)}>×</button>
            <h2>ATS Analyzer</h2>
            <div className="sd-form-group">
              <label>Job Title</label>
              <input type="text" value={atsJobTitle} onChange={(e) => setAtsJobTitle(e.target.value)} placeholder="e.g. Frontend Engineer" />
            </div>
            <div className="sd-form-group">
              <label>Job Description</label>
              <textarea rows={4} value={atsJobDescription} onChange={(e) => setAtsJobDescription(e.target.value)} placeholder="Paste full JD here..." />
            </div>
            <div className="sd-form-group">
              <label>Upload Output PDF Resume</label>
              <input type="file" accept="application/pdf" onChange={(e) => setAtsResumeFile(e.target.files?.[0] ?? null)} style={{padding: '0.5rem 0', color: '#e5eef8'}} />
            </div>
            
            <button className="btn-primary" style={{width: '100%', marginTop: '1rem'}} onClick={handleAtsAnalyze} disabled={atsLoading}>
              {atsLoading ? "Analyzing..." : "Get ATS Score"}
            </button>

            {atsError && <p style={{ color: "#f87171", marginTop: '1rem' }}>{atsError}</p>}
            
            {atsScore !== null && (
               <div className="sd-score-card">
                 <h3>Score: {atsScore}%</h3>
                 <p style={{fontSize: '0.9rem', color: '#10b981'}}>{atsSummary}</p>
               </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Resume Modal */}
      {isUploadResumeModalOpen && (
        <div className="sd-modal-overlay">
          <div className="sd-modal">
            <button className="sd-modal-close" onClick={() => setIsUploadResumeModalOpen(false)}>×</button>
            <h2>Upload Resume</h2>
            <p style={{marginBottom: '1.5rem', color: 'var(--ad-muted)'}}>Upload your resume to your profile to quickly apply to jobs.</p>
            <div className="sd-form-group">
              <input type="file" onChange={handleResumeUpload} style={{padding: '1rem 0', color: 'var(--ad-text)'}} />
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="sd-modal-overlay">
          <div className="sd-modal">
            <button className="sd-modal-close" onClick={() => setIsPaymentModalOpen(false)}>×</button>
            <h2>Upgrade to Premium</h2>
             <p style={{marginBottom: '1.5rem', color: 'var(--ad-muted)'}}>Unlock unlimited job applications and advanced ATS resume scanning tools.</p>
            <div style={{padding: '2rem', background: 'var(--ad-surface)', border: '1px solid var(--ad-border)', borderRadius: '16px', textAlign: 'center'}}>
               <h3 style={{fontSize: '2rem', margin: '0 0 1rem 0'}}>₹1000<span style={{fontSize: '1rem', color: 'var(--ad-muted)', fontWeight: 'normal'}}>/month</span></h3>
               <PaymentButton amount={1000} orderType="subscription" userId={auth.currentUser?.uid || ""} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

