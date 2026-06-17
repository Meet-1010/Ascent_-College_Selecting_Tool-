import { useRef, useState } from "react";
import { tierBadgeClass, tierLabel, admitMid } from "../data/universities";

function useTouchDrag({ id, short, onDragStart, onDragEnd, onTouchDrop }) {
  const ghostRef = useRef(null);

  const handleTouchStart = (e) => {
    const touch = e.touches[0];

    const ghost = document.createElement("div");
    ghost.className = "drag-ghost-pill";
    ghost.textContent = `⟷ ${short}`;
    ghost.style.left = `${touch.clientX - 44}px`;
    ghost.style.top = `${touch.clientY - 18}px`;
    document.body.appendChild(ghost);
    ghostRef.current = ghost;
    onDragStart?.();

    const onMove = (ev) => {
      ev.preventDefault();
      const t = ev.touches[0];
      const g = ghostRef.current;
      if (!g) return;

      g.style.left = `${t.clientX - 44}px`;
      g.style.top = `${t.clientY - 18}px`;

      const dz = document.querySelector(".compare-dropzone");
      if (dz) {
        const r = dz.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(t.clientX - cx, t.clientY - cy);
        // shrink ghost as it approaches (160px range → 0.3 scale at center)
        const scale = Math.max(0.3, Math.min(1, dist / 160));
        g.style.transform = `scale(${scale})`;
        if (dist < Math.max(r.width, 60)) {
          dz.classList.add("dz-drag-over");
        } else {
          dz.classList.remove("dz-drag-over");
        }
      }
    };

    const onEnd = (ev) => {
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);

      const g = ghostRef.current;
      if (g) { document.body.removeChild(g); ghostRef.current = null; }

      const dz = document.querySelector(".compare-dropzone");
      if (dz) {
        dz.classList.remove("dz-drag-over");
        const r = dz.getBoundingClientRect();
        const t = ev.changedTouches[0];
        const pad = 24;
        if (
          t.clientX >= r.left - pad && t.clientX <= r.right + pad &&
          t.clientY >= r.top - pad && t.clientY <= r.bottom + pad
        ) {
          onTouchDrop?.(id);
        }
      }
      onDragEnd?.();
    };

    document.addEventListener("touchmove", onMove, { passive: false });
    document.addEventListener("touchend", onEnd, { passive: true });
  };

  return { handleTouchStart };
}

export default function UnivCard({ u, onOpen, onToggleStar, onToggleCmp, onDragStart, onDragEnd, onTouchDrop }) {
  const [dragging, setDragging] = useState(false);
  const { handleTouchStart } = useTouchDrag({
    id: u.id, short: u.short,
    onDragStart: () => { setDragging(true); onDragStart?.(); },
    onDragEnd: () => { setDragging(false); onDragEnd?.(); },
    onTouchDrop,
  });

  return (
    <div
      className={`univ-card ${u.starred ? "starred-card" : ""}${dragging ? " is-dragging" : ""}`}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("univId", u.id); e.dataTransfer.effectAllowed = "copy"; setDragging(true); onDragStart?.(); }}
      onDragEnd={() => { setDragging(false); onDragEnd?.(); }}
      onTouchStart={handleTouchStart}
      onClick={() => onOpen(u.id)}
    >
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
