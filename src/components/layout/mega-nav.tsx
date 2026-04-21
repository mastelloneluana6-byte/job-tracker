"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { QuickAddLauncher } from "@/components/tracker/quick-add-launcher";

const nav = [
  {
    id: "dashboard",
    label: "Dashboard",
    href: "/",
    blurb: "Overview of Scope and how the workflow fits together.",
  },
  {
    id: "tracker",
    label: "Tracker",
    href: "/tracker",
    blurb: "Pipeline, statuses, notes, and listings in one board.",
  },
  {
    id: "import",
    label: "Job importer",
    href: "/import",
    blurb: "Paste a listing URL or add a role manually — preview, edit, save.",
  },
  {
    id: "email",
    label: "Email generator",
    href: "/tracker",
    blurb:
      "Open any application on the Tracker and use “Generate email” for follow-ups, thank-yous, and outreach (same modal as before).",
  },
] as const;

function LogoMark() {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#c9a227]/30 bg-[var(--accent-soft)] text-sm font-bold tracking-tight text-[#d4af37]"
      aria-hidden
    >
      S
    </div>
  );
}

export function MegaNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenPanel(null), 160);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-zinc-950/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 transition hover:opacity-95"
        >
          <LogoMark />
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-zinc-500">
              Scope
            </p>
            <p className="truncate text-sm font-semibold tracking-tight text-zinc-50 sm:text-base">
              Job search workspace
            </p>
          </div>
        </Link>

        <button
          type="button"
          className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.1] text-zinc-300 lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="sr-only">Menu</span>
          {mobileOpen ? "✕" : "☰"}
        </button>

        <nav
          className="relative ml-auto hidden items-center gap-1 lg:flex"
          onMouseLeave={scheduleClose}
        >
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  (item.href === "/tracker" && pathname.startsWith("/tracker"));
            return (
              <div
                key={item.id}
                className="relative"
                onMouseEnter={() => {
                  cancelClose();
                  setOpenPanel(item.id);
                }}
              >
                <Link
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-white/[0.1] text-[#f0d78c]"
                      : "text-zinc-300 hover:bg-white/[0.06] hover:text-zinc-50"
                  }`}
                >
                  {item.label}
                </Link>
                {openPanel === item.id && (
                  <div
                    className="absolute left-0 top-full z-50 pt-2"
                    onMouseEnter={cancelClose}
                  >
                    <div className="w-72 rounded-xl border border-white/[0.1] bg-zinc-900/98 p-4 shadow-2xl shadow-black/50 backdrop-blur-md">
                      <p className="text-xs leading-relaxed text-zinc-400">
                        {item.blurb}
                      </p>
                      <Link
                        href={item.href}
                        className="mt-3 inline-flex rounded-lg bg-gradient-to-b from-[#d4af37] to-[#9a7b1a] px-3 py-2 text-xs font-semibold text-zinc-950 shadow-md shadow-[#c9a227]/20 transition hover:brightness-110"
                      >
                        Go to {item.label.toLowerCase()}
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div className="ml-2 pl-2 border-l border-white/[0.08]">
            <QuickAddLauncher />
          </div>
        </nav>
      </div>

      {mobileOpen && (
        <div
          id="mobile-nav"
          className="border-t border-white/[0.06] bg-zinc-950/95 px-5 py-4 lg:hidden"
        >
          <ul className="flex flex-col gap-1">
            {nav.map((item) => (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="block rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-200 hover:bg-white/[0.06]"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                <p className="px-3 pb-2 text-[11px] leading-relaxed text-zinc-500">
                  {item.blurb}
                </p>
              </li>
            ))}
            <li className="pt-2">
              <QuickAddLauncher className="w-full" />
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
