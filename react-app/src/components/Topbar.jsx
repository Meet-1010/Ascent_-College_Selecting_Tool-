export default function Topbar({ search, onSearch, view, onView, onRefresh, refreshing, total, onMenu }) {
  return (
    <div className="topbar">
      <button className="menu-btn" onClick={onMenu} aria-label="Toggle filters">☰</button>
      <div className="topbar-brand">
        <svg viewBox="0 0 64 64" className="brand-mark">
          <rect x="6" y="38" width="13" height="20" rx="3" fill="currentColor" opacity=".55" />
          <rect x="25.5" y="26" width="13" height="32" rx="3" fill="currentColor" opacity=".8" />
          <rect x="45" y="12" width="13" height="46" rx="3" fill="#CFA94B" />
        </svg>
        <span className="brand-word">Ascent.</span>
        <span className="topbar-sub">{total} universities · 2026 verified data</span>
      </div>
      <div className="topbar-search">
        <span className="si">🔍</span>
        <input
          type="text"
          placeholder="Search university, city, state..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="topbar-right">
        <div className="view-toggle">
          <button className={`view-btn ${view === "spiral" ? "active" : ""}`} onClick={() => onView("spiral")}>✲ Spiral</button>
          <button className={`view-btn ${view === "grid" ? "active" : ""}`} onClick={() => onView("grid")}>⊞ Grid</button>
          <button className={`view-btn ${view === "table" ? "active" : ""}`} onClick={() => onView("table")}>≡ Table</button>
        </div>
        <button className={`btn-refresh ${refreshing ? "spinning" : ""}`} onClick={onRefresh} disabled={refreshing}>
          <span className="ri">↻</span> <span>{refreshing ? "Refreshing..." : "Refresh data"}</span>
        </button>
      </div>
    </div>
  );
}
