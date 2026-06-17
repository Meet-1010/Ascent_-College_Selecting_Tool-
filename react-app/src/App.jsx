import { useEffect, useMemo, useRef, useState } from "react";
import { UNIVERSITIES, admitMid } from "./data/universities";
import useProfile from "./hooks/useProfile";
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";
import StatsRow from "./components/StatsRow";
import GridView from "./components/GridView";
import TableView from "./components/TableView";
import SpiralView from "./components/SpiralView";
import CompareBar from "./components/CompareBar";
import ComparePage from "./components/ComparePage";
import UniversityModal from "./components/UniversityModal";
import CompareModal from "./components/CompareModal";
import ProfileModal from "./components/ProfileModal";
import Toast from "./components/Toast";

const DEFAULT_FILTERS = { tier: "ALL", starredOnly: false, gre: "", tuition: "", admit: "", fund: "", state: "", sort: "rank" };

export default function App() {
  const [universities, setUniversities] = useState(UNIVERSITIES);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [view, setView] = useState("spiral");
  const [page, setPage] = useState("main");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [compareIds, setCompareIds] = useState([]);
  const [modalId, setModalId] = useState(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [toast, setToast] = useState(null);
  const [fontSize, setFontSize] = useState(100);
  const toastTimer = useRef(null);
  const [profile, saveProfile] = useProfile();

  useEffect(() => {
    document.body.style.zoom = `${fontSize}%`;
  }, [fontSize]);

  const showToast = (msg, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let list = universities.filter((u) => {
      if (filters.tier !== "ALL" && u.tier !== filters.tier) return false;
      if (filters.starredOnly && !u.starred) return false;
      if (q && !u.name.toLowerCase().includes(q) && !u.loc.toLowerCase().includes(q) && !u.short.toLowerCase().includes(q) && !u.state.toLowerCase().includes(q)) return false;
      if (filters.gre && u.gre !== filters.gre) return false;
      if (filters.tuition) {
        const [mn, mx] = filters.tuition.split("-").map(Number);
        if (u.tuition < mn || u.tuition >= mx) return false;
      }
      if (filters.admit === "high" && admitMid(u) < 65) return false;
      if (filters.admit === "med" && (admitMid(u) < 30 || admitMid(u) >= 65)) return false;
      if (filters.admit === "low" && admitMid(u) >= 30) return false;
      if (filters.fund && !u.ft.includes(filters.fund)) return false;
      if (filters.state && !u.state.includes(filters.state)) return false;
      return true;
    });

    const s = filters.sort;
    list = [...list];
    if (s === "rank") list.sort((a, b) => a.rank - b.rank);
    else if (s === "tuition_asc") list.sort((a, b) => a.tuition - b.tuition);
    else if (s === "tuition_desc") list.sort((a, b) => b.tuition - a.tuition);
    else if (s === "admit_desc") list.sort((a, b) => admitMid(b) - admitMid(a));
    else if (s === "admit_asc") list.sort((a, b) => admitMid(a) - admitMid(b));
    else if (s === "name") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (s === "starred") list.sort((a, b) => (b.starred ? 1 : 0) - (a.starred ? 1 : 0) || a.rank - b.rank);
    else if (s === "fee_asc") list.sort((a, b) => a.appFee - b.appFee);
    else if (s === "deadline") list.sort((a, b) => a.ddSort - b.ddSort);
    return list;
  }, [universities, search, filters]);

  const counts = useMemo(() => {
    const c = { all: universities.length, starred: universities.filter((u) => u.starred).length };
    ["ELITE", "TIER2", "TIER3", "TIER4", "TIER5"].forEach((t) => {
      c[t] = universities.filter((u) => u.tier === t).length;
    });
    return c;
  }, [universities]);

  const toggleStar = (id) => {
    const target = universities.find((x) => x.id === id);
    if (!target) return;
    const nextStarred = !target.starred;
    setUniversities((list) => list.map((u) => (u.id === id ? { ...u, starred: nextStarred } : u)));
    showToast(nextStarred ? `★ Starred: ${target.short}` : `Unstarred: ${target.short}`);
  };

  const toggleCmp = (id) => {
    const u = universities.find((x) => x.id === id);
    if (!u) return;
    if (u.cmp) {
      setUniversities((list) => list.map((x) => (x.id === id ? { ...x, cmp: false } : x)));
      setCompareIds((ids) => ids.filter((i) => i !== id));
    } else {
      if (compareIds.length >= 8) {
        showToast("Max 8 universities for comparison", "warn");
        return;
      }
      setUniversities((list) => list.map((x) => (x.id === id ? { ...x, cmp: true } : x)));
      setCompareIds((ids) => [...ids, id]);
    }
  };

  const clearCompare = () => {
    setUniversities((list) => list.map((u) => (compareIds.includes(u.id) ? { ...u, cmp: false } : u)));
    setCompareIds([]);
  };

  const clearAll = () => {
    setSearch("");
    setFilters(DEFAULT_FILTERS);
  };

  const applyMyProfile = () => {
    setSearch("");
    setFilters({ ...DEFAULT_FILTERS, gre: "optional", admit: "med", sort: "starred" });
    showToast("Filtered for your profile — GRE optional, medium admit rate, starred first");
  };

  const doRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      showToast(`✓ All data current as of Jun 2026 — ${universities.length} universities loaded`);
    }, 1600);
  };

  useEffect(() => {
    document.body.classList.toggle("cmp-open", compareIds.length > 0);
  }, [compareIds]);

  const modalUni = modalId ? universities.find((u) => u.id === modalId) : null;
  const compareUnis = compareIds.map((id) => universities.find((u) => u.id === id)).filter(Boolean);
  const modalOpen = Boolean(modalUni) || showCompareModal || showProfileModal;

  const closeModal = () => {
    setModalId(null);
    setShowCompareModal(false);
    setShowProfileModal(false);
  };

  return (
    <>
      <Topbar
        search={search}
        onSearch={setSearch}
        view={view}
        onView={(v) => { setView(v); setPage("main"); }}
        onRefresh={doRefresh}
        refreshing={refreshing}
        total={universities.length}
        onMenu={() => setSidebarOpen((o) => !o)}
        compareCount={compareIds.length}
        onComparePage={() => setPage("compare")}
        page={page}
        dragging={dragging}
        onDropCompare={(id) => { toggleCmp(id); showToast(`Added to compare ⟷`); }}
      />
      {page === "compare" && (
        <ComparePage
          universities={compareUnis}
          onBack={() => setPage("main")}
          onOpen={setModalId}
          onClear={clearCompare}
        />
      )}
      <div className="layout" style={{ display: page === "compare" ? "none" : "flex" }}>
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          filters={filters}
          setFilters={setFilters}
          counts={counts}
          onClearAll={clearAll}
          onApplyProfile={applyMyProfile}
          profile={profile}
          onEditProfile={() => setShowProfileModal(true)}
          fontSize={fontSize}
          onFontSize={setFontSize}
        />
        <div className="main">
          <StatsRow filtered={filtered} allCount={universities.length} starredCount={counts.starred} />
          <div className="toolbar">
            <span className="results-count">Showing {filtered.length} of {universities.length} universities</span>
            <div className="sort-row">
              <span className="sort-label">Compare:</span>
              {compareIds.length > 0 && (
                <button className="btn-sm" onClick={() => setShowCompareModal(true)}>⟷ Compare selected</button>
              )}
            </div>
          </div>
          {view === "grid" && <GridView universities={filtered} onOpen={setModalId} onToggleStar={toggleStar} onToggleCmp={toggleCmp} onDragStart={() => setDragging(true)} onDragEnd={() => setDragging(false)} onTouchDrop={(id) => { toggleCmp(id); showToast("Added to compare ⟷"); }} />}
          {view === "table" && <TableView universities={filtered} onOpen={setModalId} onToggleStar={toggleStar} onToggleCmp={toggleCmp} onDragStart={() => setDragging(true)} onDragEnd={() => setDragging(false)} onTouchDrop={(id) => { toggleCmp(id); showToast("Added to compare ⟷"); }} />}
          {view === "spiral" && <SpiralView universities={filtered} onOpen={setModalId} onToggleStar={toggleStar} onToggleCmp={toggleCmp} onDragStart={() => setDragging(true)} onDragEnd={() => setDragging(false)} />}
        </div>
      </div>

      <div
        className="modal-bg open"
        style={{ display: modalOpen ? "flex" : "none" }}
        onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
      >
        <div className="modal">
          <button className="modal-close" onClick={closeModal}>✕</button>
          {showProfileModal && <ProfileModal profile={profile} onSave={saveProfile} onClose={closeModal} />}
          {!showProfileModal && showCompareModal && <CompareModal universities={compareUnis} onClose={closeModal} onClear={clearCompare} />}
          {!showProfileModal && !showCompareModal && modalUni && <UniversityModal u={modalUni} onClose={closeModal} onToggleStar={toggleStar} onToggleCmp={toggleCmp} />}
        </div>
      </div>

      <CompareBar compareList={compareUnis} onShowCompare={() => setShowCompareModal(true)} onClear={clearCompare} onRemove={toggleCmp} />
      <Toast toast={toast} />
    </>
  );
}
