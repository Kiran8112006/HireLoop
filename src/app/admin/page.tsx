"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import {
  Building2Icon,
  UsersIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  ClockIcon,
  UploadCloudIcon,
  CheckCircle2Icon,
  XCircleIcon,
  FileSpreadsheetIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  ChevronRightIcon,
  SearchIcon,
  BellIcon,
  AlertCircleIcon,
  TrendingUpIcon,
  FileTextIcon,
  HelpCircleIcon,
  UserCheckIcon,
  UserXIcon,
  GraduationCapIcon,
  BookOpenIcon,
  MapPinIcon,
  CalendarIcon,
  DollarSignIcon,
  ExternalLinkIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface Recruiter {
  id: string;
  email?: string;
  company?: string;
  isApproved?: boolean;
  createdAt?: any;
  [key: string]: any;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function AdminPage() {
  const router = useRouter();
  const [recruiters, setRecruiters] = useState<Recruiter[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [activeView, setActiveView] = useState<
    "overview" | "recruiters" | "upload" | "students" | "jobs" | "documents" | "resources"
  >("overview");

  /* ---- Fetch data ----------------------------------------------- */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [recSnap, stuSnap, jobSnap, appSnap] = await Promise.all([
          getDocs(collection(db, "recruiters")),
          getDocs(collection(db, "students")),
          getDocs(collection(db, "jobs")),
          getDocs(collection(db, "applications")),
        ]);
        setRecruiters(recSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setStudents(stuSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setJobs(jobSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setApplications(appSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to fetch admin data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* ---- Actions -------------------------------------------------- */
  const handleApprove = async (id: string) => {
    await updateDoc(doc(db, "recruiters", id), { isApproved: true });
    setRecruiters((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isApproved: true } : r))
    );
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/auth");
  };

  const handleFileUpload = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/upload-students`,
        { method: "POST", body: formData }
      );
      await res.json();
      setUploadStatus("success");
      const stuSnap = await getDocs(collection(db, "students"));
      setStudents(stuSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setTimeout(() => setUploadStatus("idle"), 4000);
    } catch {
      setUploadStatus("error");
      setTimeout(() => setUploadStatus("idle"), 4000);
    }
  };

  /* ---- Derived -------------------------------------------------- */
  const pendingRecruiters = recruiters.filter((r) => !r.isApproved);
  const approvedRecruiters = recruiters.filter((r) => r.isApproved);
  const filteredRecruiters = recruiters.filter(
    (r) =>
      (r.email ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.company ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ---- Placement analytics -------------------------------------- */
  // Unique students who have at least one application
  const studentsWhoApplied = new Set(applications.map((a) => a.studentId));
  // Students who got placed (application with status "accepted" or "placed" or "offered")
  const placedStudentIds = new Set(
    applications
      .filter((a) =>
        ["accepted", "placed", "offered", "hired"].includes(
          (a.status ?? "").toLowerCase()
        )
      )
      .map((a) => a.studentId)
  );
  const placedCount = placedStudentIds.size;
  const unplacedCount = students.length - placedCount;
  const placementRate =
    students.length > 0 ? Math.round((placedCount / students.length) * 100) : 0;
  const totalApplications = applications.length;
  const appsPerJob =
    jobs.length > 0 ? Math.round(totalApplications / jobs.length) : 0;
  const jobsWithApps = new Set(applications.map((a) => a.jobId)).size;
  const jobFillRate =
    jobs.length > 0 ? Math.round((jobsWithApps / jobs.length) * 100) : 0;

  /* ---- Nav config ----------------------------------------------- */
  const primaryNav = [
    { key: "overview" as const, label: "Overview", icon: LayoutDashboardIcon },
    { key: "recruiters" as const, label: "Recruiters", icon: ShieldCheckIcon },
    { key: "upload" as const, label: "Upload", icon: UploadCloudIcon },
  ];

  const secondaryNav = [
    { key: "students" as const, label: "Students", icon: UsersIcon },
    { key: "jobs" as const, label: "Jobs", icon: BriefcaseIcon },
  ];

  const tertiaryNav = [
    { key: "documents" as const, label: "Documents", icon: FileTextIcon },
    { key: "resources" as const, label: "Resources", icon: HelpCircleIcon },
  ];

  /* ---- Filtered students for search ----------------------------- */
  const filteredStudents = students.filter(
    (s) =>
      (s.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.email ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.major ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobs = jobs.filter(
    (j) =>
      (j.title ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.company ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ================================================================ */
  /*  RENDER                                                          */
  /* ================================================================ */
  return (
    <div className="ad-shell">
      {/* =========================================================== */}
      {/*  SIDEBAR                                                     */}
      {/* =========================================================== */}
      <aside className="ad-sidebar">
        {/* Brand */}
        <div className="ad-sb-brand">
          <div className="ad-sb-logo">
            <Building2Icon className="ad-sb-logo-icon" />
          </div>
          <span className="ad-sb-brand-name">HireLoop</span>
        </div>

        {/* Profile pill */}
        <div className="ad-sb-profile">
          <div className="ad-sb-avatar">A</div>
          <div className="ad-sb-profile-info">
            <span className="ad-sb-profile-name">Admin</span>
            <span className="ad-sb-profile-email">admin@hireloop.in</span>
          </div>
          <ChevronRightIcon className="ad-sb-profile-chev" />
        </div>

        {/* Primary nav */}
        <nav className="ad-sb-nav">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`ad-sb-link${activeView === item.key ? " ad-sb-link-active" : ""}`}
                onClick={() => setActiveView(item.key)}
              >
                <Icon className="ad-sb-link-icon" />
                <span>{item.label}</span>
                {item.key === "recruiters" && pendingRecruiters.length > 0 && (
                  <span className="ad-sb-badge">
                    {pendingRecruiters.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="ad-sb-divider" />

        {/* Secondary nav */}
        <nav className="ad-sb-nav">
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`ad-sb-link${activeView === item.key ? " ad-sb-link-active" : ""}`}
                onClick={() => setActiveView(item.key)}
              >
                <Icon className="ad-sb-link-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="ad-sb-divider" />

        {/* Tertiary nav */}
        <nav className="ad-sb-nav">
          {tertiaryNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                className={`ad-sb-link${activeView === item.key ? " ad-sb-link-active" : ""}`}
                onClick={() => setActiveView(item.key)}
              >
                <Icon className="ad-sb-link-icon" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Spacer */}
        <div className="ad-sb-spacer" />

        {/* Logout */}
        <button className="ad-sb-link ad-sb-logout" onClick={handleLogout}>
          <LogOutIcon className="ad-sb-link-icon" />
          <span>Logout</span>
        </button>
      </aside>

      {/* =========================================================== */}
      {/*  MAIN CONTENT                                                */}
      {/* =========================================================== */}
      <main className="ad-main">
        {/* Top bar — title + search */}
        <header className="ad-topbar">
          <h1 className="ad-topbar-title">
            {activeView === "overview" && "Overview"}
            {activeView === "recruiters" && "Recruiters"}
            {activeView === "upload" && "Upload"}
            {activeView === "students" && "Students"}
            {activeView === "jobs" && "Jobs"}
            {activeView === "documents" && "Documents"}
            {activeView === "resources" && "Resources"}
          </h1>

          <div className="ad-topbar-right">
            <div className="ad-search">
              <SearchIcon className="ad-search-icon" />
              <input
                className="ad-search-input"
                placeholder="Search students, recruiters, etc"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="ad-topbar-bell" title="Notifications">
              <BellIcon className="ad-topbar-bell-icon" />
            </button>
          </div>
        </header>

        {/* Content area */}
        {loading ? (
          <div className="ad-loading">
            <div className="ad-spinner" />
            <p>Loading dashboard…</p>
          </div>
        ) : (
          <div className="ad-content">
            {/* ================== OVERVIEW ================== */}
            {activeView === "overview" && (
              <div className="ad-fade">
                {/* ---- Row 1: Three cards like Goal / Careers / Jobs ---- */}
                <section className="ad-grid-3">
                  {/* Placement summary card */}
                  <div className="ad-card">
                    <h3 className="ad-card-label">Placement Summary</h3>
                    <p className="ad-card-headline">
                      <strong>{placedCount}</strong> of <strong>{students.length}</strong> students placed · <strong>{placementRate}%</strong> placement rate
                    </p>
                    <div className="ad-chip-row">
                      <span className="ad-chip ad-chip-ok">✓ {placedCount} Placed</span>
                      <span className="ad-chip ad-chip-warn">{unplacedCount} Unplaced</span>
                      <span className="ad-chip">{totalApplications} Applications</span>
                      <span className="ad-chip">{jobs.length} Jobs</span>
                    </div>
                  </div>

                  {/* Careers-style card: Category chips */}
                  <div className="ad-card">
                    <h3 className="ad-card-label">Quick Actions</h3>
                    <div className="ad-action-grid">
                      <button
                        className="ad-action-tile"
                        onClick={() => setActiveView("recruiters")}
                      >
                        <ShieldCheckIcon className="ad-action-tile-icon" />
                        Approve Recruiters
                      </button>
                      <button
                        className="ad-action-tile"
                        onClick={() => setActiveView("upload")}
                      >
                        <UploadCloudIcon className="ad-action-tile-icon" />
                        Upload CSV
                      </button>
                      <button className="ad-action-tile">
                        <BriefcaseIcon className="ad-action-tile-icon" />
                        View Jobs
                      </button>
                      <button className="ad-action-tile">
                        <UsersIcon className="ad-action-tile-icon" />
                        View Students
                      </button>
                    </div>
                  </div>

                  {/* Student Placement ring chart */}
                  <div className="ad-card ad-stats-ring-card">
                    <div className="ad-stats-ring-head">
                      <h3 className="ad-card-label">Student Placement</h3>
                      <span className="ad-card-accent">All Time</span>
                    </div>

                    {/* Ring — placed vs unplaced */}
                    <div className="ad-ring-wrap">
                      <svg viewBox="0 0 120 120" className="ad-ring-svg">
                        <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(148,163,184,0.10)" strokeWidth="10" />
                        {/* Placed arc (emerald) */}
                        <circle
                          cx="60" cy="60" r="50" fill="none"
                          stroke="#10b981" strokeWidth="10"
                          strokeDasharray={`${Math.min(314, (placedCount / Math.max(students.length, 1)) * 314)} 314`}
                          strokeLinecap="round" transform="rotate(-90 60 60)"
                        />
                        {/* Unplaced arc (red/amber) */}
                        <circle
                          cx="60" cy="60" r="50" fill="none"
                          stroke="#f87171" strokeWidth="10"
                          strokeDasharray={`${Math.min(314, (unplacedCount / Math.max(students.length, 1)) * 314)} 314`}
                          strokeLinecap="round"
                          transform={`rotate(${-90 + (placedCount / Math.max(students.length, 1)) * 360} 60 60)`}
                        />
                      </svg>
                      <div className="ad-ring-center">
                        <span className="ad-ring-number">{students.length}</span>
                        <span className="ad-ring-sublabel">Total Students</span>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="ad-ring-legend">
                      <div className="ad-ring-legend-item">
                        <span className="ad-legend-dot ad-legend-emerald" />
                        <span className="ad-legend-pct">{placementRate}%</span>
                        <span className="ad-legend-label">Placed</span>
                      </div>
                      <div className="ad-ring-legend-item">
                        <span className="ad-legend-dot" style={{ background: '#f87171' }} />
                        <span className="ad-legend-pct">{students.length > 0 ? 100 - placementRate : 0}%</span>
                        <span className="ad-legend-label">Unplaced</span>
                      </div>
                      <div className="ad-ring-legend-item">
                        <span className="ad-legend-dot ad-legend-cyan" />
                        <span className="ad-legend-pct">{studentsWhoApplied.size}</span>
                        <span className="ad-legend-label">Applied</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ---- Row 2: Roadmaps-like + Execution-like ---- */}
                <section className="ad-grid-2-wide">
                  {/* Pending Approvals — Roadmap style */}
                  <div className="ad-card ad-card-wide">
                    <div className="ad-card-head">
                      <h3 className="ad-card-label">Pending Approvals</h3>
                      {pendingRecruiters.length > 0 && (
                        <button
                          className="ad-view-all"
                          onClick={() => setActiveView("recruiters")}
                        >
                          View All Recruiters →
                        </button>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="ad-progress-section">
                      <span className="ad-progress-label">
                        Approval progress
                      </span>
                      <span className="ad-progress-aside">
                        {recruiters.length > 0
                          ? `${Math.round(
                              (approvedRecruiters.length /
                                recruiters.length) *
                                100
                            )}% complete`
                          : "No recruiters yet"}
                      </span>
                    </div>
                    <div className="ad-progress-bar">
                      <div
                        className="ad-progress-fill"
                        style={{
                          width: `${
                            recruiters.length > 0
                              ? (approvedRecruiters.length /
                                  recruiters.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    {/* Task-style recruiter list */}
                    <p className="ad-tasks-label">REQUESTS</p>
                    {pendingRecruiters.length === 0 ? (
                      <div className="ad-empty-inline">
                        <CheckCircle2Icon className="ad-empty-inline-icon" />
                        All requests processed
                      </div>
                    ) : (
                      <div className="ad-task-list">
                        {pendingRecruiters.slice(0, 4).map((rec) => (
                          <div className="ad-task-row" key={rec.id}>
                            <div className="ad-task-check ad-task-pending" />
                            <div className="ad-task-info">
                              <span className="ad-task-primary">
                                {rec.email ?? "—"}
                              </span>
                              {rec.company && (
                                <span className="ad-task-secondary">
                                  {rec.company}
                                </span>
                              )}
                            </div>
                            <button
                              className="ad-task-action"
                              onClick={() => handleApprove(rec.id)}
                            >
                              Approve
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Placement metrics card */}
                  <div className="ad-card">
                    <div className="ad-card-head">
                      <h3 className="ad-card-label">Placement Metrics</h3>
                      <span className="ad-card-accent">All Time</span>
                    </div>
                    <div className="ad-exec-big">
                      <span className="ad-exec-pct">{placementRate}%</span>
                      <span className="ad-exec-trend">
                        <TrendingUpIcon className="ad-exec-trend-icon" />
                        Placement Rate
                      </span>
                    </div>
                    <div className="ad-exec-grid">
                      <div className="ad-exec-cell">
                        <UserCheckIcon style={{ width: '1rem', height: '1rem', color: 'var(--ad-emerald)', marginBottom: '0.2rem' }} />
                        <span className="ad-exec-cell-label">PLACED</span>
                        <span className="ad-exec-cell-value">{placedCount}</span>
                      </div>
                      <div className="ad-exec-cell">
                        <UserXIcon style={{ width: '1rem', height: '1rem', color: 'var(--ad-red)', marginBottom: '0.2rem' }} />
                        <span className="ad-exec-cell-label">UNPLACED</span>
                        <span className="ad-exec-cell-value">{unplacedCount}</span>
                      </div>
                    </div>
                    <div className="ad-exec-grid" style={{ marginTop: '0.5rem' }}>
                      <div className="ad-exec-cell">
                        <span className="ad-exec-cell-label">APPLICATIONS</span>
                        <span className="ad-exec-cell-value">{totalApplications}</span>
                      </div>
                      <div className="ad-exec-cell">
                        <span className="ad-exec-cell-label">APPS/JOB</span>
                        <span className="ad-exec-cell-value">{appsPerJob}</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* ---- Row 3: Table — Recent Job Lists ---- */}
                <section className="ad-card ad-card-full">
                  <h3 className="ad-card-label" style={{ marginBottom: "1rem" }}>
                    Recent Job Lists
                  </h3>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th className="ad-th-narrow">#</th>
                          <th>Title</th>
                          <th>Salary</th>
                          <th>Status</th>
                          <th>Posted By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="ad-td-empty">
                              No jobs posted yet
                            </td>
                          </tr>
                        ) : (
                          jobs.slice(0, 8).map((job, idx) => (
                            <tr key={job.id}>
                              <td className="ad-td-index">{idx + 1}</td>
                              <td className="ad-td-bold">
                                {job.title ?? "Untitled"}
                              </td>
                              <td>{job.salaryRange ?? job.salary ?? "—"}</td>
                              <td>
                                <span className="ad-status-dot ad-status-active" />
                                Active
                              </td>
                              <td>{job.postedBy ?? "—"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {/* ================== RECRUITERS ================== */}
            {activeView === "recruiters" && (
              <div className="ad-fade">
                <div className="ad-card ad-card-full">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">All Recruiters</h3>
                    <span className="ad-count-pill">
                      {filteredRecruiters.length} total
                    </span>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th className="ad-th-narrow">#</th>
                          <th>Email</th>
                          <th>Company</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRecruiters.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="ad-td-empty">
                              No recruiters match your filter
                            </td>
                          </tr>
                        ) : (
                          filteredRecruiters.map((rec, idx) => (
                            <tr key={rec.id}>
                              <td className="ad-td-index">{idx + 1}</td>
                              <td>
                                <div className="ad-td-user">
                                  <div className="ad-td-avatar">
                                    {(rec.email ?? "R")[0].toUpperCase()}
                                  </div>
                                  {rec.email ?? "—"}
                                </div>
                              </td>
                              <td>{rec.company ?? "—"}</td>
                              <td>
                                {rec.isApproved ? (
                                  <span className="ad-badge ad-badge-ok">
                                    <span className="ad-status-dot ad-status-active" />
                                    Approved
                                  </span>
                                ) : (
                                  <span className="ad-badge ad-badge-warn">
                                    <span className="ad-status-dot ad-status-pending" />
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td>
                                {!rec.isApproved ? (
                                  <button
                                    className="ad-task-action"
                                    onClick={() => handleApprove(rec.id)}
                                  >
                                    Approve
                                  </button>
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

            {/* ================== UPLOAD ================== */}
            {activeView === "upload" && (
              <div className="ad-fade">
                <div className="ad-upload-zone">
                  <FileSpreadsheetIcon className="ad-upload-hero-icon" />
                  <h3 className="ad-upload-title">Import Students</h3>
                  <p className="ad-upload-desc">
                    Upload a <code>.csv</code> file with columns:{" "}
                    <strong>name, email, major, cgpa, skills</strong>
                  </p>
                  <label className="ad-upload-cta">
                    <UploadCloudIcon className="ad-upload-cta-icon" />
                    {uploadStatus === "uploading"
                      ? "Uploading…"
                      : "Choose CSV"}
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      hidden
                      disabled={uploadStatus === "uploading"}
                    />
                  </label>

                  {uploadStatus === "success" && (
                    <div className="ad-upload-msg ad-upload-msg-ok">
                      <CheckCircle2Icon className="ad-upload-msg-icon" />
                      Students imported successfully
                    </div>
                  )}
                  {uploadStatus === "error" && (
                    <div className="ad-upload-msg ad-upload-msg-err">
                      <XCircleIcon className="ad-upload-msg-icon" />
                      Upload failed — please try again
                    </div>
                  )}
                </div>

                {/* Student roster table */}
                <div className="ad-card ad-card-full" style={{ marginTop: "1.25rem" }}>
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">Student Roster</h3>
                    <span className="ad-count-pill">{students.length}</span>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th className="ad-th-narrow">#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Major</th>
                          <th className="ad-th-narrow">CGPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="ad-td-empty">
                              No students registered
                            </td>
                          </tr>
                        ) : (
                          students.slice(0, 25).map((s, idx) => (
                            <tr key={s.id}>
                              <td className="ad-td-index">{idx + 1}</td>
                              <td>{s.name ?? "—"}</td>
                              <td>{s.email ?? "—"}</td>
                              <td>{s.major ?? "—"}</td>
                              <td>{s.cgpa ?? "—"}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================== STUDENTS ================== */}
            {activeView === "students" && (
              <div className="ad-fade">
                {/* Summary strip */}
                <section className="ad-grid-3" style={{ marginBottom: '1.25rem' }}>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: 'none', padding: 0 }}>
                      <GraduationCapIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--ad-cyan)', marginBottom: '0.3rem' }} />
                      <span className="ad-exec-cell-label">TOTAL STUDENTS</span>
                      <span className="ad-exec-cell-value">{students.length}</span>
                    </div>
                  </div>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: 'none', padding: 0 }}>
                      <UserCheckIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--ad-emerald)', marginBottom: '0.3rem' }} />
                      <span className="ad-exec-cell-label">PLACED</span>
                      <span className="ad-exec-cell-value">{placedCount}</span>
                    </div>
                  </div>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: 'none', padding: 0 }}>
                      <UserXIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--ad-red)', marginBottom: '0.3rem' }} />
                      <span className="ad-exec-cell-label">UNPLACED</span>
                      <span className="ad-exec-cell-value">{unplacedCount}</span>
                    </div>
                  </div>
                </section>

                {/* Student table */}
                <div className="ad-card ad-card-full">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">All Students</h3>
                    <span className="ad-count-pill">{filteredStudents.length} result{filteredStudents.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th className="ad-th-narrow">#</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Major</th>
                          <th className="ad-th-narrow">CGPA</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.length === 0 ? (
                          <tr><td colSpan={6} className="ad-td-empty">No students match your search</td></tr>
                        ) : (
                          filteredStudents.map((s, idx) => (
                            <tr key={s.id}>
                              <td className="ad-td-index">{idx + 1}</td>
                              <td>
                                <div className="ad-td-user">
                                  <div className="ad-td-avatar">{(s.name ?? 'S')[0].toUpperCase()}</div>
                                  {s.name ?? '—'}
                                </div>
                              </td>
                              <td>{s.email ?? '—'}</td>
                              <td>{s.major ?? '—'}</td>
                              <td>{s.cgpa ?? '—'}</td>
                              <td>
                                {placedStudentIds.has(s.id) ? (
                                  <span className="ad-badge ad-badge-ok">
                                    <span className="ad-status-dot ad-status-active" />
                                    Placed
                                  </span>
                                ) : studentsWhoApplied.has(s.id) ? (
                                  <span className="ad-badge ad-badge-warn">
                                    <span className="ad-status-dot ad-status-pending" />
                                    Applied
                                  </span>
                                ) : (
                                  <span className="ad-badge" style={{ color: 'var(--ad-muted)' }}>
                                    — Not applied
                                  </span>
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

            {/* ================== JOBS ================== */}
            {activeView === "jobs" && (
              <div className="ad-fade">
                {/* Summary strip */}
                <section className="ad-grid-3" style={{ marginBottom: '1.25rem' }}>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: 'none', padding: 0 }}>
                      <BriefcaseIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--ad-cyan)', marginBottom: '0.3rem' }} />
                      <span className="ad-exec-cell-label">TOTAL JOBS</span>
                      <span className="ad-exec-cell-value">{jobs.length}</span>
                    </div>
                  </div>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: 'none', padding: 0 }}>
                      <UsersIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--ad-emerald)', marginBottom: '0.3rem' }} />
                      <span className="ad-exec-cell-label">TOTAL APPLICATIONS</span>
                      <span className="ad-exec-cell-value">{totalApplications}</span>
                    </div>
                  </div>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: 'none', padding: 0 }}>
                      <TrendingUpIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--ad-amber)', marginBottom: '0.3rem' }} />
                      <span className="ad-exec-cell-label">AVG APPS/JOB</span>
                      <span className="ad-exec-cell-value">{appsPerJob}</span>
                    </div>
                  </div>
                </section>

                {/* Jobs table */}
                <div className="ad-card ad-card-full">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">All Job Listings</h3>
                    <span className="ad-count-pill">{filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th className="ad-th-narrow">#</th>
                          <th>Title</th>
                          <th>Company</th>
                          <th>Salary</th>
                          <th>Location</th>
                          <th>Applications</th>
                          <th>Posted By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJobs.length === 0 ? (
                          <tr><td colSpan={7} className="ad-td-empty">No jobs match your search</td></tr>
                        ) : (
                          filteredJobs.map((job, idx) => {
                            const jobApps = applications.filter((a) => a.jobId === job.id);
                            return (
                              <tr key={job.id}>
                                <td className="ad-td-index">{idx + 1}</td>
                                <td className="ad-td-bold">{job.title ?? 'Untitled'}</td>
                                <td>{job.company ?? '—'}</td>
                                <td>{job.salaryRange ?? job.salary ?? '—'}</td>
                                <td>{job.location ?? '—'}</td>
                                <td>
                                  <span className="ad-count-pill">{jobApps.length}</span>
                                </td>
                                <td>{job.postedBy ?? '—'}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ================== DOCUMENTS ================== */}
            {activeView === "documents" && (
              <div className="ad-fade">
                <div className="ad-card ad-card-full">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">Platform Documents</h3>
                  </div>
                  <div className="ad-docs-grid">
                    {[
                      { title: 'Placement Policy', desc: 'Rules, eligibility criteria, and placement process guidelines', icon: FileTextIcon, accent: 'var(--ad-cyan)' },
                      { title: 'Student Handbook', desc: 'Information for students about registering, applying, and tracking jobs', icon: BookOpenIcon, accent: 'var(--ad-emerald)' },
                      { title: 'Recruiter Guide', desc: 'Onboarding guide for recruiters to post jobs and manage applications', icon: ShieldCheckIcon, accent: 'var(--ad-violet)' },
                      { title: 'CSV Upload Template', desc: 'Template file format for bulk uploading student data', icon: FileSpreadsheetIcon, accent: 'var(--ad-amber)' },
                    ].map((d) => {
                      const Icon = d.icon;
                      return (
                        <div className="ad-doc-card" key={d.title}>
                          <div className="ad-doc-icon-wrap" style={{ color: d.accent }}>
                            <Icon style={{ width: '1.3rem', height: '1.3rem' }} />
                          </div>
                          <div className="ad-doc-info">
                            <span className="ad-doc-title">{d.title}</span>
                            <span className="ad-doc-desc">{d.desc}</span>
                          </div>
                          <ExternalLinkIcon className="ad-doc-link-icon" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ================== RESOURCES ================== */}
            {activeView === "resources" && (
              <div className="ad-fade">
                {/* Stats summary */}
                <section className="ad-grid-3" style={{ marginBottom: '1.25rem' }}>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: 'none', padding: 0 }}>
                      <UsersIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--ad-cyan)', marginBottom: '0.3rem' }} />
                      <span className="ad-exec-cell-label">RECRUITERS</span>
                      <span className="ad-exec-cell-value">{recruiters.length}</span>
                    </div>
                  </div>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: 'none', padding: 0 }}>
                      <ShieldCheckIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--ad-emerald)', marginBottom: '0.3rem' }} />
                      <span className="ad-exec-cell-label">APPROVED</span>
                      <span className="ad-exec-cell-value">{approvedRecruiters.length}</span>
                    </div>
                  </div>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: 'none', padding: 0 }}>
                      <ClockIcon style={{ width: '1.2rem', height: '1.2rem', color: 'var(--ad-amber)', marginBottom: '0.3rem' }} />
                      <span className="ad-exec-cell-label">PENDING APPROVAL</span>
                      <span className="ad-exec-cell-value">{pendingRecruiters.length}</span>
                    </div>
                  </div>
                </section>

                {/* Helpful links */}
                <div className="ad-card ad-card-full">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">Helpful Resources</h3>
                  </div>
                  <div className="ad-docs-grid">
                    {[
                      { title: 'Firebase Console', desc: 'Access Firestore database, authentication, and storage', icon: ExternalLinkIcon, accent: 'var(--ad-amber)' },
                      { title: 'Admin API Docs', desc: 'Backend API reference for student uploads and job management', icon: BookOpenIcon, accent: 'var(--ad-cyan)' },
                      { title: 'Placement Reports', desc: 'Generate and download CSV reports of placement data', icon: FileSpreadsheetIcon, accent: 'var(--ad-emerald)' },
                      { title: 'Support & FAQ', desc: 'Common issues, troubleshooting, and contact information', icon: HelpCircleIcon, accent: 'var(--ad-violet)' },
                    ].map((d) => {
                      const Icon = d.icon;
                      return (
                        <div className="ad-doc-card" key={d.title}>
                          <div className="ad-doc-icon-wrap" style={{ color: d.accent }}>
                            <Icon style={{ width: '1.3rem', height: '1.3rem' }} />
                          </div>
                          <div className="ad-doc-info">
                            <span className="ad-doc-title">{d.title}</span>
                            <span className="ad-doc-desc">{d.desc}</span>
                          </div>
                          <ExternalLinkIcon className="ad-doc-link-icon" />
                        </div>
                      );
                    })}
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
