import { calculateProjectRisk } from "../bi/biHelpers.js";

const HEALTH_BADGE = {
  Healthy:   "badge--healthy",
  "At Risk": "badge--at-risk",
  Critical:  "badge--critical",
};

const CARD_CLASS = {
  "At Risk": "risk-card--at-risk",
  Critical:  "risk-card--critical",
};

export default function RiskOverview({ projects, tasks }) {
  // Calculate health for every project, keep only the unhealthy ones
  const riskyProjects = projects
    .map((p) => ({ project: p, risk: calculateProjectRisk(p, tasks) }))
    .filter(({ risk }) => risk.status !== "Healthy")
    .sort((a, b) => b.risk.score - a.risk.score); // highest score first

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Risk Overview</span>
        <span className="card__count">{riskyProjects.length} project{riskyProjects.length !== 1 ? "s" : ""} flagged</span>
      </div>

      {riskyProjects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">✓</div>
          <div className="empty-state__title">All projects are healthy</div>
          <p>No risk factors detected across your portfolio.</p>
        </div>
      ) : (
        <div className="risk-grid">
          {riskyProjects.map(({ project, risk }) => (
            <div key={project.id} className={`risk-card ${CARD_CLASS[risk.status] || ""}`}>

              {/* Project name + health badge */}
              <div className="risk-card__header">
                <span className="risk-card__name">{project.name}</span>
                <span className={`badge ${HEALTH_BADGE[risk.status]}`}>{risk.status}</span>
              </div>

              {/* Score + meta info */}
              <div className="risk-card__meta">
                Risk score: <strong>{risk.score}</strong> · {project.category} · {project.responsible || "Unassigned"}
              </div>

              {/* Reasons why this project was flagged */}
              <ul className="risk-reasons">
                {risk.reasons.map((reason, i) => (
                  <li key={i} className="risk-reason">
                    <span className={`risk-reason__dot risk-reason__dot--${reason.points >= 2 ? "critical" : "at-risk"}`} />
                    {reason.text}
                  </li>
                ))}
              </ul>

              {/* Suggested action */}
              <div className="risk-card__action">{risk.action}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
