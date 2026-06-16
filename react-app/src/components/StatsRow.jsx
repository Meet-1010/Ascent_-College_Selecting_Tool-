import { admitMid } from "../data/universities";

const ACCENTS = ["#0144FF", "#FF007E", "#08CFAF", "#CFA500", "#FF5C22"];

export default function StatsRow({ filtered, allCount, starredCount }) {
  const avgT = filtered.length ? Math.round(filtered.reduce((a, u) => a + u.tuition, 0) / filtered.length) : 0;
  const avgA = filtered.length ? Math.round(filtered.reduce((a, u) => a + admitMid(u), 0) / filtered.length) : 0;
  const waivers = filtered.filter((u) => u.ft.includes("waiver")).length;

  return (
    <div className="stats-row">
      <div className="stat-card" style={{ "--stat-accent": ACCENTS[0] }}><div className="stat-val">{filtered.length}</div><div className="stat-lbl">Universities shown</div></div>
      <div className="stat-card" style={{ "--stat-accent": ACCENTS[1] }}><div className="stat-val">${(avgT / 1000).toFixed(0)}k</div><div className="stat-lbl">Avg tuition/year</div></div>
      <div className="stat-card" style={{ "--stat-accent": ACCENTS[2] }}><div className="stat-val">{avgA}%</div><div className="stat-lbl">Avg admit rate</div></div>
      <div className="stat-card" style={{ "--stat-accent": ACCENTS[3] }}><div className="stat-val">{waivers}</div><div className="stat-lbl">Tuition waiver programs</div></div>
      <div className="stat-card" style={{ "--stat-accent": ACCENTS[4] }}><div className="stat-val">{starredCount} ★</div><div className="stat-lbl">Starred universities</div></div>
    </div>
  );
}
