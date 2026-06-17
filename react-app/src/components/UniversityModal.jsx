import { tierBadgeClass, tierLabel } from "../data/universities";
import { PinIcon } from "./Icons";

export default function UniversityModal({ u, onClose, onToggleStar, onToggleCmp }) {
  if (!u) return null;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4, paddingRight: 38 }}>
        <div>
          <div className="modal-title">{u.name}</div>
          <div className="modal-sub">
            <PinIcon size={11} style={{ marginRight: 4, opacity: 0.7, verticalAlign: "middle", display: "inline-block" }} />{u.loc} &nbsp;·&nbsp; <span className={`tier-badge ${tierBadgeClass(u.tier)}`}>{tierLabel(u.tier)}</span>
          </div>
        </div>
        <button
          className="star-toggle-modal"
          style={{ color: u.starred ? "#D97706" : "#94A3B8" }}
          onClick={() => onToggleStar(u.id)}
        >
          {u.starred ? "★" : "☆"}
        </button>
      </div>

      <div className="modal-sec">
        <div className="modal-sec-hdr">Admission details — 2026 verified</div>
        <div className="detail-grid">
          <div className="di"><div className="di-label">Rank (TFE/US News)</div><div className="di-val">#{u.rank}</div></div>
          <div className="di"><div className="di-label">Annual tuition (intl)</div><div className="di-val">{u.ts}</div></div>
          <div className="di"><div className="di-label">GRE requirement</div><div className="di-val">{u.gres}</div></div>
          <div className="di"><div className="di-label">IELTS minimum</div><div className="di-val">{u.ielts}</div></div>
          <div className="di"><div className="di-label">TOEFL minimum</div><div className="di-val">{u.toefl}</div></div>
          <div className="di"><div className="di-label">Fall deadline</div><div className="di-val">{u.deadline}</div></div>
          <div className="di"><div className="di-label">Application fee</div><div className="di-val">${u.appFee}</div></div>
          <div className="di"><div className="di-label">Admit rate (intl MS)</div><div className="di-val">{u.as}</div></div>
        </div>
      </div>

      <div className="modal-sec">
        <div className="modal-sec-hdr">Programs available</div>
        <div className="fund-box">{u.program}</div>
      </div>

      <div className="modal-sec">
        <div className="modal-sec-hdr">Funding structure</div>
        <div className="fund-box" style={{ marginBottom: 8 }}>{u.funding}</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {u.ft.map((f) => <span key={f} className="tag" style={{ fontSize: 11 }}>{f.toUpperCase()}</span>)}
        </div>
      </div>

      <div className="modal-sec">
        <div className="modal-sec-hdr">Key strengths</div>
        <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.6 }}>{u.strengths}</div>
      </div>

      <div className="modal-sec">
        <div className="modal-sec-hdr">Counselor note for your profile</div>
        <div className="note-box">{u.note}</div>
      </div>

      <div className="modal-actions">
        <a href={u.url} target="_blank" rel="noreferrer" className="mbtn primary">🌐 Official website</a>
        <button className="mbtn" onClick={() => { onToggleCmp(u.id); onClose(); }}>⟷ Add to compare</button>
        <button className="mbtn" onClick={() => onToggleStar(u.id)}>★ {u.starred ? "Unstar" : "Star"}</button>
      </div>
    </div>
  );
}
