import { formatCurrency } from "../utils.js";

export default function BudgetAnalysis({ projects }) {
  const totalBudget = projects.reduce((s, p) => s + (p.budget || 0), 0);
  const totalSpent  = projects.reduce((s, p) => s + (p.actualCost || 0), 0);
  const totalDiff   = totalBudget - totalSpent;

  const sorted = [...projects].sort((a, b) => {
    const aOver = (a.actualCost || 0) - (a.budget || 0);
    const bOver = (b.actualCost || 0) - (b.budget || 0);
    return bOver - aOver;
  });

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Budget Analysis</span>
        <span className="td-muted">{projects.length} projects</span>
      </div>

      <div className="budget-summary">
        <div className="budget-stat">
          <div className="budget-stat__label">Total Budget</div>
          <div className="budget-stat__value">{formatCurrency(totalBudget)}</div>
        </div>
        <div className="budget-stat">
          <div className="budget-stat__label">Total Spent</div>
          <div className={`budget-stat__value${totalSpent > totalBudget ? " budget-stat__value--danger" : " budget-stat__value--success"}`}>
            {formatCurrency(totalSpent)}
          </div>
        </div>
        <div className="budget-stat">
          <div className="budget-stat__label">{totalDiff >= 0 ? "Remaining" : "Over Budget"}</div>
          <div className={`budget-stat__value${totalDiff < 0 ? " budget-stat__value--danger" : " budget-stat__value--success"}`}>
            {formatCurrency(Math.abs(totalDiff))}
          </div>
        </div>
        <div className="budget-stat">
          <div className="budget-stat__label">Over-Budget Projects</div>
          <div className={`budget-stat__value${projects.filter((p) => p.actualCost > p.budget).length > 0 ? " budget-stat__value--danger" : " budget-stat__value--success"}`}>
            {projects.filter((p) => p.actualCost > p.budget).length}
          </div>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Category</th>
              <th>Budget</th>
              <th>Actual Cost</th>
              <th>Variance</th>
              <th>% Used</th>
              <th>Spend</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((p) => {
              const diff    = (p.actualCost || 0) - (p.budget || 0);
              const pct     = p.budget > 0 ? Math.round(((p.actualCost || 0) / p.budget) * 100) : 0;
              const isOver  = diff > 0;

              return (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong><div className="td-muted">{p.status}</div></td>
                  <td className="td-muted">{p.category}</td>
                  <td>{formatCurrency(p.budget)}</td>
                  <td style={{ color: isOver ? "var(--danger)" : undefined, fontWeight: isOver ? 600 : undefined }}>
                    {formatCurrency(p.actualCost)}
                  </td>
                  <td style={{ color: isOver ? "var(--danger)" : "var(--success)", fontWeight: 600 }}>
                    {isOver ? "+" : ""}{formatCurrency(diff)}
                  </td>
                  <td className="td-muted">{pct}%</td>
                  <td className="budget-bar-col">
                    <div className="budget-bar">
                      <div
                        className={`budget-bar__fill${isOver ? " budget-bar__fill--over" : ""}`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
