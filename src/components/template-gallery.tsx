'use client';

import { useState } from 'react';
import { CheckIcon, SparklesIcon } from 'lucide-react';
import type { ResumeTemplate, StructuredResume } from '@/lib/resume-types';

import ModernMinimal from '@/components/resume-templates/modern-minimal';
import ClassicCorporate from '@/components/resume-templates/classic-corporate';
import TechCreative from '@/components/resume-templates/tech-creative';
import ExecutiveProfessional from '@/components/resume-templates/executive-professional';
import MinimalistProfessional from '@/components/resume-templates/minimalist-professional';
import BoldModern from '@/components/resume-templates/bold-modern';
import ElegantSerif from '@/components/resume-templates/elegant-serif';
import CreativeSidebar from '@/components/resume-templates/creative-sidebar';
import CompactEfficient from '@/components/resume-templates/compact-efficient';
import TwoColumnBalanced from '@/components/resume-templates/two-column-balanced';
import TimelineFocused from '@/components/resume-templates/timeline-focused';
import PortfolioShowcase from '@/components/resume-templates/portfolio-showcase';
import AcademicDetailed from '@/components/resume-templates/academic-detailed';

import CleanContemporary from '@/components/resume-templates/clean-contemporary';
import SplitAccent from '@/components/resume-templates/split-accent';

const sampleResumeData: StructuredResume = {
  personal: {
    full_name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johndoe',
    portfolio: 'johndoe.com',
    summary:
      'Experienced professional with expertise in software development and team leadership.',
  },
  experience: [
    {
      id: '1',
      company: 'Tech Company',
      position: 'Senior Developer',
      location: 'San Francisco, CA',
      start_date: '2020-01',
      end_date: '2024-12',
      description: 'Led development of key features',
      achievements: ['Increased performance by 40%', 'Mentored 5 junior developers'],
    },
  ],
  education: [
    {
      id: '1',
      institution: 'University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      location: 'CA',
      graduation_date: '2020-05',
      gpa: '3.8',
      honors: ['Magna Cum Laude'],
    },
  ],
  skills: {
    technical: ['JavaScript', 'React', 'Node.js'],
    soft: ['Leadership', 'Communication'],
    tools: ['Git', 'VS Code'],
    languages: ['English'],
  },
  certifications: [],
  projects: [],
  awards: [],
};

interface TemplateGalleryProps {
  selectedTemplateId?: string;
  onSelectTemplate: (templateId: string) => void;
}

export const TEMPLATES: ResumeTemplate[] = [
  {
    id: 'modern-minimal',
    name: 'Modern Minimal',
    description: 'Clean blue gradient design with icons. Perfect for tech and creative roles.',
    category: 'modern',
    suitable_for: ['Software Engineer', 'Developer', 'Designer', 'Data Scientist'],
  },
  {
    id: 'classic-corporate',
    name: 'Classic Corporate',
    description: 'Traditional ATS-friendly format. Ideal for business and finance professionals.',
    category: 'traditional',
    suitable_for: ['Business Analyst', 'Manager', 'Consultant', 'Finance'],
  },
  {
    id: 'tech-creative',
    name: 'Tech Creative',
    description: 'Bold sidebar layout with purple gradient. Great for designers and developers.',
    category: 'creative',
    suitable_for: ['UI/UX Designer', 'Frontend Developer', 'Product Designer'],
  },
  {
    id: 'executive-professional',
    name: 'Executive Professional',
    description: 'Sophisticated format for senior leadership. Emphasizes experience.',
    category: 'executive',
    suitable_for: ['VP', 'Director', 'Senior Manager', 'Executive'],
  },
  {
    id: 'minimalist-professional',
    name: 'Minimalist Professional',
    description: 'Ultra-clean design with maximum white space. Light typography.',
    category: 'modern',
    suitable_for: ['Designer', 'Architect', 'Consultant', 'Product Manager'],
  },
  {
    id: 'bold-modern',
    name: 'Bold Modern',
    description: 'Eye-catching orange and red gradients with dynamic angles.',
    category: 'creative',
    suitable_for: ['Marketing', 'Sales', 'Creative Director', 'Entrepreneur'],
  },
  {
    id: 'elegant-serif',
    name: 'Elegant Serif',
    description: 'Classic serif typography with centered layout. Timeless and sophisticated.',
    category: 'traditional',
    suitable_for: ['Lawyer', 'Academic', 'Writer', 'Publishing'],
  },
  {
    id: 'creative-sidebar',
    name: 'Creative Sidebar',
    description: 'Teal sidebar with profile circle. Perfect balance of style and function.',
    category: 'creative',
    suitable_for: ['Designer', 'Developer', 'Marketing', 'Media'],
  },
  {
    id: 'compact-efficient',
    name: 'Compact Efficient',
    description: 'Three-column layout maximizing space. Fits more content without clutter.',
    category: 'modern',
    suitable_for: ['Entry Level', 'Mid-Career', 'Career Changer'],
  },
  {
    id: 'two-column-balanced',
    name: 'Two Column Balanced',
    description: 'Clean two-column layout with blue accents. Professional and organized.',
    category: 'traditional',
    suitable_for: ['Project Manager', 'Business Analyst', 'Accountant', 'Engineer'],
  },
  {
    id: 'timeline-focused',
    name: 'Timeline Focused',
    description: 'Visual timeline design highlighting career progression. Great for storytelling.',
    category: 'creative',
    suitable_for: ['Career Progression', 'Mid-Senior Level'],
  },
  {
    id: 'portfolio-showcase',
    name: 'Portfolio Showcase',
    description: 'Project-focused design with vibrant gradients. Perfect for showcasing work.',
    category: 'creative',
    suitable_for: ['Designer', 'Developer', 'Artist', 'Photographer'],
  },
  {
    id: 'academic-detailed',
    name: 'Academic Detailed',
    description: 'Traditional academic CV format with publications section. Ideal for research.',
    category: 'traditional',
    suitable_for: ['Researcher', 'Professor', 'PhD', 'Academic'],
  },

  {
    id: 'clean-contemporary',
    name: 'Clean Contemporary',
    description: 'Cyan accent bar with clean lines. Modern professional design.',
    category: 'modern',
    suitable_for: ['Any Role', 'Professional', 'Manager', 'Specialist'],
  },
  {
    id: 'split-accent',
    name: 'Split Accent',
    description: 'Emerald gradient accent strip with clean split layout. Distinctive.',
    category: 'modern',
    suitable_for: ['Any Role', 'Professional', 'Creative', 'Tech'],
  },
];

const renderTemplatePreview = (templateId: string) => {
  const props = { resumeData: sampleResumeData };
  switch (templateId) {
    case 'modern-minimal':
      return <ModernMinimal {...props} />;
    case 'classic-corporate':
      return <ClassicCorporate {...props} />;
    case 'tech-creative':
      return <TechCreative {...props} />;
    case 'executive-professional':
      return <ExecutiveProfessional {...props} />;
    case 'minimalist-professional':
      return <MinimalistProfessional {...props} />;
    case 'bold-modern':
      return <BoldModern {...props} />;
    case 'elegant-serif':
      return <ElegantSerif {...props} />;
    case 'creative-sidebar':
      return <CreativeSidebar {...props} />;
    case 'compact-efficient':
      return <CompactEfficient {...props} />;
    case 'two-column-balanced':
      return <TwoColumnBalanced {...props} />;
    case 'timeline-focused':
      return <TimelineFocused {...props} />;
    case 'portfolio-showcase':
      return <PortfolioShowcase {...props} />;
    case 'academic-detailed':
      return <AcademicDetailed {...props} />;

    case 'clean-contemporary':
      return <CleanContemporary {...props} />;
    case 'split-accent':
      return <SplitAccent {...props} />;
    default:
      return null;
  }
};

export default function TemplateGallery({
  selectedTemplateId,
  onSelectTemplate,
}: TemplateGalleryProps) {
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  return (
    <div className="rb-gallery">
      <div className="rb-gallery-header">
        <h2>Choose Your Template</h2>
        <p>Select a professional template that best fits your industry and experience level.</p>
      </div>

      <div className="rb-gallery-grid">
        {TEMPLATES.map((template) => {
          const selected = selectedTemplateId === template.id;
          const hovered = hoveredTemplate === template.id;

          return (
            <div
              key={template.id}
              className={`rb-template-card ${selected ? 'rb-template-selected' : ''} ${hovered ? 'rb-template-hovered' : ''}`}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              onClick={() => onSelectTemplate(template.id)}
            >
              {/* Preview */}
              <div className="rb-template-preview">
                <div className="rb-template-preview-inner">
                  {renderTemplatePreview(template.id)}
                </div>
                {selected && (
                  <div className="rb-template-check-overlay">
                    <div className="rb-template-check-circle">
                      <CheckIcon style={{ width: '1.25rem', height: '1.25rem', color: '#fff' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="rb-template-info">
                <div className="rb-template-info-row">
                  <h3>{template.name}</h3>
                  <span className="rb-template-badge">{template.category}</span>
                </div>
                <p>{template.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {selectedTemplateId && (
        <div className="rb-template-confirm">
          <CheckIcon style={{ width: '1rem', height: '1rem' }} />
          <span>
            You&apos;ve selected{' '}
            <strong>{TEMPLATES.find((t) => t.id === selectedTemplateId)?.name}</strong>. You can
            change this anytime.
          </span>
        </div>
      )}
    </div>
  );
}
