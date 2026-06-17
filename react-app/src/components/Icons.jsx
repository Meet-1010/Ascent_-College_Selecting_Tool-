// Themed SVG icon components — all use currentColor to inherit theme colors

export const PinIcon = ({ size = 13, className = "", style }) => (
  <svg className={className} style={{ flexShrink: 0, ...style }} width={size} height={Math.round(size * 1.3)} viewBox="0 0 10 13" fill="currentColor" aria-hidden="true">
    <path d="M5 0C2.79 0 1 1.79 1 4c0 3 4 9 4 9s4-6 4-9c0-2.21-1.79-4-4-4zm0 5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
  </svg>
);

export const CrownIcon = ({ size = 16, className = "", style }) => (
  <svg className={className} style={style} width={size} height={Math.round(size * 0.75)} viewBox="0 0 24 18" fill="currentColor" aria-hidden="true">
    <path d="M2 15 L2 10 L7 14 L12 3 L17 14 L22 10 L22 15 Z"/>
    <rect x="2" y="15" width="20" height="3" rx="1.5"/>
  </svg>
);

export const TargetIcon = ({ size = 14, className = "", style }) => (
  <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
  </svg>
);

export const SearchIcon = ({ size = 16, className = "", style }) => (
  <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="7.5"/>
    <line x1="16.5" y1="16.5" x2="22" y2="22"/>
  </svg>
);

export const EliteStarIcon = ({ size = 12, className = "", style }) => (
  <svg className={className} style={style} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/>
  </svg>
);

// Tour step icons — larger, decorative
export const GradCapIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
  </svg>
);

export const SpiralTourIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"/>
    <path d="M7 12a5 5 0 0 1 5-5 7 7 0 0 1 7 7 9 9 0 0 1-9 9 11 11 0 0 1-11-11"/>
  </svg>
);

export const LayoutGridIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/>
  </svg>
);

export const CompareArrowsIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14"/>
    <path d="M15 7l5 5-5 5"/>
    <path d="M9 7l-5 5 5 5"/>
  </svg>
);

export const SlidersIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
    <circle cx="8" cy="6" r="2.5" fill="currentColor" stroke="none"/>
    <circle cx="16" cy="12" r="2.5" fill="currentColor" stroke="none"/>
    <circle cx="10" cy="18" r="2.5" fill="currentColor" stroke="none"/>
  </svg>
);

export const LaunchIcon = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14M13 6l6 6-6 6"/>
    <path d="M3 6C3 4.34 4.34 3 6 3h2a8 8 0 0 1 8 8 8 8 0 0 1-8 8H6a3 3 0 0 1-3-3"/>
  </svg>
);
