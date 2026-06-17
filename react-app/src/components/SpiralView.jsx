import { useEffect, useMemo, useRef, useState } from "react";
import { tierLabel } from "../data/universities";

const STEP = 130; // px of scroll per card
const ANGLE_STEP = 24; // degrees of rotation per card
const VISIBLE_WINDOW = 11; // cards rendered on each side of center
const IDLE_DELAY = 1100; // ms of no interaction before auto-drift kicks in
const AUTO_SPEED = 0.45; // px per frame during idle drift
const SPOTLIGHT_DELAY = 420; // ms to let the spotlight scroll settle before opening the modal

// pick black or white ink based on perceived brightness of the bg color
function contrastInk(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55 ? "#0A0A0A" : "#FAFAFA";
}

const TIER_COLORS = {
  ELITE: "#ff007e",
  TIER2: "#0144ff",
  TIER3: "#08feff",
  TIER4: "#cffd00",
  TIER5: "#ff5c22",
};

const TIER_STYLE = Object.fromEntries(
  Object.entries(TIER_COLORS).map(([tier, bg]) => [tier, { bg, ink: contrastInk(bg) }])
);

// deterministic pseudo-random tilt per index so it's stable across renders
function hash(i) {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// shortest signed distance from `from` to `to` around a loop of length `mod`
function wrapDelta(delta, mod) {
  return delta - mod * Math.round(delta / mod);
}

export default function SpiralView({ universities, onOpen, onToggleStar, onToggleCmp, onDragStart, onDragEnd }) {
  const scrollerRef = useRef(null);
  const wrapRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [displayScroll, setDisplayScroll] = useState(0);
  const displayScrollRef = useRef(0);
  const [bend, setBend] = useState(0);
  const [size, setSize] = useState({ w: 1200, h: 600 });
  const [hoverId, setHoverId] = useState(null);
  const [hoverTilt, setHoverTilt] = useState({ x: 0, y: 0 });
  const lastInteraction = useRef(0);
  const lastScrollTop = useRef(0);
  const scrollTopRef = useRef(0);
  const velocity = useRef(0);
  const openTimer = useRef(null);
  const initedRef = useRef(false);

  const count = universities.length;
  const loopPx = count * STEP;
  const centerIndex = count ? (((Math.round(displayScroll / STEP) % count) + count) % count) : 0;
  const focused = universities[centerIndex];

  const isMobile = size.w < 680;
  const radiusX = Math.max(140, size.w * (isMobile ? 0.28 : 0.32));
  const radiusZ = Math.max(220, size.w * 0.42);

  // center the scroll position in the buffer (once) so infinite wrap has room both ways
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !count || initedRef.current) return;
    initedRef.current = true;
    el.scrollTop = loopPx;
    lastScrollTop.current = loopPx;
    scrollTopRef.current = loopPx;
    displayScrollRef.current = loopPx;
    setScrollTop(loopPx);
    setDisplayScroll(loopPx);
  }, [count, loopPx]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !count) return;
    const onScroll = () => {
      let top = el.scrollTop;
      // seamless wraparound: re-center well before hitting either native scroll
      // boundary (0 or max), since the boundary itself can't be crossed directly
      if (top >= loopPx * 1.5) {
        el.scrollTop = top - loopPx;
        top = el.scrollTop;
        lastScrollTop.current -= loopPx;
        displayScrollRef.current -= loopPx;
      } else if (top <= loopPx * 0.5) {
        el.scrollTop = top + loopPx;
        top = el.scrollTop;
        lastScrollTop.current += loopPx;
        displayScrollRef.current += loopPx;
      }
      velocity.current = top - lastScrollTop.current;
      lastScrollTop.current = top;
      scrollTopRef.current = top;
      setScrollTop(top);
    };
    const markInteraction = () => { lastInteraction.current = Date.now(); };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", markInteraction, { passive: true });
    el.addEventListener("touchstart", markInteraction, { passive: true });
    el.addEventListener("pointerdown", markInteraction, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", markInteraction);
      el.removeEventListener("touchstart", markInteraction);
      el.removeEventListener("pointerdown", markInteraction);
    };
  }, [loopPx, count]);

  // idle auto-drift + bend decay loop — setInterval rather than rAF so it
  // keeps running even when the tab/window isn't focused (rAF gets suspended)
  useEffect(() => {
    const id = setInterval(() => {
      const el = scrollerRef.current;
      if (el) {
        const idle = Date.now() - lastInteraction.current > IDLE_DELAY;
        if (idle) el.scrollTop += AUTO_SPEED; // wraparound handled by the scroll listener
      }
      velocity.current *= 0.85;
      setBend((b) => {
        const target = Math.max(-10, Math.min(10, velocity.current * 0.9));
        const next = b + (target - b) * 0.18;
        return Math.abs(next) < 0.02 ? 0 : next;
      });
      // slightly lag the visible spiral behind the raw scroll position —
      // gives the rotation a weighted, "touch" feel instead of snapping 1:1
      displayScrollRef.current += (scrollTopRef.current - displayScrollRef.current) * 0.16;
      setDisplayScroll(displayScrollRef.current);
    }, 16);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => clearTimeout(openTimer.current), []);

  // scroll to index i via whichever direction (forward/back/wrapped) is closer
  const scrollToIndex = (i) => {
    const el = scrollerRef.current;
    if (!el || !count) return;
    lastInteraction.current = Date.now();
    const current = el.scrollTop;
    const base = i * STEP;
    const candidates = [base - loopPx, base, base + loopPx];
    let best = candidates[0], bestDist = Math.abs(current - best);
    for (const c of candidates) {
      const d = Math.abs(current - c);
      if (d < bestDist) { bestDist = d; best = c; }
    }
    el.scrollTo({ top: best, behavior: "smooth" });
  };

  // click a card: spotlight it (smooth scroll to center), then open its modal
  const selectCard = (u, i) => {
    clearTimeout(openTimer.current);
    if (i === centerIndex) {
      onOpen(u.id);
      return;
    }
    scrollToIndex(i);
    openTimer.current = setTimeout(() => onOpen(u.id), SPOTLIGHT_DELAY);
  };

  const onCardMouseMove = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setHoverId(id);
    setHoverTilt({ x: px, y: py });
  };
  const onCardMouseLeave = () => {
    setHoverId(null);
    setHoverTilt({ x: 0, y: 0 });
  };

  // scrolling down (velocity>0) tucks cards inward; scrolling up (velocity<0) bulges them outward
  const bendX = -bend;

  const visibleCards = useMemo(() => {
    if (!count) return [];
    const virtualPos = displayScroll / STEP;
    const cards = [];
    for (let i = 0; i < count; i++) {
      const phase = wrapDelta(i - virtualPos, count);
      if (Math.abs(phase) > VISIBLE_WINDOW) continue;
      const u = universities[i];
      const angleDeg = phase * ANGLE_STEP;
      const angleRad = (angleDeg * Math.PI) / 180;
      const x = Math.sin(angleRad) * radiusX;
      const z = Math.cos(angleRad) * radiusZ - radiusZ;
      const wobble = Math.sin(phase * 0.9) * (radiusZ * 0.2) + (hash(i) - 0.5) * 30;
      const tiltZ = (hash(i + 99) - 0.5) * 26;
      const tiltX = (hash(i + 250) - 0.5) * 18;
      const depth01 = (z + radiusZ) / radiusZ; // 1 at front, 0 far back
      const scale = 0.4 + depth01 * 0.85;
      const opacity = Math.max(0, Math.min(1, depth01 * 1.4 - 0.05));
      cards.push({ u, i, x, z, wobble, tiltZ, tiltX, scale, opacity, angleDeg, phase, depth01 });
    }
    // paint far cards first so near cards stack on top
    cards.sort((a, b) => a.z - b.z);
    return cards;
  }, [universities, displayScroll, count, radiusX, radiusZ]);

  if (!count) {
    return (
      <div className="empty" style={{ color: "#fff" }}>
        <div className="empty-icon">🔍</div>
        <div>No universities match your filters. Try clearing some.</div>
      </div>
    );
  }

  return (
    <div className="spiral-wrap" ref={wrapRef}>
      <div className="spiral-hint">Scroll to rotate · click a card to spotlight it · {count} universities</div>
      <div className="spiral-scroller" ref={scrollerRef}>
        {/* taller than one loop so scrollTop can actually cross the wrap threshold mid-scroll */}
        <div className="spiral-spacer" style={{ height: loopPx * 2 + size.h }} />
      </div>
      <div className="spiral-stage" aria-hidden="true">
        <div className="spiral-grid" />
        {visibleCards.map(({ u, i, x, z, wobble, tiltZ, tiltX, scale, opacity, phase, depth01 }) => {
          const style = TIER_STYLE[u.tier] || TIER_STYLE.TIER5;
          const cardBend = bendX * (0.4 + depth01 * 0.6);
          const isHover = hoverId === u.id;
          const hoverScale = isHover ? 1.06 : 1;
          const hoverRotY = isHover ? hoverTilt.x * 22 : 0;
          const hoverRotX = isHover ? -hoverTilt.y * 22 : 0;
          return (
            <div
              key={u.id}
              data-id={u.id}
              className={`spiral-card ${isHover ? "is-hover" : ""}`}
              draggable
              style={{
                background: style.bg,
                color: style.ink,
                transform: `translate3d(${x}px, ${wobble}px, ${z}px) rotateY(${-phase * ANGLE_STEP * 0.6 + hoverRotY}deg) rotateZ(${tiltZ}deg) rotateX(${tiltX + cardBend + hoverRotX}deg) scale(${scale * hoverScale})`,
                opacity,
                zIndex: isHover ? 5000 : Math.round(1000 + z),
                pointerEvents: opacity > 0.12 ? "auto" : "none",
              }}
              onClick={() => selectCard(u, i)}
              onMouseMove={(e) => onCardMouseMove(e, u.id)}
              onMouseLeave={onCardMouseLeave}
              onDragStart={(e) => { e.dataTransfer.setData("univId", u.id); e.dataTransfer.effectAllowed = "copy"; onDragStart?.(); }}
              onDragEnd={() => onDragEnd?.()}
            >
              <div className="spiral-card-tier" style={{ background: "rgba(0,0,0,.12)", color: style.ink }}>{tierLabel(u.tier)}</div>
              <div className="spiral-card-name">{u.name}</div>
              <div className="spiral-card-loc">📍 {u.loc}</div>
              <div className="spiral-card-stat">{u.ts.split(" ")[0]} · {u.as} admit</div>
            </div>
          );
        })}
      </div>

      {focused && (
        <div className="spiral-focus">
          <div>
            <div className="spiral-focus-name">{focused.name}</div>
            <div className="spiral-focus-loc">📍 {focused.loc} · #{focused.rank}</div>
          </div>
          <div className="spiral-focus-actions">
            <button
              className={`star-btn ${focused.starred ? "on" : ""}`}
              style={{ fontSize: 22, color: focused.starred ? "#FBBF24" : "rgba(255,255,255,.5)" }}
              onClick={() => onToggleStar(focused.id)}
            >
              {focused.starred ? "★" : "☆"}
            </button>
            {onToggleCmp && (
              <button
                className={`spiral-cmp-btn ${focused.cmp ? "on" : ""}`}
                onClick={() => onToggleCmp(focused.id)}
                title={focused.cmp ? "Remove from compare" : "Add to compare"}
              >
                ⟷ {focused.cmp ? "In compare" : "Compare"}
              </button>
            )}
            <button className="mbtn primary" onClick={() => onOpen(focused.id)}>View details</button>
          </div>
        </div>
      )}

      <div className="spiral-nav">
        <button className="spiral-nav-btn" onClick={() => scrollToIndex((centerIndex - 1 + count) % count)}>‹</button>
        <button className="spiral-nav-btn" onClick={() => scrollToIndex((centerIndex + 1) % count)}>›</button>
      </div>
    </div>
  );
}
