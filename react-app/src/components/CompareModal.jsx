import { tierLabel } from "../data/universities";

const ROWS = [
  ["Tier", (u) => tierLabel(u.tier)],
  ["Rank", (u) => "#" + u.rank],
  ["Location", (u) => u.loc],
  ["Tuition/yr", (u) => u.ts.split(" ")[0]],
  ["GRE", (u) => u.gres],
  ["IELTS", (u) => u.ielts],
  ["TOEFL", (u) => u.toefl],
  ["Deadline", (u) => u.deadline],
  ["App fee", (u) => "$" + u.appFee],
  ["Admit rate", (u) => u.as],
  ["Funding", (u) => u.ft.join(", ").toUpperCase()],
  ["Program options", (u) => u.program],
];

export default function CompareModal({ universities, onClose, onClear }) {
  return (
    <div>
      <div className="modal-title" style={{ marginBottom: 16 }}>Side-by-side comparison</div>
      <div style={{ overflowX: "auto" }}>
        <table className="cmp-table">
          <thead>
            <tr>
              <th>Detail</th>
              {universities.map((u) => (
                <th key={u.id}>{u.short}<br /><span style={{ fontWeight: 400, fontSize: 10, textTransform: "none" }}>{u.loc}</span></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([lbl, fn]) => (
              <tr key={lbl}>
                <td className="row-label">{lbl}</td>
                {universities.map((u) => <td key={u.id}>{fn(u)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="modal-actions">
        <button className="mbtn" onClick={onClose}>✕ Close</button>
        <button className="mbtn primary" onClick={() => { onClear(); onClose(); }}>Clear & restart</button>
      </div>
    </div>
  );
}
