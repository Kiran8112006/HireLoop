"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { 
  UserIcon, 
  MailIcon, 
  PhoneIcon, 
  MapPinIcon, 
  LinkIcon as LinkedinIcon, 
  GlobeIcon, 
  GraduationCapIcon, 
  CodeIcon, 
  SaveIcon, 
  ChevronLeftIcon,
  CameraIcon
} from "lucide-react";
import Link from "next/link";

export default function StudentProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    bio: "",
    gpa: "",
    skills: "", // Comma separated for editing, will store as array/string
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
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const docRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData({
            name: data.name || user.displayName || "",
            email: data.email || user.email || "",
            phone: data.phone || "",
            location: data.location || "",
            linkedin: data.linkedin || "",
            portfolio: data.portfolio || "",
            bio: data.bio || "",
            gpa: data.gpa || "",
            skills: Array.isArray(data.skills) ? data.skills.join(", ") : (data.skills || ""),
          });
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const docRef = doc(db, "students", user.uid);
      await updateDoc(docRef, {
        ...formData,
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s !== ""),
        updatedAt: new Date(),
      });
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="sd-layout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="ad-spinner" />
      </div>
    );
  }

  return (
    <div className="sd-layout">
      {/* HEADER */}
      <div className="sd-header-wrap">
        <header className="sd-nav">
          <Link href="/student" className="sd-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="sd-logo-icon"></div>
            HireLoop
          </Link>
          <div className="sd-nav-right">
             <Link href="/student" className="sd-nav-link">Dashboard</Link>
             <Link href="/student/profile" className="sd-nav-link active">Profile</Link>
          </div>
        </header>
      </div>

      <div className="sd-content" style={{ maxWidth: '1000px', display: 'block' }}>
        {/* TOP ACTION BAR */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <button 
              onClick={() => router.push("/student")} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--ad-muted)', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginBottom: '0.5rem'
              }}
              className="hover:text-white"
            >
              <ChevronLeftIcon size={18} />
              Back to Dashboard
            </button>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-1px' }}>Settings</h1>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="btn-primary" 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.85rem 2rem',
              fontSize: '1rem',
              boxShadow: '0 8px 25px rgba(56, 189, 248, 0.25)'
            }}
          >
            {saving ? "Saving..." : <><SaveIcon size={18} /> Save Changes</>}
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '2.5rem' }}>
          
          {/* LEFT COLUMN: AVATAR & QUICK INFO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="sd-promo-card-premium" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
              <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem auto' }}>
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%', 
                  background: 'var(--ad-surface)', 
                  border: '2px solid var(--ad-cyan)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '3rem',
                  fontWeight: 'bold',
                  overflow: 'hidden'
                }}>
                  {formData.name ? formData.name.charAt(0).toUpperCase() : <UserIcon size={48} />}
                </div>
                <button 
                  type="button"
                  style={{ 
                    position: 'absolute', 
                    bottom: '0', 
                    right: '0', 
                    background: 'var(--ad-cyan)', 
                    color: 'var(--ad-bg)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'grid',
                    placeItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                >
                  <CameraIcon size={18} />
                </button>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{formData.name || "Student Name"}</h3>
              <p style={{ color: 'var(--ad-muted)', fontSize: '0.9rem', marginBottom: '0' }}>{formData.email}</p>
            </div>

            <div className="sd-applications-card" style={{ padding: '1.5rem' }}>
              <h3 className="sd-applications-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CodeIcon size={18} /> Skills
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                {formData.skills.split(",").map((s, i) => (
                  s.trim() && (
                    <span key={i} className="sd-job-tag" style={{ background: 'rgba(56, 189, 248, 0.05)', borderColor: 'rgba(56, 189, 248, 0.2)' }}>
                      {s.trim()}
                    </span>
                  )
                ))}
                {!formData.skills.trim() && <p style={{ color: 'var(--ad-muted)', fontSize: '0.85rem' }}>No skills added yet.</p>}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DETAILED FORM */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* PERSONAL INFORMATION */}
            <div className="sd-modal" style={{ width: '100%', maxWidth: 'none', padding: '2rem', marginBottom: '0', boxShadow: 'none', background: 'var(--ad-card-bg)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <UserIcon size={20} style={{ color: 'var(--ad-cyan)' }} /> Personal Information
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="sd-form-group">
                  <label><UserIcon size={14} style={{ marginRight: '6px' }} /> Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    className="ui-input"
                  />
                </div>
                <div className="sd-form-group">
                  <label><MailIcon size={14} style={{ marginRight: '6px' }} /> Email Address</label>
                  <input 
                    type="text" 
                    disabled
                    value={formData.email} 
                    placeholder="john@example.com"
                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    className="ui-input"
                  />
                </div>
                <div className="sd-form-group">
                  <label><PhoneIcon size={14} style={{ marginRight: '6px' }} /> Phone Number</label>
                  <input 
                    type="text" 
                    value={formData.phone} 
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                    className="ui-input"
                  />
                </div>
                <div className="sd-form-group">
                  <label><MapPinIcon size={14} style={{ marginRight: '6px' }} /> Location</label>
                  <input 
                    type="text" 
                    value={formData.location} 
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Mumbai, India"
                    className="ui-input"
                  />
                </div>
              </div>
            </div>

            {/* BIO & ACADEMICS */}
            <div className="sd-modal" style={{ width: '100%', maxWidth: 'none', padding: '2rem', marginBottom: '0', boxShadow: 'none', background: 'var(--ad-card-bg)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <GraduationCapIcon size={20} style={{ color: 'var(--ad-cyan)' }} /> About & Academics
              </h2>
              
              <div className="sd-form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Professional Bio</label>
                <textarea 
                  rows={4} 
                  value={formData.bio} 
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell recruiters about yourself, your goals and your expertise..."
                  style={{ background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="sd-form-group">
                  <label>Current GPA / academic result</label>
                  <input 
                    type="text" 
                    value={formData.gpa} 
                    onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                    placeholder="e.g. 3.8/4.0 or 8.5/10"
                    className="ui-input"
                  />
                </div>
                <div className="sd-form-group">
                   <label>Skills (comma separated)</label>
                   <input 
                    type="text" 
                    value={formData.skills} 
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="React, TypeScript, Node.js..."
                    className="ui-input"
                  />
                </div>
              </div>
            </div>

            {/* SOCIALS & LINKS */}
            <div className="sd-modal" style={{ width: '100%', maxWidth: 'none', padding: '2rem', marginBottom: '0', boxShadow: 'none', background: 'var(--ad-card-bg)' }}>
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <GlobeIcon size={20} style={{ color: 'var(--ad-cyan)' }} /> Socials & Links
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="sd-form-group">
                  <label><LinkedinIcon size={14} style={{ marginRight: '6px' }} /> LinkedIn URL</label>
                  <input 
                    type="text" 
                    value={formData.linkedin} 
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="ui-input"
                  />
                </div>
                <div className="sd-form-group">
                  <label><GlobeIcon size={14} style={{ marginRight: '6px' }} /> Portfolio / Website</label>
                  <input 
                    type="text" 
                    value={formData.portfolio} 
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="https://yourportfolio.com"
                    className="ui-input"
                  />
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>

      <style jsx>{`
        .ui-input {
          background: rgba(15, 23, 42, 0.4) !important;
          border: 1px solid var(--ad-border) !important;
          transition: all 0.2s;
        }
        .ui-input:focus {
          border-color: var(--ad-cyan) !important;
          background: rgba(56, 189, 248, 0.05) !important;
          outline: none;
          box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.1) !important;
        }
        .ad-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(56, 189, 248, 0.1);
          border-top-color: var(--ad-cyan);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
