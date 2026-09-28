"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/espace/admin", label: "Membres" },
  { href: "/espace/admin/groupe", label: "Appels de groupe" },
  { href: "/espace/admin/reglages", label: "Réglages" },
];

export function AdminTabs() {
  const path = usePathname();
  const on = (h: string) => (h === "/espace/admin" ? path === "/espace/admin" || path.startsWith("/espace/admin/membres") : path.startsWith(h));
  return (
    <nav className="tabs" aria-label="Admin">
      {TABS.map((t) => (
        <Link key={t.href} href={t.href} aria-current={on(t.href) ? "page" : undefined}>{t.label}</Link>
      ))}
    </nav>
  );
}
