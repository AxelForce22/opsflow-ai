import { formatDate } from "../utils.js";

export default function ActivityLog({ activities }) {
  const sorted = [...activities].sort((a, b) => new Date(b.datetime) - new Date(a.datetime));

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Recent Activity</span>
        <span className="td-muted">{activities.length} events</span>
      </div>
      <div className="card__body">
        {sorted.length === 0 ? (
          <div className="empty-state"><p>No activity yet.</p></div>
        ) : (
          <ul className="activity-list">
            {sorted.map((item) => (
              <li key={item.id} className="activity-item">
                <div className="activity-dot" />
                <div>
                  <div className="activity-message">{item.message}</div>
                  <div className="activity-time">
                    {formatDate(item.datetime.split("T")[0])}{" "}
                    &middot;{" "}
                    {item.datetime.split("T")[1]?.slice(0, 5)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
