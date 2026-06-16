export default function CompareBar({ compareList, onShowCompare, onClear, onRemove }) {
  if (compareList.length === 0) return null;
  return (
    <div className="cmp-bar open">
      <div className="cmp-bar-title">Comparing</div>
      <div className="cmp-slots">
        {compareList.map((u) => (
          <div key={u.id} className="cmp-slot">
            {u.short}
            <button className="cmp-remove" onClick={() => onRemove(u.id)}>×</button>
          </div>
        ))}
      </div>
      <div className="cmp-actions">
        <button className="cmp-btn-action primary" onClick={onShowCompare}>⟷ Compare now</button>
        <button className="cmp-btn-action ghost" onClick={onClear}>✕ Clear</button>
      </div>
    </div>
  );
}
