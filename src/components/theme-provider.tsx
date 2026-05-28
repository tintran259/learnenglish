"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  useState,
} from "react";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

// Avoids the SSR "useLayoutEffect does nothing on server" warning
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function resolveTheme(): Theme {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  // Runs synchronously before first paint — no flash of wrong theme
  useIsomorphicLayoutEffect(() => {
    const t = resolveTheme();
    setThemeState(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  function setTheme(t: Theme) {
    setThemeState(t);
    document.documentElement.classList.toggle("dark", t === "dark");
    try {
      localStorage.setItem("theme", t);
    } catch {}
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
