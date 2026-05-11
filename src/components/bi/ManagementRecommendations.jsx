import { generateRecommendations } from "../../bi/biHelpers.js";

const PRIORITY_BADGE = {
  High:   "badge--high",
  Medium: "badge--medium",
  Low:    "badge--low",
};

export default function ManagementRecommendations({ projects, tasks }) {
  const recs = generateRecommendations(projects, tasks);

  // Only show High and Medium by default — Low just clutters the view
  const actionable = recs.filter((r) => r.priority !== "Low");
  const lowCount   = recs.length - actionable.length;

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Management Recommendations</span>
        <span className="card__count">{actionable.length} action item{actionable.length !== 1 ? "s" : ""}</span>
      </div>

      {actionable.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">✓</div>
          <div className="empty-state__title">No critical recommendations at the moment</div>
          <p>
            All tracked projects appear to be on track.
            {lowCount > 0 && ` ${lowCount} project${lowCount > 1 ? "s" : ""} in standard monitoring.`}
          </p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Priority</th>
                <th>Project</th>
                <th>Issue Detected</th>
                <th>Recommended Action</th>
                <th>Owner</th>
                <th>Reason</th>
              </tr>
            </thead>
            <tbody>
              {actionable.map((rec, i) => (
                <tr key={i}>
                  <td>
                    <span className={`badge ${PRIORITY_BADGE[rec.priority] || ""}`}>
                      {rec.priority}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{rec.project}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{rec.issue}</td>
                  <td style={{ minWidth: 200 }}>{rec.action}</td>
                  <td className="td-muted" style={{ whiteSpace: "nowrap" }}>{rec.responsible}</td>
                  <td className="td-muted" style={{ minWidth: 180, fontSize: 11 }}>{rec.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {lowCount > 0 && actionable.length > 0 && (
        <div style={{ padding: "10px 20px", borderTop: "1px solid var(--border)", fontSize: 12, color: "var(--text-muted)" }}>
          + {lowCount} project{lowCount > 1 ? "s" : ""} in standard monitoring (no action required)
        </div>
      )}
    </div>
  );
}
