import UnivCard from "./UnivCard";
import { SearchIcon } from "./Icons";

export default function GridView({ universities, onOpen, onToggleStar, onToggleCmp, onDragStart, onDragEnd, onTouchDrop }) {
  if (!universities.length) {
    return (
      <div className="empty">
        <div className="empty-icon"><SearchIcon size={42} style={{ opacity: 0.35 }} /></div>
        <div>No universities match your filters. Try clearing some.</div>
      </div>
    );
  }
  return (
    <div className="grid-view">
      {universities.map((u) => (
        <UnivCard key={u.id} u={u} onOpen={onOpen} onToggleStar={onToggleStar} onToggleCmp={onToggleCmp} onDragStart={onDragStart} onDragEnd={onDragEnd} onTouchDrop={onTouchDrop} />
      ))}
    </div>
  );
}
