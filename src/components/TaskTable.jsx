import { useState } from "react";
import { formatDate, isOverdue, BADGE_CLASS } from "../utils.js";

const STATUS_OPTIONS   = ["All", "Open", "In Progress", "Done"];
const PRIORITY_OPTIONS = ["All", "High", "Medium", "Low"];

export default function TaskTable({ tasks, projects, onAdd, onEdit, onDelete }) {
  const [search,   setSearch]   = useState("");
  const [statusF,  setStatusF]  = useState("All");
  const [prioF,    setPrioF]    = useState("All");
  const [projectF, setProjectF] = useState("All");
  const [sortKey,  setSortKey]  = useState("dueDate");
  const [sortDir,  setSortDir]  = useState("asc");

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }
  const arrow = (key) => sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  // Build a lookup: project id → project name
  const projectMap = Object.fromEntries(projects.map((p) => [p.id, p.name]));

  const filtered = tasks
    .filter((t) => {
      const q = search.toLowerCase();
      return (
        (statusF   === "All" || t.status   === statusF) &&
        (prioF     === "All" || t.priority === prioF) &&
        (projectF  === "All" || String(t.projectId) === projectF) &&
        (!q || t.title.toLowerCase().includes(q) || (t.responsible || "").toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      let av = a[sortKey] ?? "";
      let bv = b[sortKey] ?? "";
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  const hasFilters = search || statusF !== "All" || prioF !== "All" || projectF !== "All";

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">All Tasks</span>
        <span className="card__count">{filtered.length} / {tasks.length}</span>
        <button className="btn btn--primary btn--sm" onClick={onAdd}>+ New Task</button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search by title or owner…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="filter-select" value={statusF} onChange={(e) => setStatusF(e.target.value)}>
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={prioF} onChange={(e) => setPrioF(e.target.value)}>
          {PRIORITY_OPTIONS.map((p) => <option key={p}>{p}</option>)}
        </select>
        <select className="filter-select" value={projectF} onChange={(e) => setProjectF(e.target.value)}>
          <option value="All">All Projects</option>
          {projects.map((p) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
        </select>
        {hasFilters && (
          <button className="btn btn--ghost btn--sm" onClick={() => { setSearch(""); setStatusF("All"); setPrioF("All"); setProjectF("All"); }}>
            Clear filters
          </button>
        )}
      </div>

      <div className="table-wrap">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__icon">✅</div>
            <div className="empty-state__title">No tasks found</div>
            <p>Try adjusting your filters, or add a new task.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => toggleSort("title")}>Task{arrow("title")}</th>
                <th className="sortable" onClick={() => toggleSort("projectId")}>Project{arrow("projectId")}</th>
                <th className="sortable" onClick={() => toggleSort("priority")}>Priority{arrow("priority")}</th>
                <th className="sortable" onClick={() => toggleSort("status")}>Status{arrow("status")}</th>
                <th className="sortable" onClick={() => toggleSort("dueDate")}>Due Date{arrow("dueDate")}</th>
                <th className="sortable" onClick={() => toggleSort("responsible")}>Owner{arrow("responsible")}</th>
                <th>Comment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const overdue = isOverdue(t.dueDate, t.status);
                return (
                  <tr key={t.id} className={overdue ? "row--overdue" : ""}>
                    <td><span style={{ fontWeight: 600 }}>{t.title}</span></td>
                    <td className="td-muted">{projectMap[t.projectId] || "—"}</td>
                    <td><span className={`badge ${BADGE_CLASS[t.priority] || ""}`}>{t.priority}</span></td>
                    <td><span className={`badge ${BADGE_CLASS[t.status] || ""}`}>{t.status}</span></td>
                    <td className="td-muted">
                      {formatDate(t.dueDate)}
                      {overdue && <span className="badge badge--overdue">Overdue</span>}
                    </td>
                    <td className="td-muted">{t.responsible || "—"}</td>
                    <td
                      className="td-muted"
                      style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                    >
                      {t.comment || "—"}
                    </td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn--ghost btn--sm" onClick={() => onEdit(t)}>Edit</button>
                        <button className="btn btn--danger btn--sm" onClick={() => onDelete(t.id)}>Delete</button>
                      </div>
                    </td>
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
