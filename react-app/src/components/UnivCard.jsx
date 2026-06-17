import { useEffect, useRef, useState } from "react";
import { tierBadgeClass, tierLabel, admitMid } from "../data/universities";

function useTouchDrag({ id, short, onDragStart, onDragEnd, onTouchDrop, setDragging }) {
  const cardRef = useRef(null);
  const ghostRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const handleTouchStart = (e) => {
      const startTouch = e.touches[0];
      const startX = startTouch.clientX;
      const startY = startTouch.clientY;
      let isDragging = false;
      let timer = null;

      const beginDrag = (t) => {
        isDragging = true;
        const ghost = document.createElement("div");
        ghost.className = "drag-ghost-pill";
        ghost.textContent = `⟷ ${short}`;
        ghost.style.left = `${t.clientX - 44}px`;
        ghost.style.top = `${t.clientY - 18}px`;
        document.body.appendChild(ghost);
        ghostRef.current = ghost;
        setDragging(true);
        onDragStart?.();
      };

      // Long-press threshold: start drag after 300ms hold without significant movement
      timer = setTimeout(() => {
        if (!isDragging) beginDrag(startTouch);
      }, 300);

      const onMove = (ev) => {
        const t = ev.touches[0];
        const moved = Math.hypot(t.clientX - startX, t.clientY - startY);

        // If moved more than 12px before long-press fires, cancel the timer
        // and treat as a scroll — but if drag already started, keep going
        if (!isDragging) {
          if (moved > 12) {
            clearTimeout(timer);
            document.removeEventListener("touchmove", onMove);
            document.removeEventListener("touchend", onEnd);
          }
          return;
        }

        ev.preventDefault(); // prevent page scroll while dragging ghost
        const g = ghostRef.current;
        if (!g) return;

        g.style.left = `${t.clientX - 44}px`;
        g.style.top = `${t.clientY - 18}px`;

        const dz = document.querySelector(".compare-dropzone");
        if (dz) {
          const r = dz.getBoundingClientRect();
          const dist = Math.hypot(t.clientX - (r.left + r.width / 2), t.clientY - (r.top + r.height / 2));
          g.style.transform = `scale(${Math.max(0.3, Math.min(1, dist / 160))})`;
          dist < Math.max(r.width, 60)
            ? dz.classList.add("dz-drag-over")
            : dz.classList.remove("dz-drag-over");
        }
      };

      const onEnd = (ev) => {
        clearTimeout(timer);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onEnd);

        const g = ghostRef.current;
        if (g) { document.body.removeChild(g); ghostRef.current = null; }

        const dz = document.querySelector(".compare-dropzone");
        if (dz) dz.classList.remove("dz-drag-over");

        if (isDragging) {
          setDragging(false);
          onDragEnd?.();
          if (dz) {
            const r = dz.getBoundingClientRect();
            const t = ev.changedTouches[0];
            const pad = 32;
            if (t.clientX >= r.left - pad && t.clientX <= r.right + pad &&
                t.clientY >= r.top - pad && t.clientY <= r.bottom + pad) {
              onTouchDrop?.(id);
            }
          }
        }
      };

      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd, { passive: true });
    };

    // non-passive so we can call preventDefault during drag
    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    return () => el.removeEventListener("touchstart", handleTouchStart);
  }, [id, short, onDragStart, onDragEnd, onTouchDrop, setDragging]);

  return cardRef;
}

export default function UnivCard({ u, onOpen, onToggleStar, onToggleCmp, onDragStart, onDragEnd, onTouchDrop }) {
  const [dragging, setDragging] = useState(false);
  const cardRef = useTouchDrag({
    id: u.id, short: u.short,
    onDragStart: () => { onDragStart?.(); },
    onDragEnd: () => { onDragEnd?.(); },
    onTouchDrop,
    setDragging,
  });

  return (
    <div
      ref={cardRef}
      className={`univ-card ${u.starred ? "starred-card" : ""}${dragging ? " is-dragging" : ""}`}
      draggable
      onDragStart={(e) => { e.dataTransfer.setData("univId", u.id); e.dataTransfer.effectAllowed = "copy"; setDragging(true); onDragStart?.(); }}
      onDragEnd={() => { setDragging(false); onDragEnd?.(); }}
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
