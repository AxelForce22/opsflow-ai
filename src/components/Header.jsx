const TABS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "projects",  label: "Projects" },
  { id: "tasks",     label: "Tasks" },
  { id: "budget",    label: "Budget" },
  { id: "about",     label: "About" },
];

export default function Header({ activeTab, setActiveTab, darkMode, setDarkMode }) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__brand">
          <div className="header__brand-icon">O</div>
          <span className="header__brand-name">
            OpsFlow <span>AI</span>
          </span>
        </div>

        <nav className="header__nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`header__nav-btn${activeTab === tab.id ? " active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="header__actions">
          <button
            className="icon-btn"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}
