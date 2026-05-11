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
  const sortIcon = (key) => sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

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
        <span className="card__title">Tasks</span>
        <span className="td-muted">{filtered.length} of {tasks.length}</span>
        <button className="btn btn--primary btn--sm" onClick={onAdd}>+ Add Task</button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search tasks…"
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
            Clear
          </button>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort("title")}>Task{sortIcon("title")}</th>
              <th className="sortable" onClick={() => toggleSort("projectId")}>Project{sortIcon("projectId")}</th>
              <th className="sortable" onClick={() => toggleSort("priority")}>Priority{sortIcon("priority")}</th>
              <th className="sortable" onClick={() => toggleSort("status")}>Status{sortIcon("status")}</th>
              <th className="sortable" onClick={() => toggleSort("dueDate")}>Due Date{sortIcon("dueDate")}</th>
              <th className="sortable" onClick={() => toggleSort("responsible")}>Responsible{sortIcon("responsible")}</th>
              <th>Comment</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="empty-state"><p>No tasks match your filters.</p></td></tr>
            ) : (
              filtered.map((t) => {
                const overdue = isOverdue(t.dueDate, t.status);
                return (
                  <tr key={t.id} className={overdue ? "row--overdue" : ""}>
                    <td><strong>{t.title}</strong></td>
                    <td className="td-muted">{projectMap[t.projectId] || "—"}</td>
                    <td><span className={`badge ${BADGE_CLASS[t.priority] || ""}`}>{t.priority}</span></td>
                    <td><span className={`badge ${BADGE_CLASS[t.status] || ""}`}>{t.status}</span></td>
                    <td className="td-muted">
                      {formatDate(t.dueDate)}
                      {overdue && <span className="badge badge--overdue">Overdue</span>}
                    </td>
                    <td className="td-muted">{t.responsible || "—"}</td>
                    <td className="td-muted" style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.comment || "—"}
                    </td>
                    <td>
                      <div className="td-actions">
                        <button className="btn btn--ghost btn--sm" onClick={() => onEdit(t)}>Edit</button>
                        <button className="btn btn--danger btn--sm" onClick={() => onDelete(t.id)}>Del</button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
