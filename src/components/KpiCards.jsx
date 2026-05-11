import { formatCurrency, isOverdue } from "../utils.js";

export default function KpiCards({ projects, tasks }) {
  // --- Calculate each KPI ---

  const totalProjects  = projects.length;

  const activeProjects = projects.filter((p) => p.status === "Active").length;

  const overdueTasks   = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;

  // Budget variance: positive = under budget (good), negative = over budget (bad)
  const totalBudget    = projects.reduce((s, p) => s + (p.budget     || 0), 0);
  const totalSpent     = projects.reduce((s, p) => s + (p.actualCost || 0), 0);
  const variance       = totalBudget - totalSpent;

  // Completion rate: percentage of tasks marked "Done"
  const doneTasks      = tasks.filter((t) => t.status === "Done").length;
  const completionRate = tasks.length > 0 ? Math.round((doneTasks / tasks.length) * 100) : 0;

  // High priority tasks that are not yet done
  const highPriorityOpen = tasks.filter(
    (t) => t.priority === "High" && t.status !== "Done"
  ).length;

  // Build the 6 card definitions
  const cards = [
    {
      label:   "Total Projects",
      value:   totalProjects,
      sub:     `${activeProjects} active`,
      variant: "primary",
    },
    {
      label:   "Active Projects",
      value:   activeProjects,
      sub:     "currently running",
      variant: "success",
    },
    {
      label:   "Overdue Tasks",
      value:   overdueTasks,
      sub:     overdueTasks === 0 ? "all on track" : "past due date",
      variant: overdueTasks > 0 ? "danger" : "success",
    },
    {
      label:   "Budget Variance",
      value:   (variance >= 0 ? "+" : "") + formatCurrency(variance),
      sub:     variance >= 0 ? "under budget" : "over budget",
      variant: variance >= 0 ? "success" : "danger",
    },
    {
      label:   "Completion Rate",
      value:   `${completionRate}%`,
      sub:     `${doneTasks} of ${tasks.length} tasks done`,
      variant: completionRate >= 75 ? "success" : completionRate >= 40 ? "warning" : "primary",
    },
    {
      label:   "High Priority",
      value:   highPriorityOpen,
      sub:     "open high-priority tasks",
      variant: highPriorityOpen > 3 ? "danger" : highPriorityOpen > 0 ? "warning" : "success",
    },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`kpi-card${card.variant ? ` kpi-card--${card.variant}` : ""}`}
        >
          <div className="kpi-card__label">{card.label}</div>
          <div className="kpi-card__value">{card.value}</div>
          <div className="kpi-card__sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
