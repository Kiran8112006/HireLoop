'use client';

import React, { useState, useEffect } from 'react';
import {
  FileTextIcon,
  ArrowLeftIcon,
  XIcon,
  DownloadIcon,
  CheckIcon,
  EyeIcon,
  SparklesIcon,
  Building2Icon,
} from 'lucide-react';
import { type StructuredResume } from '@/lib/resume-types';
import TemplateGallery from '@/components/template-gallery';
import PersonalInfoForm from '@/components/forms/personal-info-form';
import ExperienceForm from '@/components/forms/experience-form';
import EducationForm from '@/components/forms/education-form';
import SkillsForm from '@/components/forms/skills-form';
import OptionalSectionsForm from '@/components/forms/optional-sections-form';
import FormNavigation from '@/components/forms/form-navigation';

/* ── Template imports ── */
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

export default function ResumeBuilderPage() {
  /* ── State ── */
  const [startMode, setStartMode] = useState<
    'choice' | 'template-select' | 'building' | 'final'
  >('choice');
  const [resumeData, setResumeData] = useState<StructuredResume | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern-minimal');
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [basicErrors, setBasicErrors] = useState<Record<number, string[]>>({});
  const [showPreview, setShowPreview] = useState(false);

  /* ── Validation ── */
  useEffect(() => {
    if (startMode !== 'building' || !resumeData) return;
    const errors: string[] = [];
    const step = currentStep;

    if (step === 0) {
      const p = resumeData.personal;
      if (!p.full_name?.trim()) errors.push('Full name is required');
      if (!p.email?.trim()) errors.push('Email is required');
      if (!p.phone?.trim()) errors.push('Phone is required');
      if (!p.location?.trim()) errors.push('Location is required');
      if (!p.summary?.trim() || p.summary.length < 50)
        errors.push('Summary must be at least 50 characters');
    } else if (step === 1) {
      resumeData.experience.forEach((exp, i) => {
        if (!exp.position?.trim()) errors.push(`Experience #${i + 1}: position required`);
        if (!exp.company?.trim()) errors.push(`Experience #${i + 1}: company required`);
        if (!exp.location?.trim()) errors.push(`Experience #${i + 1}: location required`);
        if (!exp.start_date?.trim()) errors.push(`Experience #${i + 1}: start date required`);
        if (!exp.end_date?.trim()) errors.push(`Experience #${i + 1}: end date required`);
      });
    } else if (step === 3) {
      if (!resumeData.skills.technical.length) errors.push('Add at least one technical skill');
    } else if (step === 4) {
      resumeData.projects.forEach((p, i) => {
        if (!p.name?.trim()) errors.push(`Project #${i + 1}: name required`);
      });
      resumeData.certifications.forEach((c, i) => {
        if (!c.name?.trim()) errors.push(`Certification #${i + 1}: name required`);
      });
    }

    setBasicErrors((prev) => ({ ...prev, [step]: errors }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    startMode,
    currentStep,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(resumeData?.personal),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(resumeData?.experience),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(resumeData?.education),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(resumeData?.skills),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(resumeData?.projects),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(resumeData?.certifications),
  ]);

  /* ── Handlers ── */
  const handleStartFromScratch = () => {
    setResumeData({
      personal: {
        full_name: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
      },
      experience: [],
      education: [],
      skills: { technical: [], soft: [], tools: [], languages: [] },
      certifications: [],
      projects: [],
      awards: [],
    });
    setStartMode('template-select');
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleProceedToEditing = () => {
    setStartMode('building');
  };

  /* ── Template renderer ── */
  const renderTemplatePreview = () => {
    if (!resumeData) return null;
    switch (selectedTemplate) {
      case 'modern-minimal':
        return <ModernMinimal resumeData={resumeData} />;
      case 'classic-corporate':
        return <ClassicCorporate resumeData={resumeData} />;
      case 'tech-creative':
        return <TechCreative resumeData={resumeData} />;
      case 'executive-professional':
        return <ExecutiveProfessional resumeData={resumeData} />;
      case 'minimalist-professional':
        return <MinimalistProfessional resumeData={resumeData} />;
      case 'bold-modern':
        return <BoldModern resumeData={resumeData} />;
      case 'elegant-serif':
        return <ElegantSerif resumeData={resumeData} />;
      case 'creative-sidebar':
        return <CreativeSidebar resumeData={resumeData} />;
      case 'compact-efficient':
        return <CompactEfficient resumeData={resumeData} />;
      case 'two-column-balanced':
        return <TwoColumnBalanced resumeData={resumeData} />;
      case 'timeline-focused':
        return <TimelineFocused resumeData={resumeData} />;
      case 'portfolio-showcase':
        return <PortfolioShowcase resumeData={resumeData} />;
      case 'academic-detailed':
        return <AcademicDetailed resumeData={resumeData} />;

      case 'clean-contemporary':
        return <CleanContemporary resumeData={resumeData} />;
      case 'split-accent':
        return <SplitAccent resumeData={resumeData} />;
      default:
        return <ModernMinimal resumeData={resumeData} />;
    }
  };

  /* ── Export handler (browser print) ── */
  const handleExportPDF = () => {
    const el = document.getElementById('resume-preview');
    if (!el) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Resume</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@4/dist/tailwind.min.css" rel="stylesheet">
      <style>@page{margin:0;size:A4}body{margin:0}</style>
      </head><body>${el.innerHTML}</body></html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print();
      printWindow.close();
    };
  };

  /* ════════════════════════════════════════════ */
  /*  SCREEN: Choice                              */
  /* ════════════════════════════════════════════ */
  if (startMode === 'choice') {
    return (
      <main className="rb-page">
        {/* Top bar */}
        <header className="rb-topbar">
          <a href="/" className="rb-brand-link">
            <div className="landing-brand-mark">
              <Building2Icon className="landing-brand-icon" />
            </div>
            <span className="landing-brand-name">HireLoop</span>
          </a>
        </header>

        <div className="rb-hero-center">
          <div className="rb-hero-icon-wrap">
            <FileTextIcon style={{ width: '2rem', height: '2rem', color: '#fff' }} />
          </div>
          <h1 className="rb-hero-title">Resume Builder</h1>
          <p className="rb-hero-subtitle">
            Create a professional resume step by step with our guided form and 15 beautiful templates.
          </p>

          <div className="rb-choice-card" onClick={handleStartFromScratch}>
            <div className="rb-choice-icon">
              <FileTextIcon style={{ width: '1.4rem', height: '1.4rem' }} />
            </div>
            <div>
              <h2>Start from Scratch</h2>
              <p>Build your resume step by step with our guided form editor.</p>
            </div>
          </div>

          {/* Features */}
          <div className="rb-feature-row">
            {[
              { icon: EyeIcon, text: 'Live Preview' },
              { icon: FileTextIcon, text: '15 Templates' },
              { icon: DownloadIcon, text: 'PDF Export' },
              { icon: SparklesIcon, text: 'Smart Validation' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="rb-feature-pill">
                <Icon style={{ width: '1rem', height: '1rem' }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  /* ════════════════════════════════════════════ */
  /*  SCREEN: Template Selection                  */
  /* ════════════════════════════════════════════ */
  if (startMode === 'template-select') {
    return (
      <main className="rb-page rb-page-padded">
        <div className="rb-container-wide">
          <button
            type="button"
            className="rb-back-btn"
            onClick={() => setStartMode('choice')}
          >
            <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
            Back
          </button>

          <div className="rb-center-heading">
            <h1>Choose Your Resume Template</h1>
            <p>Select from 15 professional templates to give your resume the perfect look.</p>
          </div>

          <div className="rb-gallery-wrapper">
            <TemplateGallery
              selectedTemplateId={selectedTemplate}
              onSelectTemplate={handleTemplateSelect}
            />

            {selectedTemplate && (
              <div className="rb-gallery-continue">
                <button
                  type="button"
                  className="rb-primary-btn rb-btn-lg"
                  onClick={handleProceedToEditing}
                >
                  Continue to Editor
                  <span style={{ marginLeft: '0.5rem' }}>→</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  }

  /* ════════════════════════════════════════════ */
  /*  SCREEN: Building (Editor)                   */
  /* ════════════════════════════════════════════ */
  if (startMode === 'building') {
    if (!resumeData) return null;

    const totalSteps = 5;
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === totalSteps - 1;
    const canProceed = (): boolean => (basicErrors[currentStep] || []).length === 0;

    const handleNext = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (isLastStep) {
        setStartMode('final');
      } else {
        const next = currentStep + 1;
        setCurrentStep(next);
        setVisitedSteps((prev) => new Set([...prev, next]));
      }
    };

    const handlePrevious = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const prev = currentStep - 1;
      setCurrentStep(prev);
      setVisitedSteps((p) => new Set([...p, prev]));
    };

    const handleStepClick = (step: number) => {
      if (visitedSteps.has(step)) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setCurrentStep(step);
      }
    };

    return (
      <main className="rb-page rb-page-padded">
        <div className="rb-container-wide">
          {/* Header */}
          <div className="rb-editor-header">
            <button
              type="button"
              className="rb-back-btn"
              onClick={() => {
                setStartMode('template-select');
                setCurrentStep(0);
              }}
            >
              <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
              Back to Templates
            </button>

            <div className="rb-editor-title">
              <h1>Build Your Resume</h1>
              <p>
                Using{' '}
                {selectedTemplate
                  .split('-')
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')}{' '}
                template
              </p>
            </div>

            <div style={{ width: '140px' }} />
          </div>

          {/* Split view */}
          <div className="rb-split">
            {/* Left: Form */}
            <div className="rb-form-panel">
              <FormNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onPreview={() => setShowPreview(true)}
                onStepClick={handleStepClick}
                visitedSteps={visitedSteps}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                canProceed={canProceed()}
                basicErrors={basicErrors[currentStep] || []}
              />

              <div className="rb-divider" />

              {currentStep === 0 && (
                <PersonalInfoForm
                  data={resumeData.personal}
                  onChange={(d) => setResumeData({ ...resumeData, personal: d })}
                />
              )}
              {currentStep === 1 && (
                <ExperienceForm
                  data={resumeData.experience}
                  onChange={(d) =>
                    setResumeData({
                      ...resumeData,
                      experience: JSON.parse(JSON.stringify(d)),
                    })
                  }
                />
              )}
              {currentStep === 2 && (
                <EducationForm
                  data={resumeData.education}
                  onChange={(d) => setResumeData({ ...resumeData, education: d })}
                />
              )}
              {currentStep === 3 && (
                <SkillsForm
                  data={resumeData.skills}
                  onChange={(d) => setResumeData({ ...resumeData, skills: d })}
                />
              )}
              {currentStep === 4 && (
                <OptionalSectionsForm
                  certifications={resumeData.certifications}
                  projects={resumeData.projects}
                  awards={resumeData.awards}
                  onCertificationsChange={(d) =>
                    setResumeData({ ...resumeData, certifications: d })
                  }
                  onProjectsChange={(d) => setResumeData({ ...resumeData, projects: d })}
                  onAwardsChange={(d) => setResumeData({ ...resumeData, awards: d })}
                />
              )}

              <FormNavigation
                currentStep={currentStep}
                totalSteps={totalSteps}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onPreview={() => setShowPreview(true)}
                onStepClick={handleStepClick}
                visitedSteps={visitedSteps}
                isFirstStep={isFirstStep}
                isLastStep={isLastStep}
                canProceed={canProceed()}
                showBottomNavigation
                basicErrors={basicErrors[currentStep] || []}
              />
            </div>

            {/* Right: Live Preview */}
            <div className="rb-preview-panel">
              <div className="rb-preview-header">
                <h3>Live Preview</h3>
                <button
                  type="button"
                  className="rb-small-btn"
                  onClick={() => setStartMode('template-select')}
                >
                  Change Template
                </button>
              </div>
              <div className="rb-preview-body">
                {renderTemplatePreview()}
              </div>
            </div>
          </div>
        </div>

        {/* Full Preview Modal */}
        {showPreview && (
          <div className="rb-modal-overlay">
            <div className="rb-modal rb-modal-preview">
              <button
                type="button"
                className="rb-modal-close"
                onClick={() => setShowPreview(false)}
              >
                <XIcon style={{ width: '1rem', height: '1rem' }} />
              </button>
              <div className="rb-modal-body">{renderTemplatePreview()}</div>
            </div>
          </div>
        )}
      </main>
    );
  }

  /* ════════════════════════════════════════════ */
  /*  SCREEN: Final Review                        */
  /* ════════════════════════════════════════════ */
  if (startMode === 'final') {
    if (!resumeData) return null;

    return (
      <main className="rb-page rb-page-padded">
        <div className="rb-container">
          <div className="rb-center-heading">
            <h1>Final Review</h1>
            <p>Review your resume one last time before exporting.</p>
          </div>

          <div className="rb-final-layout">
            {/* Actions */}
            <div className="rb-final-sidebar">
              <div className="rb-card">
                <h3>Export</h3>
                <button
                  type="button"
                  className="rb-primary-btn full-width"
                  onClick={handleExportPDF}
                >
                  <DownloadIcon style={{ width: '1rem', height: '1rem' }} />
                  Print / Save PDF
                </button>
                <p className="rb-helper-text">
                  Opens the browser print dialog. Choose &quot;Save as PDF&quot; to download.
                </p>
              </div>

              <button
                type="button"
                className="rb-back-btn"
                onClick={() => setStartMode('building')}
              >
                <ArrowLeftIcon style={{ width: '1rem', height: '1rem' }} />
                Back to Editing
              </button>
            </div>

            {/* Preview */}
            <div className="rb-final-preview">
              <div id="resume-preview" className="rb-resume-sheet">
                {renderTemplatePreview()}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return null;
}
