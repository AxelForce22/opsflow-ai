export default function Header({ darkMode, setDarkMode, onMenuToggle }) {
  return (
    <header className="header">
      <div className="header__inner">
        {/* Hamburger button — only visible on mobile */}
        <button
          className="header__hamburger"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* Brand block */}
        <div className="header__brand">
          <div className="header__brand-icon">Op</div>
          <div className="header__brand-text">
            <div className="header__brand-name">OpsFlow <span>AI</span></div>
            <div className="header__brand-sub">Operations Management Dashboard</div>
          </div>
        </div>

        <div className="header__spacer" />

        <div className="header__actions">
          <span className="header__badge">Portfolio Project</span>
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
