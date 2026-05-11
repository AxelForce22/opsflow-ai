import { useState } from "react";
import { formatCurrency, formatDate, BADGE_CLASS } from "../utils.js";

const STATUS_OPTIONS   = ["All", "Planning", "Active", "Blocked", "Completed"];
const CATEGORY_OPTIONS = ["All", "Real Estate", "Operations", "Sales Operations", "Vendor Management", "Finance", "HR", "IT", "Other"];

export default function ProjectTable({ projects, onAdd, onEdit, onDelete }) {
  const [search,   setSearch]   = useState("");
  const [statusF,  setStatusF]  = useState("All");
  const [catF,     setCatF]     = useState("All");
  const [sortKey,  setSortKey]  = useState("name");
  const [sortDir,  setSortDir]  = useState("asc");

  function toggleSort(key) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("asc"); }
  }

  const sortIcon = (key) => sortKey === key ? (sortDir === "asc" ? " ▲" : " ▼") : "";

  const filtered = projects
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        (statusF === "All" || p.status === statusF) &&
        (catF    === "All" || p.category === catF) &&
        (!q || p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.responsible.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      let av = a[sortKey] ?? "";
      let bv = b[sortKey] ?? "";
      if (typeof av === "string") av = av.toLowerCase();
      if (typeof bv === "string") bv = bv.toLowerCase();
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  return (
    <div className="card">
      <div className="card__header">
        <span className="card__title">Projects</span>
        <span className="td-muted">{filtered.length} of {projects.length}</span>
        <button className="btn btn--primary btn--sm" onClick={onAdd}>+ Add Project</button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search projects…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="filter-select" value={statusF} onChange={(e) => setStatusF(e.target.value)}>
          {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={catF} onChange={(e) => setCatF(e.target.value)}>
          {CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}
        </select>
        {(search || statusF !== "All" || catF !== "All") && (
          <button className="btn btn--ghost btn--sm" onClick={() => { setSearch(""); setStatusF("All"); setCatF("All"); }}>
            Clear
          </button>
        )}
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="sortable" onClick={() => toggleSort("name")}>Name{sortIcon("name")}</th>
              <th className="sortable" onClick={() => toggleSort("client")}>Client{sortIcon("client")}</th>
              <th className="sortable" onClick={() => toggleSort("status")}>Status{sortIcon("status")}</th>
              <th className="sortable" onClick={() => toggleSort("category")}>Category{sortIcon("category")}</th>
              <th className="sortable" onClick={() => toggleSort("deadline")}>Deadline{sortIcon("deadline")}</th>
              <th className="sortable" onClick={() => toggleSort("responsible")}>Responsible{sortIcon("responsible")}</th>
              <th className="sortable" onClick={() => toggleSort("budget")}>Budget{sortIcon("budget")}</th>
              <th className="sortable" onClick={() => toggleSort("progress")}>Progress{sortIcon("progress")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} className="empty-state"><p>No projects match your filters.</p></td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    {p.notes && <div className="td-muted" style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.notes}</div>}
                  </td>
                  <td className="td-muted">{p.client}</td>
                  <td><span className={`badge ${BADGE_CLASS[p.status] || ""}`}>{p.status}</span></td>
                  <td className="td-muted">{p.category}</td>
                  <td className="td-muted">{formatDate(p.deadline)}</td>
                  <td className="td-muted">{p.responsible}</td>
                  <td>
                    <div>{formatCurrency(p.budget)}</div>
                    <div className="td-muted" style={{ color: p.actualCost > p.budget ? "var(--danger)" : undefined }}>
                      {formatCurrency(p.actualCost)} actual
                    </div>
                  </td>
                  <td>
                    <div className="progress-wrap">
                      <div className="progress-bar">
                        <div
                          className={`progress-bar__fill${p.progress >= 100 ? " progress-bar__fill--success" : ""}`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="progress-label">{p.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="td-actions">
                      <button className="btn btn--ghost btn--sm" onClick={() => onEdit(p)}>Edit</button>
                      <button className="btn btn--danger btn--sm" onClick={() => onDelete(p.id)}>Del</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
