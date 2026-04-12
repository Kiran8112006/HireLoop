'use client';

import { type Education } from '@/lib/resume-types';
import { PlusIcon, TrashIcon, PlusCircleIcon, XIcon } from 'lucide-react';

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export default function EducationForm({ data, onChange }: EducationFormProps) {
  const addEducation = () => {
    onChange([
      ...data,
      {
        id: `edu-${Date.now()}`,
        institution: '',
        degree: '',
        field: '',
        location: '',
        graduation_date: '',
        gpa: '',
        result: '',
        honors: [],
      },
    ]);
  };

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const updated = [...data];
    (updated[index] as any)[field] = value;
    onChange(updated);
  };

  const addHonor = (eduIndex: number) => {
    const updated = [...data];
    updated[eduIndex].honors = [...(updated[eduIndex].honors || []), ''];
    onChange(updated);
  };

  const removeHonor = (eduIndex: number, honorIndex: number) => {
    const updated = [...data];
    updated[eduIndex].honors = (updated[eduIndex].honors || []).filter(
      (_, i) => i !== honorIndex
    );
    onChange(updated);
  };

  const updateHonor = (eduIndex: number, honorIndex: number, value: string) => {
    const updated = [...data];
    const honors = [...(updated[eduIndex].honors || [])];
    honors[honorIndex] = value;
    updated[eduIndex].honors = honors;
    onChange(updated);
  };

  return (
    <div className="rb-form-section">
      <div className="rb-form-header">
        <h2>Education</h2>
        <p>Add your educational background. All fields are optional.</p>
      </div>

      {data.map((edu, index) => (
        <div key={edu.id || index} className="rb-card">
          <div className="rb-card-header">
            <h3>Education #{index + 1}</h3>
            <button
              type="button"
              className="rb-icon-btn rb-icon-btn-danger"
              onClick={() => removeEducation(index)}
              title="Remove education"
            >
              <TrashIcon style={{ width: '1rem', height: '1rem' }} />
            </button>
          </div>

          <div className="rb-form-grid">
            <div className="rb-field">
              <label>Degree</label>
              <input
                className="rb-input"
                value={edu.degree || ''}
                onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
              />
            </div>
            <div className="rb-field">
              <label>Field of Study</label>
              <input
                className="rb-input"
                value={edu.field || ''}
                onChange={(e) => updateEducation(index, 'field', e.target.value)}
                placeholder="Computer Science"
              />
            </div>
            <div className="rb-field">
              <label>Institution</label>
              <input
                className="rb-input"
                value={edu.institution || ''}
                onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                placeholder="MIT"
              />
            </div>
            <div className="rb-field">
              <label>Location</label>
              <input
                className="rb-input"
                value={edu.location || ''}
                onChange={(e) => updateEducation(index, 'location', e.target.value)}
                placeholder="Cambridge, MA"
              />
            </div>
            <div className="rb-field">
              <label>Graduation Date</label>
              <input
                className="rb-input"
                value={edu.graduation_date || ''}
                onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)}
                placeholder="2024-05"
              />
            </div>
            <div className="rb-field">
              <label>GPA / Result</label>
              <input
                className="rb-input"
                value={edu.gpa || edu.result || ''}
                onChange={(e) => {
                  updateEducation(index, 'gpa', e.target.value);
                  updateEducation(index, 'result', e.target.value);
                }}
                placeholder="3.8 / 4.0"
              />
            </div>
          </div>

          {/* Honors */}
          <div className="rb-field rb-field-full" style={{ marginTop: '0.75rem' }}>
            <label>Honors &amp; Awards</label>
            {(edu.honors || []).map((honor, hIdx) => (
              <div key={hIdx} className="rb-inline-group">
                <input
                  className="rb-input"
                  value={honor}
                  onChange={(e) => updateHonor(index, hIdx, e.target.value)}
                  placeholder={`Honor #${hIdx + 1}`}
                />
                <button
                  type="button"
                  className="rb-icon-btn rb-icon-btn-danger"
                  onClick={() => removeHonor(index, hIdx)}
                  title="Remove"
                >
                  <XIcon style={{ width: '0.85rem', height: '0.85rem' }} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="rb-text-btn"
              onClick={() => addHonor(index)}
            >
              <PlusCircleIcon style={{ width: '0.9rem', height: '0.9rem' }} />
              Add Honor
            </button>
          </div>
        </div>
      ))}

      <button type="button" className="rb-add-btn" onClick={addEducation}>
        <PlusIcon style={{ width: '1rem', height: '1rem' }} />
        Add Education
      </button>
    </div>
  );
}
