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
  XIcon,
  CalendarIcon,
  SearchIcon,
  BellIcon,
  TrendingUpIcon,
  UserCheckIcon,
  UserXIcon,
  BarChart3Icon,
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
    "overview" | "recruiters" | "upload" | "students" | "jobs" | "documents"
  >("overview");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);

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
      const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://hireloop-vy61.onrender.com").replace(/\/$/, "");
      const res = await fetch(
        `${backendUrl}/upload-students`,
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

  const toExportString = (value: any) => {
    if (value === null || value === undefined) {
      return "";
    }
    if (Array.isArray(value)) {
      return value.map((item) => toExportString(item)).join("; ");
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch {
        return "";
      }
    }
    return String(value);
  };

  const sanitizeCsvCell = (value: any) => {
    const str = toExportString(value);
    return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const downloadCsv = (filename: string, rows: any[]) => {
    const headers = ["name", "email", "major", "branch", "placed"];
    const csvRows = [
      headers.join(","),
      ...rows.map((row) =>
        [
          sanitizeCsvCell(row.name),
          sanitizeCsvCell(row.email),
          sanitizeCsvCell(row.major),
          sanitizeCsvCell(row.branch),
          sanitizeCsvCell(row.placed ? "Yes" : "No"),
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\r\n");
    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  /* ---- Derived -------------------------------------------------- */
  const pendingRecruiters = recruiters.filter((r) => !r.isApproved);
  const approvedRecruiters = recruiters.filter((r) => r.isApproved);
  const filteredRecruiters = recruiters.filter(
    (r) =>
      (r.email ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.company ?? r.companyName ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.recruiterName ?? r.name ?? "").toLowerCase().includes(searchQuery.toLowerCase())
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

  const normalizedStudents = students.map((student) => ({
    ...student,
    placed: placedStudentIds.has(student.id),
  }));

  const downloadAllStudentsCsv = () => {
    downloadCsv("all-students.csv", normalizedStudents);
  };

  const downloadStudentsByMajorOrBranchCsv = () => {
    const sortedRows = [...normalizedStudents].sort((a, b) => {
      const aKey = String(a.major ?? a.branch ?? "unknown").toLowerCase();
      const bKey = String(b.major ?? b.branch ?? "unknown").toLowerCase();
      return aKey.localeCompare(bKey);
    });

    downloadCsv("students-by-major-branch.csv", sortedRows);
  };

  const downloadPlacedStudentsCsv = () => {
    downloadCsv(
      "placed-students.csv",
      normalizedStudents.filter((student) => student.placed)
    );
  };

  const downloadNotPlacedStudentsCsv = () => {
    downloadCsv(
      "not-placed-students.csv",
      normalizedStudents.filter((student) => !student.placed)
    );
  };

  /* ---- Nav config ----------------------------------------------- */
  type ViewKey = typeof activeView;
  const navItems: { key: ViewKey; label: string; icon: any; group: 1 | 2 | 3; badge?: number }[] = [
    { key: "overview", label: "Overview", icon: LayoutDashboardIcon, group: 1 },
    { key: "recruiters", label: "Recruiters", icon: ShieldCheckIcon, group: 1, badge: pendingRecruiters.length || undefined },
    { key: "upload", label: "Upload", icon: UploadCloudIcon, group: 1 },
    { key: "students", label: "Students", icon: UsersIcon, group: 2 },
    { key: "jobs", label: "Jobs", icon: BriefcaseIcon, group: 2 },
    { key: "documents", label: "Data Exports", icon: BarChart3Icon, group: 3 },
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

        {/* Nav groups */}
        {([1, 2, 3] as const).map((group, gi) => {
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
                      className={`ad-sb-link${activeView === item.key ? " ad-sb-link-active" : ""}`}
                      onClick={() => setActiveView(item.key)}
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
            {activeView === "documents" && "Data Exports"}
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
                                    {(rec.recruiterName ?? rec.name ?? rec.email ?? "R")[0].toUpperCase()}
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
                                    <span style={{ fontWeight: 500, color: 'var(--ad-text)' }}>
                                      {rec.recruiterName ?? rec.name ?? "—"}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--ad-muted)' }}>
                                      {rec.email ?? "—"}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td>{rec.company ?? rec.companyName ?? "—"}</td>
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
                          students.slice(0, 25).map((s, idx) => {
                            const name = s.name ?? s.fullName ?? (s.firstName ? `${s.firstName} ${s.lastName ?? ""}`.trim() : null) ?? "—";
                            return (
                              <tr key={s.id}>
                                <td className="ad-td-index">{idx + 1}</td>
                                <td>{name}</td>
                                <td>{s.email ?? s.contactEmail ?? "—"}</td>
                                <td>{s.major ?? s.branch ?? s.department ?? "—"}</td>
                                <td>{s.cgpa ?? s.gpa ?? "—"}</td>
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

            {/* ================== STUDENTS ================== */}
            {activeView === "students" && (
              <div className="ad-fade">
                {/* Stats strip */}
                <div className="ad-grid-3" style={{ marginBottom: '1rem' }}>
                  <div className="ad-card">
                    <h3 className="ad-card-label">Total Students</h3>
                    <span className="ad-exec-pct" style={{ fontSize: '2rem', display: 'block', marginTop: '0.3rem' }}>{students.length}</span>
                  </div>
                  <div className="ad-card">
                    <h3 className="ad-card-label">Placed</h3>
                    <span className="ad-exec-pct" style={{ fontSize: '2rem', display: 'block', marginTop: '0.3rem', color: 'var(--ad-emerald)' }}>{placedCount}</span>
                  </div>
                  <div className="ad-card">
                    <h3 className="ad-card-label">Unplaced</h3>
                    <span className="ad-exec-pct" style={{ fontSize: '2rem', display: 'block', marginTop: '0.3rem', color: 'var(--ad-red)' }}>{unplacedCount}</span>
                  </div>
                </div>

                <div className="ad-card ad-card-full">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">All Students</h3>
                    <span className="ad-count-pill">{students.length} total</span>
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
                          <th>Skills</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length === 0 ? (
                          <tr><td colSpan={7} className="ad-td-empty">No students registered</td></tr>
                        ) : (
                          students.map((s, idx) => {
                            const name = s.name ?? s.fullName ?? (s.firstName ? `${s.firstName} ${s.lastName ?? ""}`.trim() : null) ?? "—";
                            return (
                              <tr key={s.id}>
                                <td className="ad-td-index">{idx + 1}</td>
                                <td>
                                  <div className="ad-td-user">
                                    <div className="ad-td-avatar">{(name !== "—" ? name : "S")[0].toUpperCase()}</div>
                                    {name}
                                  </div>
                                </td>
                                <td>{s.email ?? s.contactEmail ?? "—"}</td>
                                <td>{s.major ?? s.branch ?? s.department ?? "—"}</td>
                                <td>{s.cgpa ?? s.gpa ?? "—"}</td>
                                <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {Array.isArray(s.skills) ? s.skills.join(", ") : (s.skills ?? "—")}
                                </td>
                                <td>
                                {placedStudentIds.has(s.id) ? (
                                  <span className="ad-badge ad-badge-ok"><span className="ad-status-dot ad-status-active" />Placed</span>
                                ) : studentsWhoApplied.has(s.id) ? (
                                  <span className="ad-badge ad-badge-warn"><span className="ad-status-dot ad-status-pending" />Applied</span>
                                ) : (
                                  <span className="ad-badge" style={{ color: 'var(--ad-muted)' }}>Not Applied</span>
                                )}
                              </td>
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

            {/* ================== JOBS ================== */}
            {activeView === "jobs" && (
              <div className="ad-fade">
                {/* Stats strip */}
                <div className="ad-grid-3" style={{ marginBottom: '1rem' }}>
                  <div className="ad-card">
                    <h3 className="ad-card-label">Total Jobs</h3>
                    <span className="ad-exec-pct" style={{ fontSize: '2rem', display: 'block', marginTop: '0.3rem' }}>{jobs.length}</span>
                  </div>
                  <div className="ad-card">
                    <h3 className="ad-card-label">Total Applications</h3>
                    <span className="ad-exec-pct" style={{ fontSize: '2rem', display: 'block', marginTop: '0.3rem', color: 'var(--ad-cyan)' }}>{totalApplications}</span>
                  </div>
                  <div className="ad-card">
                    <h3 className="ad-card-label">Avg Applications/Job</h3>
                    <span className="ad-exec-pct" style={{ fontSize: '2rem', display: 'block', marginTop: '0.3rem', color: 'var(--ad-amber)' }}>{appsPerJob}</span>
                  </div>
                </div>

                {/* Job detail panel */}
                {selectedJob && (() => {
                  const jobApps = applications.filter((a) => a.jobId === selectedJob.id);
                  const applicantStudents = jobApps.map((a) => {
                    const stu = students.find((s) => s.id === a.studentId);
                    return { ...a, student: stu };
                  });
                  const fmtDate = (v: any) => {
                    if (!v) return "—";
                    if (v.toDate) return v.toDate().toLocaleDateString();
                    if (v.seconds) return new Date(v.seconds * 1000).toLocaleDateString();
                    const d = new Date(v);
                    return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
                  };
                  return (
                    <div className="ad-card ad-job-detail" style={{ marginBottom: '1rem' }}>
                      <div className="ad-card-head">
                        <h3 className="ad-card-label" style={{ fontSize: '1.1rem' }}>
                          {selectedJob.title ?? "Untitled"}
                        </h3>
                        <button className="ad-detail-close" onClick={() => setSelectedJob(null)}>
                          <XIcon style={{ width: '1rem', height: '1rem' }} />
                        </button>
                      </div>

                      {/* Job metadata grid */}
                      <div className="ad-detail-meta">
                        <div className="ad-detail-meta-item">
                          <Building2Icon className="ad-detail-meta-icon" />
                          <div>
                            <span className="ad-detail-meta-label">Company</span>
                            <span className="ad-detail-meta-value">{selectedJob.company ?? selectedJob.companyName ?? "—"}</span>
                          </div>
                        </div>
                        <div className="ad-detail-meta-item">
                          <CalendarIcon className="ad-detail-meta-icon" />
                          <div>
                            <span className="ad-detail-meta-label">Start Date</span>
                            <span className="ad-detail-meta-value">{fmtDate(selectedJob.startDate)}</span>
                          </div>
                        </div>
                        <div className="ad-detail-meta-item">
                          <CalendarIcon className="ad-detail-meta-icon" />
                          <div>
                            <span className="ad-detail-meta-label">End Date</span>
                            <span className="ad-detail-meta-value">{fmtDate(selectedJob.endDate ?? selectedJob.deadline)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      {selectedJob.description && (
                        <div className="ad-detail-section">
                          <h4 className="ad-detail-section-title">Description</h4>
                          <p className="ad-detail-section-text">{selectedJob.description}</p>
                        </div>
                      )}

                      {/* Requirements */}
                      {(selectedJob.requirements || selectedJob.skills) && (
                        <div className="ad-detail-section">
                          <h4 className="ad-detail-section-title">Requirements</h4>
                          <div className="ad-chip-row">
                            {(Array.isArray(selectedJob.requirements)
                              ? selectedJob.requirements
                              : Array.isArray(selectedJob.skills)
                              ? selectedJob.skills
                              : String(selectedJob.requirements ?? selectedJob.skills ?? "").split(",")
                            ).map((r: string, i: number) => (
                              <span className="ad-chip" key={i}>{String(r).trim()}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Applicants table */}
                      <div className="ad-detail-section">
                        <h4 className="ad-detail-section-title">
                          Applicants <span className="ad-count-pill" style={{ marginLeft: '0.5rem' }}>{jobApps.length}</span>
                        </h4>
                        {jobApps.length === 0 ? (
                          <p style={{ color: 'var(--ad-muted)', fontSize: '0.85rem' }}>No applications for this job yet.</p>
                        ) : (
                          <div className="ad-table-wrap">
                            <table className="ad-table">
                              <thead>
                                <tr>
                                  <th className="ad-th-narrow">#</th>
                                  <th>Student</th>
                                  <th>Email</th>
                                  <th>Major</th>
                                  <th>Status</th>
                                  <th>Applied</th>
                                </tr>
                              </thead>
                              <tbody>
                                {applicantStudents.map((a, i) => (
                                  <tr key={a.id}>
                                    <td className="ad-td-index">{i + 1}</td>
                                    <td>
                                      <div className="ad-td-user">
                                        <div className="ad-td-avatar">{(a.student?.name ?? "S")[0].toUpperCase()}</div>
                                        {a.student?.name ?? "Unknown"}
                                      </div>
                                    </td>
                                    <td>{a.student?.email ?? a.studentEmail ?? "—"}</td>
                                    <td>{a.student?.major ?? "—"}</td>
                                    <td>
                                      {["accepted", "placed", "offered", "hired"].includes((a.status ?? "").toLowerCase()) ? (
                                        <span className="ad-badge ad-badge-ok"><span className="ad-status-dot ad-status-active" />{a.status}</span>
                                      ) : ["rejected", "declined"].includes((a.status ?? "").toLowerCase()) ? (
                                        <span className="ad-badge" style={{ color: 'var(--ad-red)' }}><span className="ad-status-dot" style={{ background: 'var(--ad-red)' }} />{a.status}</span>
                                      ) : (
                                        <span className="ad-badge ad-badge-warn"><span className="ad-status-dot ad-status-pending" />{a.status ?? "Pending"}</span>
                                      )}
                                    </td>
                                    <td style={{ fontSize: '0.78rem', color: 'var(--ad-muted)' }}>
                                      {a.appliedAt?.toDate ? a.appliedAt.toDate().toLocaleDateString() : "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                <div className="ad-card ad-card-full">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">All Job Listings</h3>
                    <span className="ad-count-pill">{jobs.length} total</span>
                  </div>
                  <div className="ad-table-wrap">
                    <table className="ad-table">
                      <thead>
                        <tr>
                          <th className="ad-th-narrow">#</th>
                          <th>Title</th>
                          <th>Company</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Applications</th>
                          <th>Posted By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {jobs.length === 0 ? (
                          <tr><td colSpan={7} className="ad-td-empty">No jobs posted yet</td></tr>
                        ) : (
                          jobs.map((job, idx) => {
                            const jobApps = applications.filter((a) => a.jobId === job.id);
                            const isSelected = selectedJob?.id === job.id;
                            const fmtD = (v: any) => {
                              if (!v) return "—";
                              if (v.toDate) return v.toDate().toLocaleDateString();
                              if (v.seconds) return new Date(v.seconds * 1000).toLocaleDateString();
                              const d = new Date(v);
                              return isNaN(d.getTime()) ? String(v) : d.toLocaleDateString();
                            };
                            return (
                              <tr
                                key={job.id}
                                className={`ad-tr-clickable${isSelected ? " ad-tr-selected" : ""}`}
                                onClick={() => setSelectedJob(isSelected ? null : job)}
                              >
                                <td className="ad-td-index">{idx + 1}</td>
                                <td className="ad-td-bold">{job.title ?? "Untitled"}</td>
                                <td>{job.company ?? job.companyName ?? "—"}</td>
                                <td style={{ fontSize: '0.82rem' }}>{fmtD(job.startDate)}</td>
                                <td style={{ fontSize: '0.82rem' }}>{fmtD(job.endDate ?? job.deadline)}</td>
                                <td>
                                  <span className="ad-count-pill">{jobApps.length}</span>
                                </td>
                                <td>{job.postedBy ?? "—"}</td>
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

            {/* ================== DATA EXPORTS / DOCUMENTS ================== */}
            {activeView === "documents" && (
              <div className="ad-fade">
                <section className="ad-grid-3" style={{ marginBottom: "1.25rem" }}>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: "none", padding: 0 }}>
                      <UsersIcon
                        style={{
                          width: "1.2rem",
                          height: "1.2rem",
                          color: "var(--ad-cyan)",
                          marginBottom: "0.3rem",
                        }}
                      />
                      <span className="ad-exec-cell-label">TOTAL STUDENTS</span>
                      <span className="ad-exec-cell-value">{students.length}</span>
                    </div>
                  </div>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: "none", padding: 0 }}>
                      <UserCheckIcon
                        style={{
                          width: "1.2rem",
                          height: "1.2rem",
                          color: "var(--ad-emerald)",
                          marginBottom: "0.3rem",
                        }}
                      />
                      <span className="ad-exec-cell-label">PLACED STUDENTS</span>
                      <span className="ad-exec-cell-value">{placedCount}</span>
                    </div>
                  </div>
                  <div className="ad-card">
                    <div className="ad-exec-cell" style={{ border: "none", padding: 0 }}>
                      <UserXIcon
                        style={{
                          width: "1.2rem",
                          height: "1.2rem",
                          color: "var(--ad-red)",
                          marginBottom: "0.3rem",
                        }}
                      />
                      <span className="ad-exec-cell-label">NOT PLACED</span>
                      <span className="ad-exec-cell-value">{unplacedCount}</span>
                    </div>
                  </div>
                </section>

                <div className="ad-card ad-card-full">
                  <div className="ad-card-head">
                    <h3 className="ad-card-label">Student Data Exports</h3>
                    <span className="ad-count-pill">4 CSV downloads</span>
                  </div>
                  <p className="ad-upload-desc" style={{ marginBottom: "0.9rem", maxWidth: "none" }}>
                    Download complete student datasets or placement-specific reports in CSV format.
                  </p>
                  <div className="ad-action-grid">
                    {[
                      {
                        title: "Download all students data as CSV",
                        desc: "Exports all student records into one file.",
                        icon: FileSpreadsheetIcon,
                        accent: "var(--ad-emerald)",
                        onClick: downloadAllStudentsCsv,
                      },
                      {
                        title: "Download students data by major/branch as CSV",
                        desc: "Exports separate CSV files grouped by major or branch.",
                        icon: BarChart3Icon,
                        accent: "var(--ad-cyan)",
                        onClick: downloadStudentsByMajorOrBranchCsv,
                      },
                      {
                        title: "Download placed students data as CSV",
                        desc: "Exports students who got placed.",
                        icon: UserCheckIcon,
                        accent: "var(--ad-amber)",
                        onClick: downloadPlacedStudentsCsv,
                      },
                      {
                        title: "Download students who did not get placed as CSV",
                        desc: "Exports students who are not placed.",
                        icon: UserXIcon,
                        accent: "var(--ad-red)",
                        onClick: downloadNotPlacedStudentsCsv,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          type="button"
                          className="ad-action-tile"
                          key={item.title}
                          onClick={item.onClick}
                          style={{
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            minHeight: "4rem",
                            padding: "0.8rem",
                          }}
                        >
                          <Icon
                            className="ad-action-tile-icon"
                            style={{ color: item.accent, width: "1rem", height: "1rem", marginTop: "0.15rem" }}
                          />
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.22rem", textAlign: "left" }}>
                            <span style={{ fontSize: "0.82rem", fontWeight: 600 }}>{item.title}</span>
                            <span className="ad-task-secondary" style={{ fontSize: "0.74rem" }}>
                              {item.desc}
                            </span>
                          </div>
                        </button>
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
