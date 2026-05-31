"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import {
  BookOpen, LayoutGrid, RotateCcw, BarChart2,
  Sun, Moon, LogOut, GraduationCap, FileText, Menu, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/actions/auth";
import { ColorPicker } from "@/components/color-picker";

const links = [
  { href: "/",           label: "Home",    icon: LayoutGrid },
  { href: "/vocabulary", label: "Words",   icon: BookOpen },
  { href: "/review",     label: "Review",  icon: RotateCcw },
  { href: "/notes",      label: "Notes",   icon: FileText },
  { href: "/grammar",    label: "Grammar", icon: GraduationCap },
  { href: "/stats",      label: "Stats",   icon: BarChart2 },
];

interface NavProps {
  user?: { name?: string | null; email?: string | null; image?: string | null };
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function Nav({ user }: NavProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">

          {/* Brand */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white text-sm font-black select-none"
              style={{ backgroundColor: "var(--app-primary)", boxShadow: "0 3px 0 var(--app-primary-shadow)" }}
            >
              L
            </span>
            <span className="font-extrabold tracking-tight text-sm" style={{ color: "var(--app-primary)" }}>
              Learn Vocabulary
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {links.map(({ href, label, icon: Icon }) => {
              const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold transition-all",
                    active
                      ? "bg-[var(--app-primary)]/15 text-[var(--app-primary)]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
            <div className="mx-1 h-5 w-px bg-border" />
            <ColorPicker />
            <ThemeToggle />
            {user && (
              <div className="flex items-center gap-1 ml-1">
                {user.image ? (
                  <Image src={user.image} alt={user.name ?? "User"} width={28} height={28} loading="eager" className="rounded-full border-2 border-border" />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold" style={{ backgroundColor: "color-mix(in srgb, var(--app-primary) 20%, transparent)", color: "var(--app-primary)" }}>
                    {user.name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
                <form action={signOutAction}>
                  <button type="submit" className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-[#ff4b4b] transition-colors" title="Sign out">
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            )}
          </nav>

          {/* Mobile right side */}
          <div className="flex md:hidden items-center gap-1">
            <ColorPicker />
            <ThemeToggle />
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-foreground hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer backdrop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "fixed right-0 top-0 bottom-0 z-50 w-72 bg-background border-l border-border flex flex-col transition-transform duration-300 ease-in-out md:hidden",
          drawerOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 h-14 border-b border-border shrink-0">
          <span className="font-extrabold tracking-tight text-sm" style={{ color: "var(--app-primary)" }}>
            Learn Vocabulary
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="flex items-center gap-3 px-5 py-4 border-b border-border shrink-0">
            {user.image ? (
              <Image src={user.image} alt={user.name ?? "User"} width={36} height={36} className="rounded-full border-2 border-border" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold" style={{ backgroundColor: "color-mix(in srgb, var(--app-primary) 20%, transparent)", color: "var(--app-primary)" }}>
                {user.name?.[0]?.toUpperCase() ?? "U"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-extrabold truncate">{user.name ?? "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all",
                  active
                    ? "text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                style={active ? { backgroundColor: "var(--app-primary)" } : {}}
              >
                <Icon className="h-4.5 w-4.5 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Drawer footer */}
        <div className="border-t border-border px-4 py-4 space-y-2 shrink-0">
          {user && (
            <form action={signOutAction} className="w-full">
              <button
                type="submit"
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-muted-foreground hover:bg-[#ff4b4b]/10 hover:text-[#ff4b4b] transition-colors"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                Sign out
              </button>
            </form>
          )}
        </div>
      </aside>
    </>
  );
}
