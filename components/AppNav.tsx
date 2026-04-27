"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  ListChecks,
  Cpu,
  Brain,
  Shield,
  FileCheck,
  MapPin,
  TrendingUp,
  Award,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useElectraStore } from "@/store/electra-store";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/timeline", label: "Timeline", icon: ListChecks },
  { href: "/simulator", label: "Simulator", icon: Cpu },
  { href: "/quiz", label: "Quiz", icon: Brain },
  { href: "/myths", label: "Myths", icon: Shield },
  { href: "/documents", label: "Documents", icon: FileCheck },
  { href: "/booth", label: "Booth", icon: MapPin },
  { href: "/confidence", label: "Confidence", icon: TrendingUp },
  { href: "/passport", label: "Passport", icon: Award },
];

export function AppNav() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const name = useElectraStore((s) => s.profile.name);

  return (
    <>
      {/* Desktop top nav */}
      <header className="sticky top-0 z-50 hidden border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-lg md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1A56DB] text-white text-sm font-bold">V</div>
            <span className="text-lg font-medium">VoteReady</span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-[#1A56DB]/10 text-[#1A56DB] dark:bg-[#1A56DB]/20 dark:text-[#4c84ff]"
                      : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            {name && (
              <span className="text-sm text-[var(--muted-foreground)]">
                Hi, <span className="font-medium text-[var(--foreground)]">{name}</span>
              </span>
            )}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] transition hover:bg-[var(--border)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-lg md:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {[NAV_ITEMS[0], NAV_ITEMS[1], NAV_ITEMS[2], NAV_ITEMS[4], NAV_ITEMS[8]].map((item) => {
            if (!item) return null;
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-2 py-1 text-xs transition",
                  active
                    ? "text-[#1A56DB] dark:text-[#4c84ff]"
                    : "text-[var(--muted-foreground)]"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
