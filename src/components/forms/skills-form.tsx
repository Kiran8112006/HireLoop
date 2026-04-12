'use client';

import { useState } from 'react';
import { type Skills } from '@/lib/resume-types';
import { XIcon } from 'lucide-react';

interface SkillsFormProps {
  data: Skills;
  onChange: (data: Skills) => void;
}

type SkillCategory = keyof Skills;

const CATEGORIES: { key: SkillCategory; label: string; placeholder: string }[] = [
  { key: 'technical', label: 'Technical Skills', placeholder: 'e.g. React, Python, SQL…' },
  { key: 'tools', label: 'Tools & Technologies', placeholder: 'e.g. Git, Docker, AWS…' },
  { key: 'soft', label: 'Soft Skills', placeholder: 'e.g. Leadership, Communication…' },
  { key: 'languages', label: 'Languages', placeholder: 'e.g. English, Spanish…' },
];

export default function SkillsForm({ data, onChange }: SkillsFormProps) {
  const [inputs, setInputs] = useState<Record<SkillCategory, string>>({
    technical: '',
    soft: '',
    tools: '',
    languages: '',
  });

  const addSkill = (category: SkillCategory) => {
    const value = inputs[category].trim();
    if (!value || data[category].includes(value)) return;

    onChange({
      ...data,
      [category]: [...data[category], value],
    });
    setInputs({ ...inputs, [category]: '' });
  };

  const removeSkill = (category: SkillCategory, index: number) => {
    onChange({
      ...data,
      [category]: data[category].filter((_, i) => i !== index),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, category: SkillCategory) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(category);
    }
  };

  return (
    <div className="rb-form-section">
      <div className="rb-form-header">
        <h2>Skills</h2>
        <p>Add your skills by category. Type a skill and press Enter or click Add.</p>
      </div>

      {CATEGORIES.map(({ key, label, placeholder }) => (
        <div key={key} className="rb-card">
          <h3>{label} {key === 'technical' && <span className="rb-required">*</span>}</h3>

          <div className="rb-inline-group">
            <input
              className="rb-input"
              value={inputs[key]}
              onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, key)}
              placeholder={placeholder}
            />
            <button
              type="button"
              className="rb-small-btn"
              onClick={() => addSkill(key)}
            >
              Add
            </button>
          </div>

          {data[key].length > 0 && (
            <div className="rb-tags">
              {data[key].map((skill, idx) => (
                <span key={idx} className="rb-tag">
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(key, idx)}
                    className="rb-tag-remove"
                    title="Remove"
                  >
                    <XIcon style={{ width: '0.7rem', height: '0.7rem' }} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
