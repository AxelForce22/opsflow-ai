// No biHelpers imports needed here — all filtering logic lives in BIDashboard.jsx

const STATUS_OPTIONS      = ["All", "Planning", "Active", "Blocked", "Completed"];
const RISK_OPTIONS        = ["All", "Healthy", "At Risk", "Critical"];
const BUDGET_OPTIONS      = ["All", "Under Budget", "On Track", "Over Budget", "Missing Data"];
const TIME_OPTIONS        = [
  { value: "All",     label: "All Deadlines" },
  { value: "Overdue", label: "Overdue only" },
  { value: "7days",   label: "Due within 7 days" },
  { value: "30days",  label: "Due within 30 days" },
];

export default function BiFilters({ projects, tasks, filters, setFilters, filteredCount }) {
  // Build unique lists for Category and Responsible from the full project list
  const categories  = ["All", ...new Set(projects.map((p) => p.category).filter(Boolean))].sort();
  const responsible = ["All", ...new Set(projects.map((p) => p.responsible).filter(Boolean))].sort();

  function set(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const isFiltered = Object.values(filters).some((v) => v !== "All");

  return (
    <div className="card bi-filters-card">
      <div className="card__header">
        <span className="card__title">BI Filters</span>
        {isFiltered && (
          <span className="badge badge--medium">Filtered view</span>
        )}
        <span className="card__count">
          {filteredCount.projects} project{filteredCount.projects !== 1 ? "s" : ""} ·{" "}
          {filteredCount.tasks} task{filteredCount.tasks !== 1 ? "s" : ""}
        </span>
        {isFiltered && (
          <button
            className="btn btn--ghost btn--sm"
            onClick={() => setFilters({ status: "All", category: "All", responsible: "All", riskLevel: "All", budgetStatus: "All", timePeriod: "All" })}
          >
            Reset filters
          </button>
        )}
      </div>

      <div className="bi-filter-bar">
        <div className="bi-filter-group">
          <label className="bi-filter-label">Status</label>
          <select className="filter-select" value={filters.status} onChange={(e) => set("status", e.target.value)}>
            {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>

        <div className="bi-filter-group">
          <label className="bi-filter-label">Category</label>
          <select className="filter-select" value={filters.category} onChange={(e) => set("category", e.target.value)}>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="bi-filter-group">
          <label className="bi-filter-label">Responsible</label>
          <select className="filter-select" value={filters.responsible} onChange={(e) => set("responsible", e.target.value)}>
            {responsible.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className="bi-filter-group">
          <label className="bi-filter-label">Risk Level</label>
          <select className="filter-select" value={filters.riskLevel} onChange={(e) => set("riskLevel", e.target.value)}>
            {RISK_OPTIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className="bi-filter-group">
          <label className="bi-filter-label">Budget Status</label>
          <select className="filter-select" value={filters.budgetStatus} onChange={(e) => set("budgetStatus", e.target.value)}>
            {BUDGET_OPTIONS.map((b) => <option key={b}>{b}</option>)}
          </select>
        </div>

        <div className="bi-filter-group">
          <label className="bi-filter-label">Timeline</label>
          <select className="filter-select" value={filters.timePeriod} onChange={(e) => set("timePeriod", e.target.value)}>
            {TIME_OPTIONS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
