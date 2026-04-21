import type { ReactNode } from "react";
import { MegaNav } from "./mega-nav";
import { SiteFooter } from "./site-footer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <MegaNav />
      {children}
      <SiteFooter />
    </div>
  );
}
