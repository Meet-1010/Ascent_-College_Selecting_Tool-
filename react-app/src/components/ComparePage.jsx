import { tierLabel, admitMid } from "../data/universities";
import { CrownIcon } from "./Icons";

const TIER_BADGE = { ELITE: "badge-elite", TIER2: "badge-t2", TIER3: "badge-t3", TIER4: "badge-t4", TIER5: "badge-t5" };

const ROWS = [
  { label: "Rank",         fn: (u) => "#" + u.rank,                   cmp: (a, b) => a.rank - b.rank },
  { label: "Tier",         fn: (u) => tierLabel(u.tier) },
  { label: "Location",     fn: (u) => u.loc },
  { label: "Tuition / yr", fn: (u) => u.ts.split(" ")[0],             cmp: (a, b) => a.tuition - b.tuition },
  { label: "App fee",      fn: (u) => "$" + u.appFee,                 cmp: (a, b) => a.appFee - b.appFee },
  { label: "GRE",          fn: (u) => u.gres },
  { label: "TOEFL",        fn: (u) => u.toefl },
  { label: "IELTS",        fn: (u) => u.ielts },
  { label: "Deadline",     fn: (u) => u.deadline,                     cmp: (a, b) => a.ddSort - b.ddSort },
  { label: "Admit rate",   fn: (u) => u.as,                           cmp: (a, b) => b.admitH - a.admitH },
  { label: "Funding",      fn: (u) => u.ft.join(", ").toUpperCase() },
  { label: "Programs",     fn: (u) => u.program },
];

function rowBestIdx(unis, row) {
  if (!row.cmp || unis.length < 2) return -1;
  let best = 0;
  for (let i = 1; i < unis.length; i++) {
    if (row.cmp(unis[i], unis[best]) < 0) best = i;
  }
  return best;
}

function buildSummary(best, others) {
  const points = [];

  // Rank
  const rankLosers = others.filter(u => u.rank > best.rank);
  if (rankLosers.length) {
    points.push(`Ranks #${best.rank} nationally — higher than ${rankLosers.map(u => u.short).join(", ")} (${rankLosers.map(u => "#" + u.rank).join(", ")})`);
  }

  // Tuition
  const moreExpensive = others.filter(u => u.tuition > best.tuition);
  if (moreExpensive.length) {
    points.push(`More affordable at ${best.ts.split(" ")[0]}/yr compared to ${moreExpensive.map(u => `${u.short} (${u.ts.split(" ")[0]})`).join(", ")}`);
  }

  // Admit rate
  const lowerAdmit = others.filter(u => admitMid(u) < admitMid(best));
  if (lowerAdmit.length) {
    points.push(`Higher acceptance rate (${best.as}) vs ${lowerAdmit.map(u => `${u.short} (${u.as})`).join(", ")}`);
  }

  // GRE flexibility
  if (best.gre === "not") {
    const greReq = others.filter(u => u.gre !== "not");
    if (greReq.length) points.push(`No GRE required — unlike ${greReq.map(u => u.short).join(", ")}`);
  } else if (best.gre === "optional") {
    const greReq = others.filter(u => u.gre === "required");
    if (greReq.length) points.push(`GRE optional — less restrictive than ${greReq.map(u => u.short).join(", ")} where it's required`);
  }

  // Funding
  const bestFunding = best.ft;
  if (bestFunding.includes("fellowship") || bestFunding.includes("waiver")) {
    const fewerFunds = others.filter(u => u.ft.length < bestFunding.length);
    if (fewerFunds.length) {
      points.push(`Stronger funding options (${bestFunding.map(f => f.toUpperCase()).join(", ")}) vs ${fewerFunds.map(u => u.short).join(", ")}`);
    }
  }

  // App fee
  const higherFee = others.filter(u => u.appFee > best.appFee);
  if (higherFee.length) {
    points.push(`Lower application fee ($${best.appFee}) vs ${higherFee.map(u => `${u.short} ($${u.appFee})`).join(", ")}`);
  }

  // Deadline (earlier = more time to prepare? actually later is better for applicants)
  const earlierDeadline = others.filter(u => u.ddSort < best.ddSort);
  if (earlierDeadline.length) {
    points.push(`Later deadline (${best.deadline}) gives more preparation time than ${earlierDeadline.map(u => `${u.short} (${u.deadline})`).join(", ")}`);
  }

  return points;
}

function ScoreWins(unis) {
  const scores = unis.map(() => 0);
  for (const row of ROWS) {
    if (!row.cmp) continue;
    const best = rowBestIdx(unis, row);
    if (best >= 0) scores[best]++;
  }
  return scores;
}

export default function ComparePage({ universities, onBack, onOpen, onClear }) {
  if (universities.length === 0) {
    return (
      <div className="compare-page">
        <div className="cpage-hdr">
          <button className="cpage-back-btn" onClick={onBack}>← Back to explorer</button>
          <div>
            <div className="cpage-hdr-title">Compare Universities</div>
          </div>
        </div>
        <div className="empty" style={{ marginTop: 60 }}>
          <div className="empty-icon">⟷</div>
          <p>No universities selected.</p>
          <p style={{ marginTop: 6, fontSize: 12 }}>Drag a card to the Compare icon, or click ⟷ on any card to add it here.</p>
          <button className="mbtn" style={{ margin: "18px auto 0", display: "flex" }} onClick={onBack}>← Go back</button>
        </div>
      </div>
    );
  }

  // Sort by rank — best first
  const sorted = [...universities].sort((a, b) => a.rank - b.rank);
  const best = sorted[0];
  const others = sorted.slice(1);
  const wins = ScoreWins(sorted);
  const summaryPoints = others.length > 0 ? buildSummary(best, others) : [];

  return (
    <div className="compare-page">
      <div className="cpage-hdr">
        <button className="cpage-back-btn" onClick={onBack}>← Back</button>
        <div>
          <div className="cpage-hdr-title">Compare Universities</div>
          <div className="cpage-hdr-sub">Ranked best-first · {sorted.length} selected</div>
        </div>
        <button className="cpage-clear-btn" onClick={() => { onClear(); onBack(); }}>Clear all</button>
      </div>

      {/* Scorecard row — sorted by rank, scrolls horizontally */}
      <div className="cpage-scorecard-row">
        {sorted.map((u, idx) => (
          <div
            key={u.id}
            className={`cpage-scorecard${idx === 0 ? " cpage-scorecard-best" : ""}`}
            onClick={() => onOpen(u.id)}
          >
            {idx === 0 && <div className="cpage-best-crown"><CrownIcon size={13} style={{ marginRight: 5, verticalAlign: "middle" }} />Best Fit</div>}
            <div className={`tier-badge ${TIER_BADGE[u.tier] || "badge-t5"}`}>{tierLabel(u.tier)}</div>
            <div className="cpage-sc-name">{u.name}</div>
            <div className="cpage-sc-loc">{u.loc}</div>
            <div className="cpage-sc-rank">#{u.rank}</div>
            <div className="cpage-sc-tuition">{u.ts.split(" ")[0]}/yr</div>
            <div className="cpage-sc-admit">{u.as} admit rate</div>
            {wins[idx] > 0 && (
              <div className="cpage-sc-wins">{wins[idx]} stat{wins[idx] > 1 ? "s" : ""} ahead</div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <div className="cpage-table-wrap">
        <table className="cpage-table">
          <thead>
            <tr>
              <th className="cpage-th-label">Criteria</th>
              {sorted.map((u, idx) => (
                <th key={u.id} className={`cpage-th-uni${idx === 0 ? " cpage-th-best" : ""}`} onClick={() => onOpen(u.id)}>
                  {idx === 0 && <span className="cpage-th-crown"><CrownIcon size={12} /></span>}
                  {u.short}
                  <span className="cpage-th-loc">{u.loc}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const best = rowBestIdx(sorted, row);
              return (
                <tr key={row.label}>
                  <td className="cpage-row-label">{row.label}</td>
                  {sorted.map((u, i) => (
                    <td key={u.id} className={`cpage-td${i === best ? " cpage-td-best" : ""}`}>
                      {row.fn(u)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Best Fit Summary */}
      {summaryPoints.length > 0 && (
        <div className="cpage-summary">
          <div className="cpage-summary-hdr">
            <span className="cpage-summary-crown"><CrownIcon size={22} /></span>
            <div>
              <div className="cpage-summary-title">Why {best.name} is your Best Fit</div>
              <div className="cpage-summary-sub">Based on rank, affordability, admit rate, GRE flexibility & funding</div>
            </div>
          </div>
          <ul className="cpage-summary-list">
            {summaryPoints.map((pt, i) => (
              <li key={i} className="cpage-summary-item">
                <span className="cpage-summary-dot">✓</span>
                {pt}
              </li>
            ))}
          </ul>
          <div className="cpage-summary-note">
            Rankings are based on objective metrics in your compare list. Individual fit may vary by research focus, location preference, and program specialization.
          </div>
        </div>
      )}
    </div>
  );
}
