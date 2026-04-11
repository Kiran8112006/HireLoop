import { Building2Icon, BriefcaseIcon, SearchIcon, ShieldCheckIcon, SparklesIcon, ArrowRightIcon } from "lucide-react";

const highlights = [
  {
    icon: SearchIcon,
    title: "Student profiles",
    description:
      "Review skills, projects, transcripts and eligibility in a unified profile. Students can add resumes, links and portfolios so recruiters can quickly evaluate fit.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Placement workflow",
    description:
      "Track applications, interviews, rounds, feedback and approvals in one organized workflow. Schedule interviews, capture outcomes and notify students automatically.",
  },
  {
    icon: BriefcaseIcon,
    title: "College hiring",
    description:
      "Designed for recruiters, students and placement teams to coordinate drives, shortlist candidates, manage offers and archive outcomes with audit trails.",
  },
];

export default function HomePage() {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <header className="landing-topbar">
          <div className="landing-brand">
            <div className="landing-brand-mark">
              <Building2Icon className="landing-brand-icon" />
            </div>
            <div>
              <p className="landing-brand-name">HireLoop</p>
            </div>
          </div>
          <div className="landing-actions">
            <a href="/auth" className="landing-access-btn ui-btn ui-btn-outline ui-btn-lg">
              Access the portal
              <ArrowRightIcon className="landing-access-icon" />
            </a>
          </div>
        </header>

        <div className="landing-grid">
          <div className="landing-copy">
            <span className="landing-pill">
              <SparklesIcon className="landing-pill-icon" />
              College hiring workspace
            </span>
            <h1 className="landing-headline">Connect students, recruiters and the placement team.</h1>
            <p>HireLoop helps the college manage internship drives, student applications and placement workflows with a polished hiring experience.</p>
            
            <div className="landing-panel-stack landing-mini-inline">
              <div className="landing-mini-card">
                <span className="landing-mini-label">For students</span>
                <strong>Profile, apply, track status</strong>
                <p>Keep one updated profile and follow every application from a single dashboard.</p>
              </div>

              <div className="landing-mini-card">
                <span className="landing-mini-label">For recruiters</span>
                <strong>Shortlist faster</strong>
                <p>Review student information, filter eligibility, and move candidates through rounds.</p>
              </div>

              <div className="landing-mini-card">
                <span className="landing-mini-label">For placement team</span>
                <strong>Coordinate the drive</strong>
                <p>Manage approvals, schedules, and outcomes without switching tools.</p>
              </div>
            </div>
          </div>

          <aside className="landing-panel">
            <div className="landing-panel-stack">
              {highlights.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="landing-feature-group">
                    <div className="landing-feature-card">
                      <div className="landing-feature-icon-wrap">
                        <Icon className="landing-feature-icon" />
                      </div>
                      <div className="landing-feature-content">
                        <h2>{feature.title}</h2>
                        <p>{feature.description}</p>
                      </div>
                    </div>
                    {idx < highlights.length - 1 && <div className="feature-divider" />}
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      {/* features moved into the right panel */}
    </main>
  );
}
