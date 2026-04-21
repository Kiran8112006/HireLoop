"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
  ChevronLeftIcon, 
  MapPinIcon, 
  BriefcaseIcon, 
  ClockIcon, 
  Building2Icon, 
  CheckCircleIcon,
  GlobeIcon,
  ShieldCheckIcon
} from "lucide-react";
import Link from "next/link";

export default function JobDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

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
    const fetchJobData = async () => {
      if (!id || !user) return;
      setLoading(true);
      try {
        // 1. Fetch Job
        const docRef = doc(db, "jobs", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setJob({ id: docSnap.id, ...docSnap.data() });
        } else {
          alert("Job not found");
          router.push("/student");
        }

        // 2. Check if already applied
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
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [id, user, router]);

  if (loading) {
    return (
      <div className="sd-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="ad-spinner" />
      </div>
    );
  }

  const theme = { bg: "linear-gradient(180deg, rgba(56, 189, 248, 0.08), transparent)", border: "var(--ad-border)" };

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
            Job Opportunities
          </div>
        </header>
      </div>

      <div className="sd-content" style={{ maxWidth: '1000px', display: 'block' }}>
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
            marginBottom: '2rem'
          }}
          className="hover:text-white"
        >
          <ChevronLeftIcon size={18} />
          Back to feed
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
          {/* LEFT COLUMN: PRIMARY INFO */}
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '20px', 
                background: 'var(--ad-surface)', 
                display: 'grid', 
                placeItems: 'center', 
                fontSize: '2rem', 
                fontWeight: 'bold',
                border: '1px solid var(--ad-border)',
                flexShrink: 0
              }}>
                {job?.companyName ? job.companyName.charAt(0).toUpperCase() : "C"}
              </div>
              <div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.1', marginBottom: '0.5rem' }}>{job?.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ad-cyan)', fontWeight: '600' }}>
                    <Building2Icon size={18} />
                    {job?.companyName}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--ad-muted)' }}>
                    <MapPinIcon size={18} />
                    {job?.location || "Remote"}
                  </div>
                </div>
              </div>
            </div>



            <section style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderLeft: '4px solid var(--ad-cyan)', paddingLeft: '1rem' }}>Description</h3>
              <div style={{ color: 'var(--ad-text)', lineHeight: '1.8', fontSize: '1.05rem', opacity: 0.9, whiteSpace: 'pre-wrap' }}>
                {job?.description || "No description provided."}
              </div>
            </section>

            <section style={{ marginBottom: '3rem' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderLeft: '4px solid var(--ad-cyan)', paddingLeft: '1rem' }}>Requirements</h3>
              <div style={{ color: 'var(--ad-text)', lineHeight: '1.8', fontSize: '1.05rem', opacity: 0.9, whiteSpace: 'pre-wrap' }}>
                {job?.requirements || "No specific requirements listed."}
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: ACTION PANEL */}
          <div style={{ position: 'relative' }}>
             <aside style={{ 
               padding: '2rem', 
               background: 'var(--ad-card-bg)', 
               border: '1px solid var(--ad-border)', 
               borderRadius: '24px',
               position: 'sticky',
               top: '2rem',
               boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
             }}>
                {alreadyApplied ? (
                  <div style={{ 
                    padding: '1.25rem', 
                    background: 'rgba(16, 185, 129, 0.05)', 
                    border: '1px solid var(--ad-emerald)', 
                    borderRadius: '16px',
                    textAlign: 'center'
                  }}>
                    <CheckCircleIcon size={24} style={{ color: 'var(--ad-emerald)', marginBottom: '0.5rem' }} />
                    <div style={{ fontWeight: '700', color: 'white' }}>Already Applied</div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--ad-muted)', marginTop: '0.25rem' }}>Your application is under review.</p>
                  </div>
                ) : (
                  <button 
                    onClick={() => router.push(`/student/apply/${id}`)}
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
                    Apply for this job
                  </button>
                )}

                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--ad-muted)', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  <ShieldCheckIcon size={14} />
                  Safe and Secure Application Process
                </p>
             </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
