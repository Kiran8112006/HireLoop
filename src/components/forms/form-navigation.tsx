'use client';

import {
  UserIcon,
  BriefcaseIcon,
  GraduationCapIcon,
  WrenchIcon,
  FolderPlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  EyeIcon,
} from 'lucide-react';

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onPreview: () => void;
  onStepClick: (step: number) => void;
  visitedSteps: Set<number>;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  basicErrors?: string[];
  showBottomNavigation?: boolean;
}

const STEP_META = [
  { label: 'Personal', icon: UserIcon },
  { label: 'Experience', icon: BriefcaseIcon },
  { label: 'Education', icon: GraduationCapIcon },
  { label: 'Skills', icon: WrenchIcon },
  { label: 'Optional', icon: FolderPlusIcon },
];

export default function FormNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onPreview,
  onStepClick,
  visitedSteps,
  isFirstStep,
  isLastStep,
  canProceed,
  basicErrors = [],
  showBottomNavigation,
}: FormNavigationProps) {
  if (showBottomNavigation) {
    return (
      <div className="rb-nav-bottom">
        <button
          type="button"
          className="rb-nav-btn"
          onClick={onPrevious}
          disabled={isFirstStep}
        >
          <ChevronLeftIcon style={{ width: '1rem', height: '1rem' }} />
          Previous
        </button>

        <button type="button" className="rb-nav-btn rb-nav-preview" onClick={onPreview}>
          <EyeIcon style={{ width: '1rem', height: '1rem' }} />
          Full Preview
        </button>

        <button
          type="button"
          className={`rb-nav-btn rb-nav-next ${isLastStep ? 'rb-nav-finish' : ''}`}
          onClick={onNext}
          disabled={!canProceed}
        >
          {isLastStep ? 'Finish' : 'Next'}
          {isLastStep ? (
            <CheckIcon style={{ width: '1rem', height: '1rem' }} />
          ) : (
            <ChevronRightIcon style={{ width: '1rem', height: '1rem' }} />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="rb-nav">
      {/* Step indicators */}
      <div className="rb-steps">
        {STEP_META.slice(0, totalSteps).map((step, idx) => {
          const Icon = step.icon;
          const visited = visitedSteps.has(idx);
          const active = idx === currentStep;
          const completed = visited && idx < currentStep;

          return (
            <button
              key={idx}
              type="button"
              className={`rb-step ${active ? 'rb-step-active' : ''} ${completed ? 'rb-step-completed' : ''} ${visited ? 'rb-step-visited' : ''}`}
              onClick={() => onStepClick(idx)}
              disabled={!visited}
              title={step.label}
            >
              <span className="rb-step-icon">
                {completed ? (
                  <CheckIcon style={{ width: '0.85rem', height: '0.85rem' }} />
                ) : (
                  <Icon style={{ width: '0.85rem', height: '0.85rem' }} />
                )}
              </span>
              <span className="rb-step-label">{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="rb-progress-track">
        <div
          className="rb-progress-fill"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>

      {/* Errors */}
      {basicErrors.length > 0 && (
        <div className="rb-errors">
          {basicErrors.map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
        </div>
      )}
    </div>
  );
}
