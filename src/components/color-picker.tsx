"use client";

import { useState, useEffect } from "react";
import { Palette } from "lucide-react";
import { COLOR_THEMES, DEFAULT_THEME_ID, type ColorTheme } from "@/lib/color-themes";
import { cn } from "@/lib/utils";

function applyTheme(theme: ColorTheme) {
  document.documentElement.style.setProperty("--app-primary", theme.primary);
  document.documentElement.style.setProperty("--app-primary-shadow", theme.shadow);
  try { localStorage.setItem("app-color-theme", theme.id); } catch {}
}

export function ColorPicker() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(DEFAULT_THEME_ID);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("app-color-theme");
      if (saved) setActiveId(saved);
    } catch {}
  }, []);

  function pick(theme: ColorTheme) {
    setActiveId(theme.id);
    applyTheme(theme);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        title="Theme color"
      >
        <Palette className="h-4 w-4" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div className="absolute right-0 top-10 z-50 rounded-xl border border-border bg-popover p-3 shadow-lg w-48">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground mb-2.5 px-1">
              Theme color
            </p>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => pick(theme)}
                  title={theme.label}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all hover:bg-muted",
                    activeId === theme.id && "bg-muted ring-2 ring-offset-1 ring-offset-popover"
                  )}
                  style={activeId === theme.id ? { "--tw-ring-color": theme.primary } as React.CSSProperties : {}}
                >
                  <span
                    className="h-6 w-6 rounded-full border-2 border-white/30 shadow-sm"
                    style={{
                      backgroundColor: theme.primary,
                      boxShadow: `0 2px 0 ${theme.shadow}`,
                    }}
                  />
                  <span className="text-[10px] font-bold text-muted-foreground leading-none">
                    {theme.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
