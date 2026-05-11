import { formatEUR, calculateBudgetVariance } from "../../bi/biHelpers.js";

const STATUS_BADGE = {
  "Under Budget": "badge--active",
  "On Track":     "badge--in-progress",
  "Over Budget":  "badge--high",
  "Missing Data": "badge--completed",
};

export default function BudgetIntelligence({ projects }) {
  // Aggregate budget KPIs across all projects with valid budget data
  const withBudget  = projects.filter((p) => p.budget > 0);
  const totalPlanned = withBudget.reduce((s, p) => s + p.budget, 0);
  const totalActual  = withBudget.reduce((s, p) => s + (p.actualCost || 0), 0);
  const totalVariance = totalActual - totalPlanned;
  const totalVariancePct = totalPlanned > 0
    ? Math.round((totalVariance / totalPlanned) * 100)
    : null;

  // Find the project with the biggest budget overrun
  const overBudgetProjects = projects
    .map((p) => ({ project: p, ...calculateBudgetVariance(p) }))
    .filter((x) => x.status === "Over Budget")
    .sort((a, b) => (b.variance ?? 0) - (a.variance ?? 0));

  const largestOverrun = overBudgetProjects[0] ?? null;

  // Sort table: Over Budget first, then On Track, then Under Budget, then Missing
  const ORDER = { "Over Budget": 0, "On Track": 1, "Under Budget": 2, "Missing Data": 3 };
  const sorted = [...projects]
    .map((p) => ({ project: p, ...calculateBudgetVariance(p) }))
    .sort((a, b) => (ORDER[a.status] ?? 9) - (ORDER[b.status] ?? 9));

  const kpis = [
    {
      label:   "Total Planned Budget",
      value:   formatEUR(totalPlanned),
      variant: "",
    },
    {
      label:   "Total Actual Cost",
      value:   formatEUR(totalActual),
      variant: totalActual > totalPlanned ? "danger" : "success",
    },
    {
      label:   "Total Variance",
      value:   (totalVariance >= 0 ? "+" : "") + formatEUR(totalVariance),
      sub:     totalVariancePct !== null ? `${totalVariancePct >= 0 ? "+" : ""}${totalVariancePct}% vs plan` : "",
      variant: totalVariance > 0 ? "danger" : totalVariance < 0 ? "success" : "",
    },
    {
      label:   "Over-Budget Projects",
      value:   overBudgetProjects.length,
      variant: overBudgetProjects.length > 0 ? "danger" : "success",
    },
    {
      label:   "Largest Overrun",
      value:   largestOverrun ? formatEUR(largestOverrun.variance) : "None",
      sub:     largestOverrun ? largestOverrun.project.name : "All within budget",
      variant: largestOverrun ? "danger" : "success",
    },
    {
      label:   "Missing Budget Data",
      value:   projects.filter((p) => !p.budget || p.budget <= 0).length,
      variant: "",
    },
  ];

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Budget Intelligence</span>
        <span className="card__count">{projects.length} projects · EUR</span>
      </div>

      {/* Budget KPI strip */}
      <div className="bi-kpi-strip">
        {kpis.map((k) => (
          <div key={k.label} className={`bi-kpi${k.variant ? ` bi-kpi--${k.variant}` : ""}`}>
            <div className="bi-kpi__label">{k.label}</div>
            <div className="bi-kpi__value">{k.value}</div>
            {k.sub && <div className="bi-kpi__sub">{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* Budget detail table */}
      <div className="table-wrap">
        {projects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__title">No project data available</div>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Project</th>
                <th>Owner</th>
                <th>Planned Budget</th>
                <th>Actual Cost</th>
                <th>Variance</th>
                <th>Variance %</th>
                <th>Status</th>
                <th>Responsible</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map(({ project: p, variance, variancePct, status }) => {
                const isOver = status === "Over Budget";
                return (
                  <tr key={p.id} className={isOver ? "row--over-budget" : ""}>
                    <td style={{ fontWeight: 600 }}>{p.name || "—"}</td>
                    <td className="td-muted">{p.client || "—"}</td>
                    <td>{p.budget > 0 ? formatEUR(p.budget) : <span className="td-muted">Missing data</span>}</td>
                    <td style={{ color: isOver ? "var(--danger)" : undefined, fontWeight: isOver ? 600 : undefined }}>
                      {p.actualCost != null ? formatEUR(p.actualCost) : <span className="td-muted">Missing data</span>}
                    </td>
                    <td style={{ color: isOver ? "var(--danger)" : variance < 0 ? "var(--success)" : undefined, fontWeight: 600 }}>
                      {variance !== null
                        ? `${variance >= 0 ? "+" : ""}${formatEUR(variance)}`
                        : <span className="td-muted">—</span>}
                    </td>
                    <td style={{ color: isOver ? "var(--danger)" : variancePct !== null && variancePct < 0 ? "var(--success)" : undefined }}>
                      {variancePct !== null
                        ? `${variancePct >= 0 ? "+" : ""}${Math.round(variancePct)}%`
                        : <span className="td-muted">—</span>}
                    </td>
                    <td>
                      <span className={`badge ${STATUS_BADGE[status] || ""}`}>{status}</span>
                    </td>
                    <td className="td-muted">{p.responsible || "Unassigned"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
