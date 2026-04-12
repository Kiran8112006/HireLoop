"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, query, where, doc, getDoc, orderBy } from "firebase/firestore";
import {
  Building2Icon,
  BriefcaseIcon,
  LayoutDashboardIcon,
  PlusCircleIcon,
  LogOutIcon,
  ChevronRightIcon,
  SearchIcon,
  BellIcon,
  ChevronLeftIcon,
  ExternalLinkIcon,
  UserIcon,
  CoinsIcon,
  TrendingDownIcon,
  TrendingUpIcon
} from "lucide-react";
import PaymentButton from "@/app/payment/payment";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarInput } from "@/components/ui/calendar-input";
export default function RecruiterPage() {
  const router = useRouter();

  // Data State
  const [jobs, setJobs] = useState<any[]>([]);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCredits, setTotalCredits] = useState(0);
  const [creditsHistory, setCreditsHistory] = useState<any[]>([]);

  // UI State
  const [activeView, setActiveView] = useState<"overview" | "jobs" | "post-job" | "credits">("overview");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Post Job State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  // Fetch credits info directly from Firestore
  const fetchCreditsInfo = async (uid: string) => {
    try {
      // 1. Fetch main recruiter doc to get balance
      const recruiterRef = doc(db, "recruiters", uid);
      const docSnap = await getDoc(recruiterRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Backend utilizes both "credits" and "totalCredits" depending on the context, so check both
        setTotalCredits(data.totalCredits ?? data.credits ?? 0);
      }

      // 2. Fetch credits subcollection history
      const creditsColRef = collection(db, "recruiters", uid, "credits");
      const creditsQuery = query(creditsColRef, orderBy("timestamp", "desc"));
      const snapshot = await getDocs(creditsQuery);
      
      const history = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setCreditsHistory(history);
      
    } catch (err) {
      console.error("Failed to fetch credits info from firestore", err);
    }
  };

  useEffect(() => {
    const fetchJobs = async (uid: string) => {
      try {
        const q = query(
          collection(db, "jobs"),
          where("recruiterId", "==", uid)
        );
        const snapshot = await getDocs(q);
        const jobList = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setJobs(jobList);
        // Fetch credits info
        await fetchCreditsInfo(uid);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchJobs(user.uid);
      } else {
        setLoading(false);
        router.push("/auth");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const fetchApplicants = async (jobId: string) => {
    setApplicants([]);
    const q = query(
      collection(db, "applications"),
      where("jobId", "==", jobId)
    );
    const snapshot = await getDocs(q);
    const applicantsData: any[] = [];

    for (const docSnap of snapshot.docs) {
      const appData = docSnap.data();
      const studentRef = doc(db, "students", appData.studentId);
      const studentSnap = await getDoc(studentRef);

      if (studentSnap.exists()) {
        const studentData = studentSnap.data();
        applicantsData.push({
          id: docSnap.id,
          ...(studentData || {}),
          applicationStatus: appData.status,
          applicationResume: appData.resume,
        });
      }
    }
    setApplicants(applicantsData);
  };

  const handlePostJob = async () => {
    if (!title || !description || !startDate || !endDate) {
      alert("Please fill all fields");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("Login first");
      return;
    }

    setIsPosting(true);

    try {
      const recruiterDocRef = doc(db, "recruiters", user.uid);
      const recruiterSnap = await getDoc(recruiterDocRef);
      
      let fetchedCompanyName = "Unknown Company";
      if (recruiterSnap.exists()) {
        const recruiterData = recruiterSnap.data();
        fetchedCompanyName = recruiterData.company ?? recruiterData.companyName ?? "Unknown Company";
      }

      const res = await fetch("http://localhost:5000/post-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: user.uid,
          companyName: fetchedCompanyName,
          title,
          description,
          startDate,
          endDate,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        setIsPosting(false);
        return;
      }

      alert("Job posted successfully!");

      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");

      // Refresh jobs list
      const q = query(collection(db, "jobs"), where("recruiterId", "==", user.uid));
      const snapshot = await getDocs(q);
      const jobList = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setJobs(jobList);
      
      setActiveView("jobs");
    } catch (err) {
      alert("Error posting job");
    } finally {
      setIsPosting(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth");
  };

  const openJobApplicants = (job: any) => {
    setSelectedJob(job);
    fetchApplicants(job.id);
  };

  const filteredJobs = jobs.filter(
    (j) =>
      (j.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.companyName ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---- Nav config ----------------------------------------------- */
  type ViewKey = typeof activeView;
  const navItems: { key: ViewKey; label: string; icon: any; group: 1 | 2; badge?: number }[] = [
    { key: "overview", label: "Dashboard", icon: LayoutDashboardIcon, group: 1 },
    { key: "jobs", label: "My Jobs", icon: BriefcaseIcon, group: 2, badge: jobs.length || undefined },
    { key: "post-job", label: "Post a Job", icon: PlusCircleIcon, group: 2 },
    { key: "credits", label: "Credits", icon: CoinsIcon, group: 2, badge: Math.floor(totalCredits) || undefined },
  ];

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */
  return (
    <div className="ad-shell">
      {/* =========================================================== */}
      {/*  SIDEBAR                                                     */}
      {/* =========================================================== */}
      <aside className="ad-sidebar">
        <div className="ad-sb-brand">
          <div className="ad-sb-logo">
            <Building2Icon className="ad-sb-logo-icon" />
          </div>
          <span className="ad-sb-brand-name">HireLoop</span>
        </div>

        <div className="ad-sb-profile">
          <div className="ad-sb-avatar">
            <UserIcon className="w-5 h-5 text-[var(--ad-muted)]" />
          </div>
          <div className="ad-sb-profile-info">
            <span className="ad-sb-profile-name">Recruiter</span>
            <span className="ad-sb-profile-email">{auth.currentUser?.email ?? "Welcome back"}</span>
          </div>
          <ChevronRightIcon className="ad-sb-profile-chev" />
        </div>

        {([1, 2] as const).map((group, gi) => {
          const items = navItems.filter((n) => n.group === group);
          return (
            <div key={group}>
              {gi > 0 && <div className="ad-sb-divider" />}
              <nav className="ad-sb-nav">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      className={`ad-sb-link${
                        activeView === item.key && !selectedJob ? " ad-sb-link-active" : ""
                      }`}
                      onClick={() => {
                        setActiveView(item.key);
                        setSelectedJob(null);
                      }}
                    >
                      <Icon className="ad-sb-link-icon" />
                      <span>{item.label}</span>
                      {item.badge && item.badge > 0 && (
                        <span className="ad-sb-badge">{item.badge}</span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          );
        })}

        <div className="ad-sb-spacer" />

        <button className="ad-sb-link ad-sb-logout" onClick={handleLogout}>
          <LogOutIcon className="ad-sb-link-icon" />
          <span>Logout</span>
        </button>
      </aside>

      {/* =========================================================== */}
      {/*  MAIN CONTENT                                                */}
      {/* =========================================================== */}
      <main className="ad-main">
        <header className="ad-topbar">
          <h1 className="ad-topbar-title">
            {activeView === "overview" && "Dashboard Overview"}
            {activeView === "jobs" && !selectedJob && "My Jobs"}
            {activeView === "jobs" && selectedJob && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button 
                  onClick={() => setSelectedJob(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ad-muted)', display: 'flex', alignItems: 'center' }}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                  <span style={{ fontSize: '0.9rem' }}>Back</span>
                </button>
                <div style={{ width: '1px', height: '20px', background: 'var(--ad-border)', margin: '0 0.5rem' }} />
                Applicants for {selectedJob.title}
              </span>
            )}
            {activeView === "post-job" && "Post a New Job"}
            {activeView === "credits" && "Credits Management"}
          </h1>

          <div className="ad-topbar-right">
            {(activeView === "jobs" || activeView === "overview") && !selectedJob && (
              <div className="ad-search">
                <SearchIcon className="ad-search-icon" />
                <input
                  className="ad-search-input"
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <button className="ad-topbar-bell" title="Notifications">
              <BellIcon className="ad-topbar-bell-icon" />
            </button>
          </div>
        </header>

        {loading ? (
          <div className="ad-loading">
            <div className="ad-spinner" />
            <p>Loading your profile…</p>
          </div>
        ) : (
          <div className="ad-content">
            {/* ================== OVERVIEW ================== */}
            {activeView === "overview" && (
              <div className="ad-fade">
                <section className="ad-grid-3">
                  <div className="ad-card">
                    <h3 className="ad-card-label">Overall Stats</h3>
                    <p className="ad-card-headline" style={{ fontSize: '2rem', display: 'block', marginTop: '0.5rem' }}>
                      <strong>{jobs.length}</strong>
                    </p>
                    <span className="ad-exec-trend" style={{ opacity: 0.8 }}>
                      Total Jobs Posted
                    </span>
                  </div>

                  <div className="ad-card">
                    <h3 className="ad-card-label">Credits Balance</h3>
                    <p className="ad-card-headline" style={{ fontSize: '2rem', display: 'block', marginTop: '0.5rem', color: '#10b981' }}>
                      <strong>{totalCredits}</strong>
                    </p>
                    <span className="ad-exec-trend" style={{ opacity: 0.8 }}>
                      Available Credits
                    </span>
                  </div>

                  <div className="ad-card">
                    <h3 className="ad-card-label">Quick Actions</h3>
                    <div className="ad-action-grid">
                      <button
                        className="ad-action-tile"
                        onClick={() => setActiveView("post-job")}
                      >
                        <PlusCircleIcon className="ad-action-tile-icon" />
                        Post a Job
                      </button>
                      <button
                        className="ad-action-tile"
                        onClick={() => setActiveView("credits")}
                      >
                        <CoinsIcon className="ad-action-tile-icon" />
                        Buy Credits
                      </button>
                    </div>
                  </div>
                </section>

                <section className="ad-card ad-card-full" style={{ marginTop: '1.5rem' }}>
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">Recent Job Postings</h3>
                    {jobs.length > 5 && (
                      <button
                        className="ad-view-all"
                        onClick={() => setActiveView("jobs")}
                      >
                        View All Jobs →
                      </button>
                    )}
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th className="ad-th-narrow">#</th>
                          <th>Job Title</th>
                          <th>Company</th>
                          <th>Duration</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="ad-td-empty">
                              You haven't posted any jobs yet.
                            </td>
                          </tr>
                        ) : (
                          jobs.slice(0, 5).map((job, idx) => (
                            <tr key={job.id}>
                              <td className="ad-td-index">{idx + 1}</td>
                              <td className="ad-td-bold" style={{ color: 'var(--ad-text)' }}>{job.title ?? "Untitled"}</td>
                              <td style={{ color: 'var(--ad-muted)' }}>{job.companyName ?? "—"}</td>
                              <td style={{ color: 'var(--ad-muted)' }}>{job.startDate} to {job.endDate}</td>
                              <td>
                                <button
                                  className="ad-task-action"
                                  onClick={() => {
                                    setActiveView("jobs");
                                    openJobApplicants(job);
                                  }}
                                >
                                  View Applicants
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {/* ================== JOBS & APPLICANTS ================== */}
            {activeView === "jobs" && !selectedJob && (
              <div className="ad-fade">
                <div className="ad-card ad-card-full">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">Your Postings</h3>
                    <span className="ad-count-pill">{filteredJobs.length} listings</span>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th className="ad-th-narrow">#</th>
                          <th>Job Title</th>
                          <th>Company</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJobs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="ad-td-empty">
                              No jobs found.
                            </td>
                          </tr>
                        ) : (
                          filteredJobs.map((job, idx) => (
                            <tr key={job.id}>
                              <td className="ad-td-index">{idx + 1}</td>
                              <td className="ad-td-bold" style={{ color: 'var(--ad-text)' }}>
                                {job.title ?? "Untitled"}
                              </td>
                              <td style={{ color: 'var(--ad-muted)' }}>{job.companyName ?? "—"}</td>
                              <td style={{ color: 'var(--ad-muted)' }}>{job.startDate ?? "—"}</td>
                              <td style={{ color: 'var(--ad-muted)' }}>{job.endDate ?? "—"}</td>
                              <td>
                                <button
                                  className="ad-task-action"
                                  onClick={() => openJobApplicants(job)}
                                >
                                  View Applicants
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Applicants View */}
            {activeView === "jobs" && selectedJob && (
              <div className="ad-fade">
                <div className="ad-card ad-card-full">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">
                      Applicants submitted
                    </h3>
                    <span className="ad-count-pill">{applicants.length} total</span>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th className="ad-th-narrow">#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>CGPA</th>
                          <th>Skills</th>
                          <th>Resume</th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicants.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="ad-td-empty">
                              No applicants yet for this listing.
                            </td>
                          </tr>
                        ) : (
                          applicants.map((app, idx) => (
                            <tr key={idx}>
                              <td className="ad-td-index">{idx + 1}</td>
                              <td className="ad-td-bold" style={{ color: 'var(--ad-text)' }}>{app.name ?? "—"}</td>
                              <td style={{ color: 'var(--ad-muted)' }}>{app.email ?? app.contactEmail ?? "—"}</td>
                              <td style={{ color: 'var(--ad-muted)' }}>{app.cgpa ?? "—"}</td>
                              <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--ad-muted)' }}>
                                {app.skills?.join(", ") ?? "—"}
                              </td>
                              <td>
                                {app.resume || app.applicationResume ? (
                                  <a
                                    href={app.resume || app.applicationResume}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="ad-task-action"
                                    style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                                  >
                                    <ExternalLinkIcon className="w-4 h-4" /> View
                                  </a>
                                ) : (
                                  <span className="ad-muted">—</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================== POST JOB ================== */}
            {activeView === "post-job" && (
              <div className="ad-fade">
                <div style={{ maxWidth: '600px', margin: '0 auto' }} className="ad-card">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">Create a New Job Listing</h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ad-text)' }}>Job Title</label>
                      <Input
                        placeholder="e.g. Frontend Engineer"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ad-text)' }}>Job Description</label>
                      <Textarea
                        placeholder="Describe the role..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ad-text)' }}>Start Date</label>
                        <CalendarInput
                          value={startDate}
                          onChange={(val) => setStartDate(val)}
                          placeholder="Select start date"
                        />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--ad-text)' }}>End Date</label>
                        <CalendarInput
                          value={endDate}
                          onChange={(val) => setEndDate(val)}
                          placeholder="Select end date"
                        />
                      </div>
                    </div>

                    <div style={{ height: '1px', background: 'var(--ad-border)', margin: '1rem 0' }} />
                    
                    <div>
                      {/* Submission area */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                        <button
                          className="ad-task-action"
                          style={{ 
                            padding: '0.6rem 1.2rem', 
                            fontSize: '0.9rem', 
                            background: 'var(--ad-accent)', 
                            color: '#fff', 
                            opacity: (!title || !description || !startDate || !endDate || isPosting) ? 0.5 : 1,
                            cursor: (!title || !description || !startDate || !endDate || isPosting) ? 'not-allowed' : 'pointer'
                          }}
                          disabled={!title || !description || !startDate || !endDate || isPosting}
                          onClick={handlePostJob}
                        >
                          {isPosting ? "Posting..." : "Post Job Listing"}
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}

            {/* ================== CREDITS ================== */}
            {activeView === "credits" && (
              <div className="ad-fade">
                <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                  <div className="ad-card" style={{ borderLeft: '4px solid #10b981' }}>
                    <h3 className="ad-card-label">Total Balance</h3>
                    <p className="ad-card-headline" style={{ fontSize: '2.5rem', display: 'block', marginTop: '0.5rem', color: '#10b981' }}>
                      <strong>{totalCredits}</strong>
                    </p>
                    <span className="ad-exec-trend" style={{ opacity: 0.8 }}>
                      Available Credits
                    </span>
                  </div>

                  <div className="ad-card" style={{ borderLeft: '4px solid #8b5cf6' }}>
                    <h3 className="ad-card-label">Total Transactions</h3>
                    <p className="ad-card-headline" style={{ fontSize: '2.5rem', display: 'block', marginTop: '0.5rem', color: '#8b5cf6' }}>
                      <strong>{creditsHistory.length}</strong>
                    </p>
                    <span className="ad-exec-trend" style={{ opacity: 0.8 }}>
                      Total History Entries
                    </span>
                  </div>
                </section>

                <div className="ad-card ad-card-full" style={{ marginBottom: '2rem' }}>
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">Buy Credits</h3>
                    <span className="ad-count-pill">1 Credit = ₹500 INR</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', padding: '1rem' }}>
                    {/* Package 1 */}
                    <div style={{ border: '1px solid var(--ad-border)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', background: 'var(--ad-surface)' }}>
                      <CoinsIcon className="w-10 h-10 mx-auto mb-3" style={{ color: '#3b82f6' }} />
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--ad-text)', marginBottom: '0.5rem' }}>Starter Pack</h4>
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.5rem' }}>1 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--ad-muted)' }}>Credit</span></p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--ad-muted)', marginBottom: '1.5rem' }}>₹500 INR</p>
                      <PaymentButton amount={500} orderType="credits" userId={auth.currentUser?.uid || ""} className="ad-task-action" style={{ width: '100%', justifyContent: 'center' }} />
                    </div>
                    {/* Package 2 */}
                    <div style={{ border: '2px solid #10b981', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', background: 'var(--ad-surface)', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#10b981', color: 'white', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>POPULAR</div>
                      <CoinsIcon className="w-10 h-10 mx-auto mb-3" style={{ color: '#10b981' }} />
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--ad-text)', marginBottom: '0.5rem' }}>Professional</h4>
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: '#10b981', marginBottom: '0.5rem' }}>5 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--ad-muted)' }}>Credits</span></p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--ad-muted)', marginBottom: '1.5rem' }}>₹2500 INR</p>
                      <PaymentButton amount={2500} orderType="credits" userId={auth.currentUser?.uid || ""} className="ad-task-action" style={{ width: '100%', justifyContent: 'center' }} />
                    </div>
                    {/* Package 3 */}
                    <div style={{ border: '1px solid var(--ad-border)', borderRadius: '8px', padding: '1.5rem', textAlign: 'center', background: 'var(--ad-surface)' }}>
                      <CoinsIcon className="w-10 h-10 mx-auto mb-3" style={{ color: '#8b5cf6' }} />
                      <h4 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--ad-text)', marginBottom: '0.5rem' }}>Enterprise</h4>
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: '#8b5cf6', marginBottom: '0.5rem' }}>10 <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--ad-muted)' }}>Credits</span></p>
                      <p style={{ fontSize: '0.9rem', color: 'var(--ad-muted)', marginBottom: '1.5rem' }}>₹5000 INR</p>
                      <PaymentButton amount={5000} orderType="credits" userId={auth.currentUser?.uid || ""} className="ad-task-action" style={{ width: '100%', justifyContent: 'center' }} />
                    </div>
                  </div>
                </div>


                <div className="ad-card ad-card-full">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">Credits History</h3>
                    <span className="ad-count-pill">{creditsHistory.length} transactions</span>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th className="ad-th-narrow">Type</th>
                          <th>Description</th>
                          <th>Amount</th>
                          <th>Date & Time</th>
                          <th>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {creditsHistory.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="ad-td-empty">
                              No credit transactions yet. Start by purchasing credits.
                            </td>
                          </tr>
                        ) : (
                          creditsHistory.map((transaction, idx) => (
                            <tr key={idx}>
                              <td className="ad-td-index">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                  {transaction.type === "purchase" ? (
                                    <TrendingUpIcon className="w-4 h-4" style={{ color: '#10b981' }} />
                                  ) : (
                                    <TrendingDownIcon className="w-4 h-4" style={{ color: '#ef4444' }} />
                                  )}
                                  <span style={{ fontSize: '0.8rem', fontWeight: 500, textTransform: 'capitalize' }}>
                                    {transaction.type}
                                  </span>
                                </div>
                              </td>
                              <td style={{ color: 'var(--ad-text)' }}>
                                {transaction.description || transaction.action || "—"}
                              </td>
                              <td style={{ color: transaction.type === "purchase" ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                                {transaction.type === "purchase" 
                                  ? `+${transaction.creditsAdded || transaction.amount || 0}` 
                                  : `-${transaction.creditsUsed || 0}`
                                }
                              </td>
                              <td style={{ color: 'var(--ad-muted)', fontSize: '0.85rem' }}>
                                {transaction.timestamp 
                                  ? new Date(transaction.timestamp.seconds ? transaction.timestamp.seconds * 1000 : transaction.timestamp).toLocaleString()
                                  : "—"
                                }
                              </td>
                              <td style={{ color: 'var(--ad-muted)', fontSize: '0.85rem' }}>
                                {transaction.type === "purchase" ? (
                                  <span>Order ID: {transaction.orderId?.slice(-8) || "—"}</span>
                                ) : (
                                  <span>{transaction.metadata?.jobId ? `Job: ${transaction.metadata.jobId.slice(-8)}` : "—"}</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}