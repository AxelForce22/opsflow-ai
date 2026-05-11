import { useState, useEffect } from "react";

const CATEGORIES = ["Real Estate", "Operations", "Sales Operations", "Vendor Management", "Finance", "HR", "IT", "Other"];
const STATUSES   = ["Planning", "Active", "Blocked", "Completed"];

const EMPTY = {
  name: "", client: "", category: "Operations", status: "Planning",
  startDate: "", deadline: "", responsible: "", budget: "", actualCost: "", progress: 0, notes: "",
};

export default function ProjectModal({ project, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (project) {
      setForm({ ...project, budget: project.budget ?? "", actualCost: project.actualCost ?? "" });
    } else {
      setForm(EMPTY);
    }
  }, [project]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave({
      ...form,
      budget:     parseFloat(form.budget)     || 0,
      actualCost: parseFloat(form.actualCost) || 0,
      progress:   parseInt(form.progress)     || 0,
    });
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal__header">
          <span className="modal__title">{project ? "Edit Project" : "New Project"}</span>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div className="field">
              <label>Project Name *</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Office Fit-Out Q3" required />
            </div>
            <div className="field-row">
              <div className="field">
                <label>Client / Owner</label>
                <input value={form.client} onChange={(e) => set("client", e.target.value)} placeholder="Client name" />
              </div>
              <div className="field">
                <label>Responsible</label>
                <input value={form.responsible} onChange={(e) => set("responsible", e.target.value)} placeholder="Name" />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Status</label>
                <select value={form.status} onChange={(e) => set("status", e.target.value)}>
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Start Date</label>
                <input type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
              </div>
              <div className="field">
                <label>Deadline</label>
                <input type="date" value={form.deadline} onChange={(e) => set("deadline", e.target.value)} />
              </div>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Budget ($)</label>
                <input type="number" min="0" value={form.budget} onChange={(e) => set("budget", e.target.value)} placeholder="0" />
              </div>
              <div className="field">
                <label>Actual Cost ($)</label>
                <input type="number" min="0" value={form.actualCost} onChange={(e) => set("actualCost", e.target.value)} placeholder="0" />
              </div>
            </div>
            <div className="field">
              <label>Progress ({form.progress}%)</label>
              <input type="range" min="0" max="100" value={form.progress} onChange={(e) => set("progress", e.target.value)} />
            </div>
            <div className="field">
              <label>Notes</label>
              <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Any relevant notes..." />
            </div>
          </div>
          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">Save Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}
