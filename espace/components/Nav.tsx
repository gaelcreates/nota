"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type NavItem = { href: string; label: string; count?: string; sep?: boolean };

export function Nav({ items }: { items: NavItem[] }) {
  const path = usePathname();
  const active = (href: string) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));
  return (
    <nav className="nav" aria-label="Navigation">
      {items.map((it) => (
        <span key={it.href} style={{ display: "contents" }}>
          {it.sep && <span className="nav-sep" aria-hidden="true" />}
          <Link href={it.href} aria-current={active(it.href) ? "page" : undefined}>
            {it.label}
            {it.count && <span className="count">{it.count}</span>}
          </Link>
        </span>
      ))}
    </nav>
  );
}
