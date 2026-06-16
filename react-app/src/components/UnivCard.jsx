import { tierBadgeClass, tierLabel, admitMid } from "../data/universities";

export default function UnivCard({ u, onOpen, onToggleStar, onToggleCmp }) {
  return (
    <div className={`univ-card ${u.starred ? "starred-card" : ""}`} onClick={() => onOpen(u.id)}>
      <div className="card-actions">
        <button
          className={`star-btn ${u.starred ? "on" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggleStar(u.id); }}
          title={u.starred ? "Unstar" : "Star"}
        >
          {u.starred ? "★" : "☆"}
        </button>
        <button
          className={`cmp-btn ${u.cmp ? "on" : ""}`}
          onClick={(e) => { e.stopPropagation(); onToggleCmp(u.id); }}
          title="Compare"
        >
          ⟷
        </button>
      </div>
      <div className="card-header">
        <div>
          <div className="card-name">{u.name}</div>
          <div className="card-loc">📍 {u.loc}</div>
        </div>
        <span className={`tier-badge ${tierBadgeClass(u.tier)}`}>{tierLabel(u.tier)}</span>
      </div>
      <div className="card-tags">
        {u.gre === "not" && <span className="tag tag-nogre">No GRE</span>}
        {u.gre === "optional" && <span className="tag tag-optgre">GRE optional</span>}
        {u.gre === "required" && <span className="tag tag-reqgre">GRE required</span>}
        {u.ft.includes("waiver") && <span className="tag tag-waiver">Tuition waiver</span>}
        {u.ft.includes("fellowship") && <span className="tag tag-fellowship">Fellowship</span>}
        {u.starred && <span className="tag tag-starred">★ Starred</span>}
      </div>
      <div className="card-grid">
        <div className="cg-item"><div className="cg-lbl">Tuition/yr</div><div className="cg-val">{u.ts.split(" ")[0]}</div></div>
        <div className="cg-item"><div className="cg-lbl">Admit rate</div><div className="cg-val">{u.as}</div></div>
        <div className="cg-item"><div className="cg-lbl">Fall deadline</div><div className="cg-val">{u.deadline}</div></div>
        <div className="cg-item"><div className="cg-lbl">App fee</div><div className="cg-val">${u.appFee}</div></div>
      </div>
      <div className="admit-bar"><div className="admit-fill" style={{ width: `${Math.min(admitMid(u), 100)}%` }} /></div>
    </div>
  );
}
