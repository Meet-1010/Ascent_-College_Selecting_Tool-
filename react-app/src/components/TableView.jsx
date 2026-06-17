import { useEffect, useRef, useState } from "react";
import { tierBadgeClass, tierLabel, admitMid } from "../data/universities";

function DraggableRow({ u, onOpen, onToggleStar, onToggleCmp, onDragStart, onDragEnd, onTouchDrop }) {
  const [dragging, setDragging] = useState(false);
  const rowRef = useRef(null);
  const ghostRef = useRef(null);

  useEffect(() => {
    const el = rowRef.current;
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
        ghost.textContent = `⟷ ${u.short}`;
        ghost.style.left = `${t.clientX - 44}px`;
        ghost.style.top = `${t.clientY - 18}px`;
        document.body.appendChild(ghost);
        ghostRef.current = ghost;
        setDragging(true);
        onDragStart?.();
      };

      timer = setTimeout(() => {
        if (!isDragging) beginDrag(startTouch);
      }, 300);

      const onMove = (ev) => {
        const t = ev.touches[0];
        const moved = Math.hypot(t.clientX - startX, t.clientY - startY);

        if (!isDragging) {
          if (moved > 12) {
            clearTimeout(timer);
            document.removeEventListener("touchmove", onMove);
            document.removeEventListener("touchend", onEnd);
          }
          return;
        }

        ev.preventDefault();
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
              onTouchDrop?.(u.id);
            }
          }
        }
      };

      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend", onEnd, { passive: true });
    };

    el.addEventListener("touchstart", handleTouchStart, { passive: false });
    return () => el.removeEventListener("touchstart", handleTouchStart);
  }, [u.id, u.short, onDragStart, onDragEnd, onTouchDrop]);

  return (
    <tr
      ref={rowRef}
      draggable
      className={dragging ? "is-dragging" : ""}
      onDragStart={(e) => { e.dataTransfer.setData("univId", u.id); e.dataTransfer.effectAllowed = "copy"; setDragging(true); onDragStart?.(); }}
      onDragEnd={() => { setDragging(false); onDragEnd?.(); }}
    >
      <td>
        <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 15, color: u.starred ? "#D97706" : "#94A3B8" }} onClick={() => onToggleStar(u.id)}>
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

export default function TableView({ universities, onOpen, onToggleStar, onToggleCmp, onDragStart, onDragEnd, onTouchDrop }) {
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
            <DraggableRow key={u.id} u={u} onOpen={onOpen} onToggleStar={onToggleStar} onToggleCmp={onToggleCmp} onDragStart={onDragStart} onDragEnd={onDragEnd} onTouchDrop={onTouchDrop} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
