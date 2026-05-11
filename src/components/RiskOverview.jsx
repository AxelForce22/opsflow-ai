import { getProjectHealth } from "../utils.js";

// Maps a health status string to a CSS badge class
const HEALTH_BADGE = {
  Healthy:   "badge--healthy",
  "At Risk": "badge--at-risk",
  Critical:  "badge--critical",
};

// Maps a health status to the card's left-border CSS class
const CARD_CLASS = {
  "At Risk": "risk-card--at-risk",
  Critical:  "risk-card--critical",
};

export default function RiskOverview({ projects, tasks }) {
  // Calculate health for every project, then keep only the unhealthy ones
  const riskyProjects = projects
    .map((p) => ({ project: p, health: getProjectHealth(p, tasks) }))
    .filter(({ health }) => health.status !== "Healthy")
    // Show Critical before At Risk
    .sort((a, b) => {
      const order = { Critical: 0, "At Risk": 1 };
      return order[a.health.status] - order[b.health.status];
    });

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Risk Overview</span>
        <span className="card__count">{riskyProjects.length} project{riskyProjects.length !== 1 ? "s" : ""} flagged</span>
      </div>

      {riskyProjects.length === 0 ? (
        // All projects are healthy — show a positive empty state
        <div className="empty-state">
          <div className="empty-state__icon">✅</div>
          <div className="empty-state__title">All projects are healthy</div>
          <p>No risk factors detected across your portfolio.</p>
        </div>
      ) : (
        <div className="risk-grid">
          {riskyProjects.map(({ project, health }) => (
            <div
              key={project.id}
              className={`risk-card ${CARD_CLASS[health.status] || ""}`}
            >
              {/* Project name + health badge */}
              <div className="risk-card__header">
                <span className="risk-card__name">{project.name}</span>
                <span className={`badge ${HEALTH_BADGE[health.status]}`}>
                  {health.status}
                </span>
              </div>

              {/* Project meta info */}
              <div className="risk-card__meta">
                {project.category} · {project.responsible || "—"}
              </div>

              {/* List of reasons explaining why this project is flagged */}
              <ul className="risk-reasons">
                {health.reasons.map((reason, i) => (
                  <li key={i} className="risk-reason">
                    <span
                      className={`risk-reason__dot risk-reason__dot--${
                        reason.level === "Critical" ? "critical" : "at-risk"
                      }`}
                    />
                    {reason.text}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
