import { formatCurrency, isOverdue } from "../utils.js";

export default function KpiCards({ projects, tasks }) {
  const totalBudget  = projects.reduce((s, p) => s + (p.budget || 0), 0);
  const totalSpent   = projects.reduce((s, p) => s + (p.actualCost || 0), 0);
  const activeCount  = projects.filter((p) => p.status === "Active").length;
  const overdueTasks = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
  const avgProgress  = projects.length
    ? Math.round(projects.reduce((s, p) => s + (p.progress || 0), 0) / projects.length)
    : 0;
  const overBudget   = projects.filter((p) => p.actualCost > p.budget).length;

  const cards = [
    { label: "Total Projects",  value: projects.length,          sub: "all projects",         variant: "" },
    { label: "Active Projects", value: activeCount,              sub: "currently running",    variant: "primary" },
    { label: "Total Tasks",     value: tasks.length,             sub: "across all projects",  variant: "" },
    { label: "Overdue Tasks",   value: overdueTasks,             sub: "past due date",        variant: overdueTasks > 0 ? "danger" : "success" },
    { label: "Total Budget",    value: formatCurrency(totalBudget), sub: "planned spend",     variant: "" },
    { label: "Total Spent",     value: formatCurrency(totalSpent),  sub: "actual cost",       variant: totalSpent > totalBudget ? "danger" : "success" },
    { label: "Avg Progress",    value: `${avgProgress}%`,        sub: "across active projects", variant: "primary" },
    { label: "Over Budget",     value: overBudget,               sub: "projects",             variant: overBudget > 0 ? "warning" : "success" },
  ];

  return (
    <div className="kpi-grid">
      {cards.map((card) => (
        <div key={card.label} className={`kpi-card${card.variant ? ` kpi-card--${card.variant}` : ""}`}>
          <div className="kpi-card__label">{card.label}</div>
          <div className="kpi-card__value">{card.value}</div>
          <div className="kpi-card__sub">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
