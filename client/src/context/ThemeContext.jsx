import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CORNER_MAP = {
  Sharp: { card: "8px", panel: "12px", btn: "10px" },
  Soft: { card: "18px", panel: "22px", btn: "999px" },
  Rounded: { card: "26px", panel: "30px", btn: "999px" },
};

const DEFAULTS = {
  accent: "#1d4ed8",
  corners: "Soft", // Sharp | Soft | Rounded
  motion: "Lively", // Calm | Lively
  meetupUrl: "https://www.meetup.com/business4-0",
};

const ThemeContext = createContext(DEFAULTS);

export function ThemeProvider({ children, ...overrides }) {
  const [theme, setTheme] = useState({ ...DEFAULTS, ...overrides });

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--b4-accent", theme.accent || DEFAULTS.accent);

    const corners = CORNER_MAP[theme.corners] || CORNER_MAP.Soft;
    root.setProperty("--b4-card", corners.card);
    root.setProperty("--b4-panel", corners.panel);
    root.setProperty("--b4-btn", corners.btn);
  }, [theme.accent, theme.corners]);

  const value = useMemo(() => ({ ...theme, setTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
