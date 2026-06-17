import { useState } from "react";
import { tierBadgeClass, tierLabel, admitMid } from "../data/universities";

function DraggableRow({ u, onOpen, onToggleStar, onToggleCmp, onDragStart, onDragEnd }) {
  const [dragging, setDragging] = useState(false);
  return (
    <tr
      draggable
      className={dragging ? "is-dragging" : ""}
      onDragStart={(e) => { e.dataTransfer.setData("univId", u.id); e.dataTransfer.effectAllowed = "copy"; setDragging(true); onDragStart?.(); }}
      onDragEnd={() => { setDragging(false); onDragEnd?.(); }}
    >
      <td>
        <button
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: u.starred ? "#D97706" : "#94A3B8" }}
          onClick={() => onToggleStar(u.id)}
        >
          {u.starred ? "★" : "☆"}
        </button>
      </td>
      <td>
        <div className="td-name" onClick={() => onOpen(u.id)}>{u.name}</div>
        <div className="td-sub">{u.short}</div>
      </td>
      <td style={{ fontSize: 11, color: "#475569" }}>{u.loc}</td>
      <td><span className={`tier-badge ${tierBadgeClass(u.tier)}`}>{tierLabel(u.tier)}</span></td>
      <td style={{ fontWeight: 600, fontSize: 12 }}>{u.ts.split(" ")[0]}</td>
      <td>
        {u.gre === "not" && <span className="tag tag-nogre" style={{ display: "inline-block" }}>None</span>}
        {u.gre === "optional" && <span style={{ color: "#475569", fontSize: 11 }}>Optional</span>}
        {u.gre === "required" && <span className="tag tag-reqgre" style={{ display: "inline-block" }}>Req.</span>}
      </td>
      <td style={{ fontSize: 12 }}>{u.ielts}</td>
      <td style={{ fontSize: 12 }}>{u.deadline}</td>
      <td style={{ fontSize: 12 }}>${u.appFee}</td>
      <td>
        <span style={{ fontSize: 12 }}>{u.as}</span>
        <div className="admit-bar"><div className="admit-fill" style={{ width: `${Math.min(admitMid(u), 100)}%` }} /></div>
      </td>
      <td style={{ fontSize: 11, color: "#475569" }}>{u.ft.slice(0, 3).map((f) => f.toUpperCase()).join(" · ")}</td>
      <td>
        <div className="td-actions">
          <button className="btn-sm" style={{ padding: "3px 7px", fontSize: 11 }} onClick={() => onOpen(u.id)}>ℹ</button>
          <button className={`btn-sm ${u.cmp ? "active" : ""}`} style={{ padding: "3px 7px", fontSize: 11 }} onClick={() => onToggleCmp(u.id)}>⟷</button>
        </div>
      </td>
    </tr>
  );
}

export default function TableView({ universities, onOpen, onToggleStar, onToggleCmp, onDragStart, onDragEnd }) {
  if (!universities.length) {
    return (
      <div className="empty">
        <div className="empty-icon">🔍</div>
        <div>No universities match your filters.</div>
      </div>
    );
  }
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th style={{ width: 30 }}></th>
            <th>University</th>
            <th>Location</th>
            <th>Tier</th>
            <th>Tuition/yr</th>
            <th>GRE</th>
            <th>IELTS</th>
            <th>Deadline</th>
            <th>App fee</th>
            <th>Admit %</th>
            <th>Funding tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {universities.map((u) => (
            <DraggableRow key={u.id} u={u} onOpen={onOpen} onToggleStar={onToggleStar} onToggleCmp={onToggleCmp} onDragStart={onDragStart} onDragEnd={onDragEnd} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
