export default function AboutSection() {
  const skills = [
    "Project Management", "Operations Strategy", "Process Improvement",
    "Vendor Management", "Budget Control", "Cross-functional Leadership",
    "Lean / Six Sigma", "CRM Systems", "Data Analysis", "Stakeholder Management",
  ];

  return (
    <div className="page">
      <div className="page__title">About OpsFlow AI</div>
      <div className="page__subtitle">Operations Management Portfolio — Demo Dashboard</div>

      <div className="about-grid">
        <div className="about-card">
          <h3>About This Dashboard</h3>
          <p>
            OpsFlow AI is a professional operations management portfolio dashboard
            designed to demonstrate real-world project tracking, budget analysis,
            and task management capabilities.
          </p>
          <p>
            This demo uses realistic sample data across four business domains:
            Real Estate, Operations, Sales, and Vendor Management. All data is
            stored locally in your browser.
          </p>
        </div>

        <div className="about-card">
          <h3>Core Features</h3>
          <p>
            Full project and task CRUD with status tracking, budget vs actual
            analysis with over-budget alerts, overdue task detection, KPI dashboard
            with live metrics, dark mode, and activity logging.
          </p>
          <p>
            Built with React + Vite, CSS custom properties for theming, and
            localStorage for persistence — no backend required.
          </p>
        </div>

        <div className="about-card">
          <h3>Skills Demonstrated</h3>
          <div className="skills-list">
            {skills.map((s) => (
              <span key={s} className="skill-tag">{s}</span>
            ))}
          </div>
        </div>

        <div className="about-card">
          <h3>How to Use</h3>
          <p>
            Navigate using the tabs at the top. The <strong>Dashboard</strong> gives
            a live overview. <strong>Projects</strong> and <strong>Tasks</strong> let
            you add, edit, filter and delete records. <strong>Budget</strong> shows
            financial health at a glance.
          </p>
          <p>
            All changes are saved automatically to your browser&apos;s localStorage
            and persist across page refreshes.
          </p>
        </div>
      </div>
    </div>
  );
}
