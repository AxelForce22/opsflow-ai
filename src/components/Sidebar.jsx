import { isOverdue } from "../utils.js";

// Nav items with a simple icon character and which tab they link to
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",   icon: "◈" },
  { id: "projects",  label: "Projects",    icon: "▤" },
  { id: "tasks",     label: "Tasks",       icon: "✓" },
  { id: "budget",    label: "Budget",      icon: "$" },
  { id: "activity",  label: "Activity Log",icon: "≡" },
  { id: "about",     label: "About",       icon: "ⓘ" },
];

export default function Sidebar({ activeTab, setActiveTab, tasks, isOpen, onClose }) {
  // Count overdue tasks for the badge on the Tasks nav item
  const overdueCount = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;

  function handleClick(id) {
    setActiveTab(id);
    onClose(); // close mobile sidebar after navigating
  }

  return (
    <>
      {/* Dark overlay shown behind sidebar on mobile */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar${isOpen ? " sidebar--open" : ""}`}>
        <span className="sidebar__section-label">Navigation</span>

        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar__item${activeTab === item.id ? " active" : ""}`}
            onClick={() => handleClick(item.id)}
          >
            <span className="sidebar__icon">{item.icon}</span>
            {item.label}
            {/* Show overdue count bubble only on the Tasks item */}
            {item.id === "tasks" && overdueCount > 0 && (
              <span className="sidebar__count">{overdueCount}</span>
            )}
          </button>
        ))}
      </aside>
    </>
  );
}
