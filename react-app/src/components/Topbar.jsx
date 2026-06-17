import { useState } from "react";

const VIEWS = ["spiral", "grid", "table"];

export default function Topbar({ search, onSearch, view, onView, onRefresh, refreshing, total, onMenu, compareCount, onComparePage, page, onDropCompare, dragging }) {
  const activeIdx = VIEWS.indexOf(view);
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
  const handleDragLeave = () => setDragOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const id = Number(e.dataTransfer.getData("univId"));
    if (id) onDropCompare(id);
  };

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
      <div className="view-toggle">
        <span className="view-slider" style={{ transform: `translateX(${activeIdx * 100}%)` }} />
        <button className={`view-btn ${page !== "compare" && view === "spiral" ? "active" : ""}`} onClick={() => onView("spiral")}>✲ Spiral</button>
        <button className={`view-btn ${page !== "compare" && view === "grid" ? "active" : ""}`} onClick={() => onView("grid")}>⊞ Grid</button>
        <button className={`view-btn ${page !== "compare" && view === "table" ? "active" : ""}`} onClick={() => onView("table")}>≡ Table</button>
      </div>

      <div className="topbar-right">
        {/* Compare drop zone */}
        <div
          className={`compare-dropzone${compareCount > 0 ? " dz-has-items" : ""}${dragging ? " dz-dragging" : ""}${dragOver ? " dz-drag-over" : ""}${page === "compare" ? " dz-active-page" : ""}`}
          onClick={onComparePage}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          title="Drag a university card here to compare · Click to open compare page"
        >
          <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <rect x="1.5" y="2.5" width="7" height="17" rx="1.5" />
            <rect x="13.5" y="2.5" width="7" height="17" rx="1.5" />
            <line x1="5" y1="7" x2="5" y2="7" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="17" y1="7" x2="17" y2="7" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          {compareCount > 0 && <span className="dz-badge">{compareCount}</span>}
          <span className="dz-label">{dragOver ? "Drop!" : "Compare"}</span>
        </div>

        <button className={`btn-refresh ${refreshing ? "spinning" : ""}`} onClick={onRefresh} disabled={refreshing}>
          <span className="ri">↻</span> <span>{refreshing ? "Refreshing..." : "Refresh data"}</span>
        </button>
      </div>
    </div>
  );
}
