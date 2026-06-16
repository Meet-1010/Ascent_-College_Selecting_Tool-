export default function Toast({ toast }) {
  return (
    <div className={`toast ${toast?.type === "warn" ? "" : "toast-success"} ${toast ? "show" : ""}`}>
      <span>{toast?.type === "warn" ? "⚠" : "✓"}</span>
      <span>{toast?.msg || ""}</span>
    </div>
  );
}
