import { STATES } from "../data/universities";
import { EliteStarIcon, TargetIcon } from "./Icons";

const TIERS = [
  { key: "ALL", cls: "tc-all", label: "All universities" },
  { key: "ELITE", cls: "tc-elite", label: "Elite — Top 10", icon: <EliteStarIcon size={11} style={{ marginRight: 4, verticalAlign: "middle", display: "inline-block" }} /> },
  { key: "TIER2", cls: "tc-t2", label: "Tier 2 — Research" },
  { key: "TIER3", cls: "tc-t3", label: "Tier 3 — Strong" },
  { key: "TIER4", cls: "tc-t4", label: "Tier 4 — Accessible" },
  { key: "TIER5", cls: "tc-t5", label: "Tier 5 — Safety" },
];

export default function Sidebar({ open, onClose, filters, setFilters, counts, onClearAll, onApplyProfile, profile, onEditProfile, fontSize, onFontSize }) {
  const update = (key, value) => setFilters((f) => ({ ...f, [key]: value }));

  return (
    <>
      <div className={`sidebar-overlay ${open ? "open" : ""}`} onClick={onClose} />
      <div className={`sidebar ${open ? "open" : ""}`}>
        <div className="sidebar-section">
          <div className="sidebar-title">Tier</div>
          <div className="tier-chips">
            {TIERS.map((t) => (
              <div
                key={t.key}
                className={`tier-chip ${t.cls} ${!filters.starredOnly && filters.tier === t.key ? "active" : ""}`}
                onClick={() => setFilters((f) => ({ ...f, tier: t.key, starredOnly: false }))}
              >
                {t.icon}{t.label} <span className="chip-count">{t.key === "ALL" ? counts.all : counts[t.key] || 0}</span>
              </div>
            ))}
            <div
              className={`tier-chip tc-star ${filters.starredOnly ? "active" : ""}`}
              onClick={() => setFilters((f) => ({ ...f, starredOnly: !f.starredOnly, tier: "ALL" }))}
            >
              ★ Starred only <span className="chip-count">{counts.starred}</span>
            </div>
          </div>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">Filters</div>
          <div className="filter-group">
            <label className="filter-label">GRE requirement</label>
            <select value={filters.gre} onChange={(e) => update("gre", e.target.value)}>
              <option value="">All</option>
              <option value="not">Not required</option>
              <option value="optional">Optional</option>
              <option value="required">Required</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Annual tuition</label>
            <select value={filters.tuition} onChange={(e) => update("tuition", e.target.value)}>
              <option value="">Any budget</option>
              <option value="0-10000">Under $10k</option>
              <option value="10000-15000">$10k – $15k</option>
              <option value="15000-25000">$15k – $25k</option>
              <option value="25000-40000">$25k – $40k</option>
              <option value="40000-999999">Above $40k</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Admit rate</label>
            <select value={filters.admit} onChange={(e) => update("admit", e.target.value)}>
              <option value="">Any</option>
              <option value="high">&gt; 65% (easy)</option>
              <option value="med">30–65% (medium)</option>
              <option value="low">&lt; 30% (competitive)</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Funding type</label>
            <select value={filters.fund} onChange={(e) => update("fund", e.target.value)}>
              <option value="">Any</option>
              <option value="ra">RA available</option>
              <option value="ta">TA available</option>
              <option value="waiver">Tuition waiver</option>
              <option value="fellowship">Fellowship</option>
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">State</label>
            <select value={filters.state} onChange={(e) => update("state", e.target.value)}>
              <option value="">All states</option>
              {STATES.map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-group">
            <label className="filter-label">Sort by</label>
            <select value={filters.sort} onChange={(e) => update("sort", e.target.value)}>
              <option value="rank">Ranking (best first)</option>
              <option value="tuition_asc">Tuition (low → high)</option>
              <option value="tuition_desc">Tuition (high → low)</option>
              <option value="admit_desc">Admit % (highest first)</option>
              <option value="admit_asc">Admit % (lowest first)</option>
              <option value="name">Name A → Z</option>
              <option value="starred">Starred first</option>
              <option value="fee_asc">App fee (low → high)</option>
              <option value="deadline">Deadline (earliest first)</option>
            </select>
          </div>
          <button className="btn-sm" onClick={onClearAll} style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>
            ✕ Clear all filters
          </button>
        </div>

        <div className="sidebar-section">
          <div className="sidebar-title">Text size</div>
          <div className="font-size-row">
            <span className="font-size-a-sm">A</span>
            <input
              type="range"
              min={100}
              max={150}
              step={5}
              value={fontSize}
              onChange={(e) => onFontSize(Number(e.target.value))}
              className="font-size-slider"
            />
            <span className="font-size-a-lg">A</span>
          </div>
          <div className="font-size-label">{fontSize === 100 ? "Default" : `${fontSize}%`}</div>
          {fontSize !== 100 && (
            <button className="btn-sm" onClick={() => onFontSize(100)} style={{ marginTop: 4, fontSize: 11 }}>
              Reset to default
            </button>
          )}
        </div>

        <div className="sidebar-section">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div className="sidebar-title" style={{ marginBottom: 0 }}>Your profile match</div>
            <button className="btn-sm" style={{ padding: "3px 8px" }} onClick={onEditProfile} title="Edit profile">✎ Edit</button>
          </div>
          <div style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6, marginTop: 8 }}>
            GRE target: <b>{profile.greTarget}</b><br />IELTS target: <b>{profile.ieltsTarget}</b><br />CGPA: <b>{profile.cgpa}</b><br />
            Key project: <b>{profile.keyProject}</b><br />{profile.locationLabel}: <b>{profile.location}</b>
          </div>
          <button className="btn-sm" style={{ width: "100%", justifyContent: "center", marginTop: 8 }} onClick={onApplyProfile}>
            <TargetIcon size={13} style={{ marginRight: 5, verticalAlign: "middle", display: "inline-block" }} /> Filter for my profile
          </button>
        </div>
      </div>
    </>
  );
}
