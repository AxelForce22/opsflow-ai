import { useState, useEffect } from "react";

const PRIORITIES = ["Low", "Medium", "High"];
const STATUSES   = ["Open", "In Progress", "Done"];

const EMPTY = { title: "", projectId: "", priority: "Medium", status: "Open", dueDate: "", responsible: "", comment: "" };

export default function TaskModal({ task, projects, onSave, onClose }) {
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (task) {
      setForm({ ...task, projectId: task.projectId ?? "" });
    } else {
      setForm(EMPTY);
    }
  }, [task]);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSave({ ...form, projectId: form.projectId ? parseInt(form.projectId) : null });
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal__header">
          <span className="modal__title">{task ? "Edit Task" : "New Task"}</span>
          <button className="icon-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal__body">
            <div className="field">
              <label>Task Title *</label>
              <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Review vendor contracts" required />
            </div>
            <div className="field">
              <label>Project</label>
              <select value={form.projectId} onChange={(e) => set("projectId", e.target.value)}>
                <option value="">— No project —</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="field-row">
              <div className="field">
                <label>Priority</label>
                <select value={form.priority} onChange={(e) => set("priority", e.target.value)}>
                  {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
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
                <label>Due Date</label>
                <input type="date" value={form.dueDate} onChange={(e) => set("dueDate", e.target.value)} />
              </div>
              <div className="field">
                <label>Responsible</label>
                <input value={form.responsible} onChange={(e) => set("responsible", e.target.value)} placeholder="Name" />
              </div>
            </div>
            <div className="field">
              <label>Comment</label>
              <textarea value={form.comment} onChange={(e) => set("comment", e.target.value)} placeholder="Any notes on this task..." />
            </div>
          </div>
          <div className="modal__footer">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
}
