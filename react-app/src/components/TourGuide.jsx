import { useEffect, useState } from "react";

export const TOUR_KEY = "ascent-tour-v1";

const STEPS = [
  {
    id: "welcome",
    icon: "🎓",
    title: "Welcome to Ascent.",
    body: "Your personal guide to finding the perfect MS/CS program in the US. Let me show you around — takes just 30 seconds.",
    target: null,
  },
  {
    id: "spiral",
    icon: "✦",
    title: "Spiral View",
    body: "Scroll up or down to spin through all 100 universities in this 3D carousel. Click any card to spotlight it and see stats.",
    target: ".spiral-wrap",
    position: "center",
  },
  {
    id: "views",
    icon: "⊞",
    title: "Three Ways to Explore",
    body: "Switch between Spiral, Grid, and Table views. The gold pill slides to your active view.",
    target: ".view-toggle",
    position: "below",
  },
  {
    id: "search",
    icon: "🔍",
    title: "Search Instantly",
    body: "Type a university name, city, or state — the list filters in real time as you type.",
    target: ".topbar-search",
    position: "below",
  },
  {
    id: "compare",
    icon: "⟷",
    title: "Drag to Compare",
    body: "Hold any card for a moment then drag it onto this icon. Up to 8 universities, ranked Best Fit — with a full side-by-side breakdown.",
    target: ".compare-dropzone",
    position: "below",
  },
  {
    id: "filters",
    icon: "☰",
    title: "Filters & Text Size",
    body: "Tap the menu to filter by GRE requirement, tuition, admit rate, funding, and more. There's also a text size slider if you need it.",
    target: ".menu-btn",
    position: "below",
  },
  {
    id: "done",
    icon: "🚀",
    title: "You're all set!",
    body: "100 verified MS programs, 2026 data. Good luck with your applications — Ascent's got your back.",
    target: null,
  },
];

const PAD = 10;

export default function TourGuide({ onDone }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const [cardIn, setCardIn] = useState(false);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  // Compute spotlight rect whenever step changes
  useEffect(() => {
    setCardIn(false);
    const t = setTimeout(() => {
      if (current.target) {
        const el = document.querySelector(current.target);
        if (el) {
          const r = el.getBoundingClientRect();
          setRect({ top: r.top - PAD, left: r.left - PAD, width: r.width + PAD * 2, height: r.height + PAD * 2, br: getComputedStyle(el).borderRadius });
        } else setRect(null);
      } else setRect(null);
      setCardIn(true);
    }, 80);
    return () => clearTimeout(t);
  }, [step, current.target]);

  const goNext = () => {
    if (isLast) finish();
    else setStep(s => s + 1);
  };

  const finish = () => {
    localStorage.setItem(TOUR_KEY, "done");
    onDone();
  };

  // Tooltip position: for "below" steps place card under the spotlight; others center
  let cardStyle = {};
  const isCentered = !rect || current.position === "center";

  if (isCentered) {
    cardStyle = { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
  } else {
    // below the spotlight
    const cardTop = rect.top + rect.height + 18;
    const cardLeft = Math.max(16, Math.min(rect.left + rect.width / 2 - 190, window.innerWidth - 396));
    cardStyle = { top: cardTop, left: cardLeft };
  }

  return (
    <div className="tour-overlay">
      {/* Full-screen click-to-dismiss bg */}
      <div className="tour-bg" onClick={finish} />

      {/* Spotlight cutout */}
      {rect && (
        <div
          className="tour-spotlight"
          style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height, borderRadius: rect.br }}
        />
      )}

      {/* Tooltip card */}
      <div className={`tour-card${cardIn ? " in" : ""}`} style={cardStyle}>
        {/* Arrow pointing up at the spotlight */}
        {!isCentered && <div className="tour-arrow-up" />}

        <div className="tour-card-icon">{current.icon}</div>
        <div className="tour-card-step">{step + 1} / {STEPS.length}</div>
        <h3 className="tour-card-title">{current.title}</h3>
        <p className="tour-card-body">{current.body}</p>

        <div className="tour-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`tour-dot${i === step ? " active" : i < step ? " done" : ""}`} onClick={() => setStep(i)} />
          ))}
        </div>

        <div className="tour-actions">
          {!isLast && <button className="tour-skip" onClick={finish}>Skip tour</button>}
          <button className="tour-next" onClick={goNext}>
            {isLast ? "Let's explore →" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  );
}
