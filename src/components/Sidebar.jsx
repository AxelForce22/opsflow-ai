import { isOverdue } from "../utils.js";

// Nav items with a simple icon character and which tab they link to
const NAV_ITEMS = [
  { id: "dashboard",  label: "Dashboard",          icon: "◈",  section: "Overview" },
  { id: "bi",         label: "Business Intelligence", icon: "◎", section: "Overview" },
  { id: "projects",   label: "Projects",            icon: "▤",  section: "Manage" },
  { id: "tasks",      label: "Tasks",               icon: "✓",  section: "Manage" },
  { id: "budget",     label: "Budget",              icon: "$",  section: "Manage" },
  { id: "activity",   label: "Activity Log",        icon: "≡",  section: "Manage" },
  { id: "about",      label: "About",               icon: "ⓘ",  section: "Other" },
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
        {/* Group nav items by section label */}
        {["Overview", "Manage", "Other"].map((section) => {
          const items = NAV_ITEMS.filter((n) => n.section === section);
          return (
            <div key={section}>
              <span className="sidebar__section-label">{section}</span>
              {items.map((item) => (
                <button
                  key={item.id}
                  className={`sidebar__item${activeTab === item.id ? " active" : ""}`}
                  onClick={() => handleClick(item.id)}
                >
                  <span className="sidebar__icon">{item.icon}</span>
                  {item.label}
                  {/* Overdue count bubble on the Tasks item */}
                  {item.id === "tasks" && overdueCount > 0 && (
                    <span className="sidebar__count">{overdueCount}</span>
                  )}
                </button>
              ))}
            </div>
          );
        })}
      </aside>
    </>
  );
}
