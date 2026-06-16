import { useState } from "react";

const STORAGE_KEY = "msExplorerProfile";

const DEFAULT_PROFILE = {
  greTarget: "320+",
  ieltsTarget: "7.5+",
  cgpa: "~8.0+",
  keyProject: "Impulse IDE",
  location: "Fort Worth, TX",
  locationLabel: "Brother",
};

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export default function useProfile() {
  const [profile, setProfile] = useState(load);

  const saveProfile = (next) => {
    setProfile(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* localStorage unavailable */
    }
  };

  return [profile, saveProfile];
}
