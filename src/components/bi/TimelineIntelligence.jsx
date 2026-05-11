import { safeDate, getDaysUntilDeadline, getTimelineStatus } from "../../bi/biHelpers.js";
import { formatDate } from "../../utils.js";

const STATUS_BADGE = {
  Overdue:      "badge--high",
  "Due Soon":   "badge--medium",
  Upcoming:     "badge--planning",
  "On Track":   "badge--active",
  "No Deadline":"badge--completed",
  Completed:    "badge--done",
};

export default function TimelineIntelligence({ projects, tasks }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // ---- Project timeline analysis ----
  const overdueProjects    = projects.filter((p) => getTimelineStatus(p) === "Overdue");
  const dueSoonProjects    = projects.filter((p) => getTimelineStatus(p) === "Due Soon");
  const upcomingProjects   = projects.filter((p) => getTimelineStatus(p) === "Upcoming");

  // ---- Task timeline analysis ----
  const overdueTasks = tasks.filter((t) => {
    if (t.status === "Done") return false;
    const due = safeDate(t.dueDate);
    return due && due < today;
  });
  const overdueHighPrio = overdueTasks.filter((t) => t.priority === "High");

  // ---- Build unified urgent timeline list ----
  // Combine overdue and due-soon projects + overdue tasks into one sortable list
  const urgentItems = [];

  projects
    .filter((p) => p.status !== "Completed")
    .forEach((p) => {
      const tStatus = getTimelineStatus(p);
      if (!["Overdue", "Due Soon", "Upcoming"].includes(tStatus)) return;
      const days = getDaysUntilDeadline(p.deadline);
      urgentItems.push({
        type:        "Project",
        title:       p.name,
        responsible: p.responsible || "Unassigned",
        date:        p.deadline,
        daysLeft:    days,
        status:      p.status,
        riskLevel:   tStatus,
      });
    });

  overdueTasks.forEach((t) => {
    const days = getDaysUntilDeadline(t.dueDate);
    urgentItems.push({
      type:        "Task",
      title:       t.title,
      responsible: t.responsible || "Unassigned",
      date:        t.dueDate,
      daysLeft:    days,
      status:      t.status,
      riskLevel:   "Overdue",
    });
  });

  // Sort: most overdue (most negative) first, then due soon, then upcoming
  urgentItems.sort((a, b) => {
    if (a.daysLeft === null) return 1;
    if (b.daysLeft === null) return -1;
    return a.daysLeft - b.daysLeft;
  });

  const kpis = [
    { label: "Overdue Projects",       value: overdueProjects.length,   variant: overdueProjects.length > 0 ? "danger" : "success" },
    { label: "Due Within 7 Days",      value: dueSoonProjects.length,   variant: dueSoonProjects.length > 0 ? "warning" : "" },
    { label: "Due Within 30 Days",     value: upcomingProjects.length,  variant: "" },
    { label: "Overdue Tasks",          value: overdueTasks.length,      variant: overdueTasks.length > 0 ? "danger" : "success" },
    { label: "Overdue High-Priority",  value: overdueHighPrio.length,   variant: overdueHighPrio.length > 0 ? "danger" : "success" },
  ];

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Timeline Intelligence</span>
        <span className="card__count">{urgentItems.length} urgent item{urgentItems.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Timeline KPI strip */}
      <div className="bi-kpi-strip">
        {kpis.map((k) => (
          <div key={k.label} className={`bi-kpi${k.variant ? ` bi-kpi--${k.variant}` : ""}`}>
            <div className="bi-kpi__label">{k.label}</div>
            <div className="bi-kpi__value">{k.value}</div>
          </div>
        ))}
      </div>

      {/* Urgent items table */}
      {urgentItems.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">◎</div>
          <div className="empty-state__title">No urgent timeline items</div>
          <p>All projects and tasks are within safe deadlines.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Due Date</th>
                <th>Days</th>
                <th>Responsible</th>
                <th>Status</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {urgentItems.map((item, i) => {
                const daysLabel = item.daysLeft === null
                  ? "No date"
                  : item.daysLeft < 0
                    ? `${Math.abs(item.daysLeft)}d overdue`
                    : item.daysLeft === 0
                      ? "Due today"
                      : `${item.daysLeft}d left`;

                return (
                  <tr key={i} className={item.daysLeft !== null && item.daysLeft < 0 ? "row--overdue" : ""}>
                    <td>
                      <span className={`badge ${item.type === "Project" ? "badge--in-progress" : "badge--open"}`}>
                        {item.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.title}</td>
                    <td className="td-muted">{formatDate(item.date)}</td>
                    <td style={{
                      fontWeight: 600,
                      color: item.daysLeft !== null && item.daysLeft < 0
                        ? "var(--danger)"
                        : item.daysLeft !== null && item.daysLeft <= 7
                          ? "var(--warning)"
                          : undefined,
                    }}>
                      {daysLabel}
                    </td>
                    <td className="td-muted">{item.responsible}</td>
                    <td className="td-muted">{item.status}</td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[item.riskLevel] || ""}`}>
                        {item.riskLevel}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
