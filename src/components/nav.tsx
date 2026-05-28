"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/theme-provider";
import { BookOpen, LayoutGrid, RotateCcw, Sun, Moon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/actions/auth";

const links = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/vocabulary", label: "Words", icon: BookOpen },
  { href: "/review", label: "Review", icon: RotateCcw },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

interface NavProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function Nav({ user }: NavProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">

        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#58cc02] shadow-[0_3px_0_#46a302] text-white text-sm font-black select-none">
            L
          </span>
          <span className="hidden font-extrabold tracking-tight text-[#58cc02] sm:inline text-sm">
            LearnVocabulary
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-0.5">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-bold transition-all",
                  active
                    ? "bg-[#58cc02]/15 text-[#58cc02]"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          <div className="mx-1 h-5 w-px bg-border" />
          <ThemeToggle />

          {/* User avatar + sign out */}
          {user && (
            <div className="flex items-center gap-1 ml-1">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name ?? "User"}
                  width={28}
                  height={28}
                  className="rounded-full border-2 border-border"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#58cc02]/20 text-xs font-bold text-[#58cc02]">
                  {user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-[#ff4b4b] transition-colors"
                  title="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
