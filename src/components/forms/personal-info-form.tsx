'use client';

import { type PersonalInfo } from '@/lib/resume-types';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export default function PersonalInfoForm({
  data = {
    full_name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    summary: '',
  },
  onChange,
}: PersonalInfoFormProps) {
  const handleChange = (field: keyof PersonalInfo, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="rb-form-section">
      <div className="rb-form-header">
        <h2>Personal Information</h2>
        <p>Let&apos;s start with your basic contact information.</p>
      </div>

      <div className="rb-form-grid">
        <div className="rb-field">
          <label htmlFor="full_name">
            Full Name <span className="rb-required">*</span>
          </label>
          <input
            id="full_name"
            className="rb-input"
            value={data.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="rb-field">
          <label htmlFor="email">
            Email <span className="rb-required">*</span>
          </label>
          <input
            id="email"
            type="email"
            className="rb-input"
            value={data.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="rb-field">
          <label htmlFor="phone">
            Phone Number <span className="rb-required">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            className="rb-input"
            value={data.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>

        <div className="rb-field">
          <label htmlFor="location">
            Current Address <span className="rb-required">*</span>
          </label>
          <input
            id="location"
            className="rb-input"
            value={data.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="San Francisco, CA"
            required
          />
        </div>

        <div className="rb-field">
          <label htmlFor="linkedin">
            LinkedIn Profile <span className="rb-optional">(Optional)</span>
          </label>
          <input
            id="linkedin"
            className="rb-input"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>

        <div className="rb-field">
          <label htmlFor="portfolio">
            Portfolio / Website <span className="rb-optional">(Optional)</span>
          </label>
          <input
            id="portfolio"
            className="rb-input"
            value={data.portfolio || ''}
            onChange={(e) => handleChange('portfolio', e.target.value)}
            placeholder="johndoe.com"
          />
        </div>
      </div>

      <div className="rb-field rb-field-full">
        <label htmlFor="summary">
          Professional Summary <span className="rb-required">*</span>
        </label>
        <textarea
          id="summary"
          className="rb-textarea"
          value={data.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="A brief summary of your professional background, key skills, and career objectives. Keep it concise (2-3 sentences)."
          rows={5}
          required
        />
        <span className="rb-char-count">{(data.summary || '').length} characters</span>
      </div>
    </div>
  );
}
