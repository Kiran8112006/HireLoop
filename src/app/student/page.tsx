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
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import PaymentButton from "../payment/payment";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function StudentPage() {
  const [user, setUser] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicationsByJob, setApplicationsByJob] = useState<Record<string, any>>({});
  const [isApplyingJobId, setIsApplyingJobId] = useState<string | null>(null);
  const router = useRouter();
  
  // Modals state
  const [isAtsModalOpen, setIsAtsModalOpen] = useState(false);
  const [isUploadResumeModalOpen, setIsUploadResumeModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAppModalOpen, setIsAppModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);

  // Search & Sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest, oldest, name
  const [sortOpen, setSortOpen] = useState(false);

  // ATS State
  const [atsJobTitle, setAtsJobTitle] = useState("");
  const [atsJobDescription, setAtsJobDescription] = useState("");
  const [atsResumeFile, setAtsResumeFile] = useState<File | null>(null);
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [atsSummary, setAtsSummary] = useState("");
  const [atsError, setAtsError] = useState("");

  const theme = { bg: "linear-gradient(180deg, rgba(56, 189, 248, 0.08), transparent)", border: "var(--ad-border)" };

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

  // 🔥 FETCH JOBS & APPLICATIONS
  useEffect(() => {
    const fetchJobs = async () => {
      const snapshot = await getDocs(collection(db, "jobs"));
      const jobsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAtDate: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date(),
      }));
      setJobs(jobsList);
    };

    const fetchApplications = async () => {
      const u = auth.currentUser;
      if (!u) return;
      const q = query(collection(db, "applications"), where("studentId", "==", u.uid));
      const snap = await getDocs(q);
      const apps: Record<string, any> = {};
      snap.docs.forEach(d => {
        apps[d.data().jobId] = { id: d.id, ...d.data() };
      });
      setApplicationsByJob(apps);
    };

    fetchJobs();
    fetchApplications();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter and Sort Jobs
  const filteredAndSortedJobs = jobs
    .filter((job) => {
      const titleMatch = (job.title || "").toLowerCase().includes(searchTerm.toLowerCase());
      const companyMatch = (job.companyName || "").toLowerCase().includes(searchTerm.toLowerCase());
      return titleMatch || companyMatch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return b.createdAtDate - a.createdAtDate;
      if (sortBy === "oldest") return a.createdAtDate - b.createdAtDate;
      if (sortBy === "name") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });

  const getApplicationStatusLabel = (status: string | undefined) => {
    const normalized = (status || "applied").toLowerCase();
    if (normalized === "interview_scheduled") return "Interview Scheduled";
    if (normalized === "shortlisted") return "Shortlisted";
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
  };

  const appliedJobs = jobs.filter((job) => !!applicationsByJob[job.id]);

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

      const response = await fetch("https://hireloop-vy61.onrender.com/analyze-resume", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("ATS analyze request failed");

      const data = await response.json();
      setAtsScore(typeof data?.job_fit_score === "number" ? data.job_fit_score : null);
      setAtsSummary(typeof data?.summary === "string" ? data.summary : "");
    } catch (err) {
      console.error(err);
      setAtsError("Unable to get ATS score. Please ensure the backend service is available.");
    } finally {
      setAtsLoading(false);
    }
  };

  // 🔥 APPLY FUNCTION
  const handleApply = (jobId: string) => {
    if (!user) {
      alert("Please login to apply");
      return;
    }
    router.push(`/student/apply/${jobId}`);
  };

  const sortLabels: Record<string, string> = {
    newest: "Last updated",
    oldest: "Oldest first",
    name: "A-Z Name"
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
            <input 
              type="text" 
              placeholder="Search Jobs..." 
              className="sd-header-search-input" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sd-nav-right">
            <Link href="/student/profile" className="sd-nav-link">Profile</Link>
            <button 
              className="sd-icon-btn" 
              onClick={() => auth.signOut().then(() => router.push("/auth"))}
              title="Logout"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>

        </header>
      </div>

      {/* MAIN CONTENT SPLIT */}
      <div className="sd-content">
        {/* LEFT SIDEBAR (Filters/Promo) */}
        <div className="sd-sidebar">
          
          <div className="sd-promo-card-premium">
            <h2 className="sd-promo-title-premium">Land Your Dream Job with HireLoop</h2>
            <button className="sd-promo-btn-premium-solid" onClick={() => setIsAtsModalOpen(true)}>ATS Analyzer</button>
            <div style={{marginTop: '0.75rem'}}>
              <button className="sd-promo-btn-premium-outline" onClick={() => setIsUploadResumeModalOpen(true)}>Upload Resume</button>
            </div>
            <div style={{marginTop: '0.75rem'}}>
              <button className="sd-promo-btn-premium-outline" onClick={() => router.push("/student/profile")}>Edit Profile</button>
            </div>
             <div style={{marginTop: '0.75rem'}}>
              <button className="sd-promo-btn-premium-gold" onClick={() => setIsPaymentModalOpen(true)}>Premium Features</button>
            </div>
          </div>

          <div className="sd-applications-card">
            <h3 className="sd-applications-title">My Applications</h3>
            {appliedJobs.length === 0 ? (
              <p className="sd-applications-empty">No applications yet.</p>
            ) : (
              <div className="sd-application-list">
                {appliedJobs.map(job => (
                  <div 
                    key={job.id} 
                    className="sd-application-item" 
                    onClick={() => {
                      setSelectedApplication({ job, application: applicationsByJob[job.id] });
                      setIsAppModalOpen(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="sd-application-item-title">{job.title}</div>
                    <div className="sd-application-item-company">{job.companyName}</div>
                    <div className="sd-application-status-chip">{getApplicationStatusLabel(applicationsByJob[job.id]?.status)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CONTENT (Feed) */}
        <div className="sd-feed">
          <div className="sd-feed-header">
            <div className="sd-feed-title">
              Recommended jobs
              <span className="sd-feed-count">{filteredAndSortedJobs.length}</span>
            </div>
            <div className="sd-sort-wrapper">
              <span style={{color: 'var(--ad-muted)', fontSize: '0.9rem'}}>Sort by:</span>
              <div className="sd-custom-dropdown">
                <div 
                  className={`sd-dropdown-toggle ${sortOpen ? 'active' : ''}`} 
                  onClick={() => setSortOpen(!sortOpen)}
                >
                  {sortLabels[sortBy]}
                   <span className="sd-dropdown-chevron">▼</span>
                </div>
                {sortOpen && (
                  <div className="sd-dropdown-menu">
                    {Object.entries(sortLabels).map(([key, label]) => (
                      <div 
                        key={key} 
                        className={`sd-dropdown-item ${sortBy === key ? 'selected' : ''}`}
                        onClick={() => {
                          setSortBy(key);
                          setSortOpen(false);
                        }}
                      >
                        {label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="sd-job-grid">
            {filteredAndSortedJobs.map((job) => {
              const application = applicationsByJob[job.id];
              const alreadyApplied = !!application;
              return (
                <div key={job.id} className="sd-job-card">
                   <div 
                     className="sd-job-card-top" 
                     style={{ background: theme.bg, cursor: 'pointer' }}
                     onClick={() => router.push(`/student/jobs/${job.id}`)}
                   >
                      <div className="sd-job-date-row">
                         <span className="sd-job-date">{new Date(job.createdAtDate).toLocaleDateString('en-GB', {day: 'numeric', month: 'short', year: 'numeric'})}</span>
                         <button className="sd-job-bookmark" onClick={(e) => e.stopPropagation()}>
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
                        <span className="sd-job-tag">Full time</span>
                        <span className="sd-job-tag">Remote</span>
                      </div>
                   </div>
                   
                   <div className="sd-job-bottom">
                      <div className="sd-job-bottom-left">
                         <div className="sd-job-location" style={{marginTop: 'auto'}}>{job.location || "Bengaluru, India"}</div>
                      </div>
                      {alreadyApplied ? (
                        <span className="sd-applied-text">Applied</span>
                      ) : (
                        <button 
                          className="sd-job-details-btn" 
                          onClick={() => handleApply(job.id)}
                          disabled={isApplyingJobId === job.id}
                        >
                          {isApplyingJobId === job.id ? "..." : "Apply"}
                        </button>
                      )}
                   </div>
                </div>
              );
            })}
             
             {filteredAndSortedJobs.length === 0 && (
               <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--ad-muted)'}}>
                 No jobs found matching "{searchTerm}"
               </div>
             )}
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
      {/* Application Details Modal */}
      {isAppModalOpen && selectedApplication && (
        <div className="sd-modal-overlay">
          <div className="sd-modal" style={{maxWidth: '700px'}}>
            <button className="sd-modal-close" onClick={() => setIsAppModalOpen(false)}>×</button>
            <div className="sd-job-logo" style={{width: '60px', height: '60px', fontSize: '1.5rem', marginBottom: '1rem'}}>
              {selectedApplication.job.companyName ? selectedApplication.job.companyName.charAt(0).toUpperCase() : "C"}
            </div>
            <h2 style={{margin: '0.5rem 0 0.25rem 0'}}>{selectedApplication.job.title}</h2>
            <p style={{color: 'var(--ad-cyan)', fontWeight: '600', marginBottom: '1rem'}}>{selectedApplication.job.companyName}</p>
            
            <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
               <span className="sd-job-tag">{selectedApplication.job.location || "Remote"}</span>
               <span className="sd-job-tag">Full time</span>
               <div className="sd-application-status-chip" style={{fontSize: '0.85rem', padding: '0.4rem 0.8rem'}}>
                 Status: {getApplicationStatusLabel(selectedApplication.application?.status)}
               </div>
            </div>

            <hr />
            
            <div className="sd-form-group">
              <label>Job Description</label>
              <div style={{color: 'var(--ad-muted)', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap'}}>
                {selectedApplication.job.description || "No description provided."}
              </div>
            </div>

            <div className="sd-form-group" style={{marginTop: '2rem'}}>
              <label>Requirements</label>
              <div style={{color: 'var(--ad-muted)', lineHeight: '1.6', fontSize: '0.95rem', whiteSpace: 'pre-wrap'}}>
                {selectedApplication.job.requirements || "No specific requirements listed."}
              </div>
            </div>

            <div style={{marginTop: '2rem', display: 'flex', justifyContent: 'flex-end'}}>
               <button className="btn-secondary" onClick={() => setIsAppModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

