import { useState } from "react";

export default function ProfileModal({ profile, onSave, onClose }) {
  const [form, setForm] = useState(profile);
  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <form onSubmit={submit}>
      <div className="modal-title" style={{ marginBottom: 4 }}>Edit your profile</div>
      <div className="modal-sub">Used by "Filter for my profile" and shown in the sidebar</div>

      <div className="modal-sec">
        <div className="filter-group">
          <label className="filter-label">GRE target score</label>
          <input type="text" value={form.greTarget} onChange={(e) => update("greTarget", e.target.value)} placeholder="e.g. 320+" />
        </div>
        <div className="filter-group">
          <label className="filter-label">IELTS target score</label>
          <input type="text" value={form.ieltsTarget} onChange={(e) => update("ieltsTarget", e.target.value)} placeholder="e.g. 7.5+" />
        </div>
        <div className="filter-group">
          <label className="filter-label">CGPA</label>
          <input type="text" value={form.cgpa} onChange={(e) => update("cgpa", e.target.value)} placeholder="e.g. ~8.0+" />
        </div>
        <div className="filter-group">
          <label className="filter-label">Key project / highlight</label>
          <input type="text" value={form.keyProject} onChange={(e) => update("keyProject", e.target.value)} placeholder="e.g. Impulse IDE" />
        </div>
        <div className="filter-group">
          <label className="filter-label">Location label</label>
          <input type="text" value={form.locationLabel} onChange={(e) => update("locationLabel", e.target.value)} placeholder="e.g. Brother, Home, Sponsor" />
        </div>
        <div className="filter-group">
          <label className="filter-label">Location</label>
          <input type="text" value={form.location} onChange={(e) => update("location", e.target.value)} placeholder="e.g. Fort Worth, TX" />
        </div>
      </div>

      <div className="modal-actions">
        <button type="button" className="mbtn" onClick={onClose}>✕ Cancel</button>
        <button type="submit" className="mbtn primary">💾 Save profile</button>
      </div>
    </form>
  );
}
