'use client';

import { type Certification, type Project } from '@/lib/resume-types';
import { PlusIcon, TrashIcon, PlusCircleIcon, XIcon } from 'lucide-react';
import { useState } from 'react';

interface OptionalSectionsFormProps {
  certifications: Certification[];
  projects: Project[];
  awards: string[];
  onCertificationsChange: (data: Certification[]) => void;
  onProjectsChange: (data: Project[]) => void;
  onAwardsChange: (data: string[]) => void;
}

export default function OptionalSectionsForm({
  certifications,
  projects,
  awards,
  onCertificationsChange,
  onProjectsChange,
  onAwardsChange,
}: OptionalSectionsFormProps) {
  const [awardInput, setAwardInput] = useState('');

  /* ---- Certifications ---- */
  const addCertification = () => {
    onCertificationsChange([
      ...certifications,
      { id: `cert-${Date.now()}`, name: '', issuer: '', date: '', credential_id: '' },
    ]);
  };

  const removeCertification = (index: number) => {
    onCertificationsChange(certifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = [...certifications];
    (updated[index] as any)[field] = value;
    onCertificationsChange(updated);
  };

  /* ---- Projects ---- */
  const addProject = () => {
    onProjectsChange([
      ...projects,
      { id: `proj-${Date.now()}`, name: '', description: '', technologies: [], link: '' },
    ]);
  };

  const removeProject = (index: number) => {
    onProjectsChange(projects.filter((_, i) => i !== index));
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const updated = [...projects];
    (updated[index] as any)[field] = value;
    onProjectsChange(updated);
  };

  /* ---- Awards ---- */
  const addAward = () => {
    const value = awardInput.trim();
    if (!value) return;
    onAwardsChange([...awards, value]);
    setAwardInput('');
  };

  const removeAward = (index: number) => {
    onAwardsChange(awards.filter((_, i) => i !== index));
  };

  return (
    <div className="rb-form-section">
      <div className="rb-form-header">
        <h2>Optional Sections</h2>
        <p>Add certifications, projects, and awards to strengthen your resume.</p>
      </div>

      {/* ─── Certifications ─── */}
      <div className="rb-subsection">
        <h3 className="rb-subsection-title">Certifications</h3>

        {certifications.map((cert, index) => (
          <div key={cert.id || index} className="rb-card">
            <div className="rb-card-header">
              <h4>Certification #{index + 1}</h4>
              <button
                type="button"
                className="rb-icon-btn rb-icon-btn-danger"
                onClick={() => removeCertification(index)}
              >
                <TrashIcon style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
            <div className="rb-form-grid">
              <div className="rb-field">
                <label>Name <span className="rb-required">*</span></label>
                <input
                  className="rb-input"
                  value={cert.name}
                  onChange={(e) => updateCertification(index, 'name', e.target.value)}
                  placeholder="AWS Certified Solutions Architect"
                />
              </div>
              <div className="rb-field">
                <label>Issuer</label>
                <input
                  className="rb-input"
                  value={cert.issuer}
                  onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                  placeholder="Amazon"
                />
              </div>
              <div className="rb-field">
                <label>Date</label>
                <input
                  className="rb-input"
                  value={cert.date}
                  onChange={(e) => updateCertification(index, 'date', e.target.value)}
                  placeholder="2024-03"
                />
              </div>
              <div className="rb-field">
                <label>Credential ID</label>
                <input
                  className="rb-input"
                  value={cert.credential_id || ''}
                  onChange={(e) => updateCertification(index, 'credential_id', e.target.value)}
                  placeholder="ABC123"
                />
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="rb-add-btn" onClick={addCertification}>
          <PlusIcon style={{ width: '1rem', height: '1rem' }} />
          Add Certification
        </button>
      </div>

      {/* ─── Projects ─── */}
      <div className="rb-subsection">
        <h3 className="rb-subsection-title">Projects</h3>

        {projects.map((project, index) => (
          <div key={project.id || index} className="rb-card">
            <div className="rb-card-header">
              <h4>Project #{index + 1}</h4>
              <button
                type="button"
                className="rb-icon-btn rb-icon-btn-danger"
                onClick={() => removeProject(index)}
              >
                <TrashIcon style={{ width: '1rem', height: '1rem' }} />
              </button>
            </div>
            <div className="rb-form-grid">
              <div className="rb-field">
                <label>Project Name <span className="rb-required">*</span></label>
                <input
                  className="rb-input"
                  value={project.name}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  placeholder="Portfolio Website"
                />
              </div>
              <div className="rb-field">
                <label>Link</label>
                <input
                  className="rb-input"
                  value={project.link || ''}
                  onChange={(e) => updateProject(index, 'link', e.target.value)}
                  placeholder="https://github.com/…"
                />
              </div>
            </div>
            <div className="rb-field rb-field-full" style={{ marginTop: '0.75rem' }}>
              <label>Description</label>
              <textarea
                className="rb-textarea"
                value={project.description}
                onChange={(e) => updateProject(index, 'description', e.target.value)}
                placeholder="What you built, the tech used, and the impact."
                rows={3}
              />
            </div>
          </div>
        ))}

        <button type="button" className="rb-add-btn" onClick={addProject}>
          <PlusIcon style={{ width: '1rem', height: '1rem' }} />
          Add Project
        </button>
      </div>

      {/* ─── Awards ─── */}
      <div className="rb-subsection">
        <h3 className="rb-subsection-title">Awards &amp; Achievements</h3>
        <div className="rb-inline-group">
          <input
            className="rb-input"
            value={awardInput}
            onChange={(e) => setAwardInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addAward();
              }
            }}
            placeholder="Dean's List 2024"
          />
          <button type="button" className="rb-small-btn" onClick={addAward}>
            Add
          </button>
        </div>

        {awards.length > 0 && (
          <ul className="rb-list">
            {awards.map((award, idx) => (
              <li key={idx}>
                <span>{award}</span>
                <button
                  type="button"
                  className="rb-icon-btn rb-icon-btn-danger"
                  onClick={() => removeAward(idx)}
                >
                  <XIcon style={{ width: '0.8rem', height: '0.8rem' }} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
