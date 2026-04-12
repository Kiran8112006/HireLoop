'use client';

import { type Experience } from '@/lib/resume-types';
import { PlusIcon, TrashIcon, PlusCircleIcon, XIcon } from 'lucide-react';

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export default function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  const addExperience = () => {
    onChange([
      ...data,
      {
        id: `exp-${Date.now()}`,
        company: '',
        position: '',
        location: '',
        start_date: '',
        end_date: '',
        description: '',
        achievements: [''],
      },
    ]);
  };

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const updated = [...data];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  const addAchievement = (expIndex: number) => {
    const updated = [...data];
    updated[expIndex].achievements = [...(updated[expIndex].achievements || []), ''];
    onChange(updated);
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updated = [...data];
    updated[expIndex].achievements = updated[expIndex].achievements.filter(
      (_, i) => i !== achIndex
    );
    onChange(updated);
  };

  const updateAchievement = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...data];
    updated[expIndex].achievements = [...updated[expIndex].achievements];
    updated[expIndex].achievements[achIndex] = value;
    onChange(updated);
  };

  return (
    <div className="rb-form-section">
      <div className="rb-form-header">
        <h2>Work Experience</h2>
        <p>Add your professional experience. This section is optional for students.</p>
      </div>

      {data.map((exp, index) => (
        <div key={exp.id || index} className="rb-card">
          <div className="rb-card-header">
            <h3>Experience #{index + 1}</h3>
            <button
              type="button"
              className="rb-icon-btn rb-icon-btn-danger"
              onClick={() => removeExperience(index)}
              title="Remove experience"
            >
              <TrashIcon style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>

          <div className="rb-form-grid">
            <div className="rb-field">
              <label>Position <span className="rb-required">*</span></label>
              <input
                className="rb-input"
                value={exp.position}
                onChange={(e) => updateExperience(index, 'position', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div className="rb-field">
              <label>Company <span className="rb-required">*</span></label>
              <input
                className="rb-input"
                value={exp.company}
                onChange={(e) => updateExperience(index, 'company', e.target.value)}
                placeholder="Acme Corp"
              />
            </div>
            <div className="rb-field">
              <label>Location <span className="rb-required">*</span></label>
              <input
                className="rb-input"
                value={exp.location}
                onChange={(e) => updateExperience(index, 'location', e.target.value)}
                placeholder="New York, NY"
              />
            </div>
            <div className="rb-field">
              <label>Description</label>
              <input
                className="rb-input"
                value={exp.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                placeholder="Brief role description"
              />
            </div>
            <div className="rb-field">
              <label>Start Date <span className="rb-required">*</span></label>
              <input
                className="rb-input"
                value={exp.start_date}
                onChange={(e) => updateExperience(index, 'start_date', e.target.value)}
                placeholder="2022-01"
              />
            </div>
            <div className="rb-field">
              <label>End Date <span className="rb-required">*</span></label>
              <input
                className="rb-input"
                value={exp.end_date}
                onChange={(e) => updateExperience(index, 'end_date', e.target.value)}
                placeholder="Present"
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="rb-field rb-field-full" style={{ marginTop: '0.75rem' }}>
            <label>Key Achievements</label>
            {(exp.achievements || []).map((ach, achIdx) => (
              <div key={achIdx} className="rb-inline-group">
                <input
                  className="rb-input"
                  value={ach}
                  onChange={(e) => updateAchievement(index, achIdx, e.target.value)}
                  placeholder={`Achievement #${achIdx + 1}`}
                />
                <button
                  type="button"
                  className="rb-icon-btn rb-icon-btn-danger"
                  onClick={() => removeAchievement(index, achIdx)}
                  title="Remove"
                >
                  <XIcon style={{ width: '0.85rem', height: '0.85rem' }} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="rb-text-btn"
              onClick={() => addAchievement(index)}
            >
              <PlusCircleIcon style={{ width: '0.9rem', height: '0.9rem' }} />
              Add Achievement
            </button>
          </div>
        </div>
      ))}

      <button type="button" className="rb-add-btn" onClick={addExperience}>
        <PlusIcon style={{ width: '1rem', height: '1rem' }} />
        Add Experience
      </button>
    </div>
  );
}
