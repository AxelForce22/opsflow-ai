import { generateExecutiveInsights } from "../../bi/biHelpers.js";

// Icon style mapping — maps the icon character to a colour class
const ICON_COLOR = {
  "◈": "insight-icon--blue",
  "▲": "insight-icon--red",
  "↑": "insight-icon--red",
  "↓": "insight-icon--green",
  "✓": "insight-icon--green",
  "!": "insight-icon--orange",
  "◷": "insight-icon--orange",
  "◎": "insight-icon--blue",
  "ℹ": "insight-icon--blue",
};

export default function ExecutiveSummary({ projects, tasks }) {
  const insights = generateExecutiveInsights(projects, tasks);

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Executive Summary</span>
        <span className="card__count">{insights.length} insights</span>
      </div>
      <div className="insight-list">
        {insights.map((item, i) => (
          <div key={i} className="insight-item">
            {/* Coloured icon indicator */}
            <span className={`insight-icon ${ICON_COLOR[item.icon] || "insight-icon--blue"}`}>
              {item.icon}
            </span>
            <span className="insight-text">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
