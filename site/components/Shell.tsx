import { Brand } from "@/components/Mark";
import { Nav, type NavItem } from "@/components/Nav";
import { signOut } from "@/app/actions";
import type { Member } from "@/lib/data";
import { OfferName } from "@/components/Offer";
import { weekOf } from "@/lib/time";

export function Shell({ viewer, items, children }: { viewer: Member; items: NavItem[]; children: React.ReactNode }) {
  const first = viewer.full_name.split(" ")[0] || viewer.email;
  return (
    <div className="app">
      <aside className="rail">
        <Brand />
        <Nav items={items} />
        <div className="rail-foot">
          <a href="/espace/compte" className="who">
            <strong>{first}</strong>
            <span>
              <OfferName offer={viewer.offer} /> · semaine {weekOf(viewer.start_date)}
            </span>
          </a>
          <form action={signOut}>
            <button className="signout" type="submit">Se déconnecter</button>
          </form>
        </div>
      </aside>
      <header className="topbar">
        <div className="topbar-row">
          <Brand />
          <form action={signOut}>
            <button className="signout" type="submit">Se déconnecter</button>
          </form>
        </div>
        <Nav items={items} />
      </header>
      <main className="main">{children}</main>
    </div>
  );
}

export function Closed({ title, body }: { title: string; body: string }) {
  return (
    <div className="gate">
      <div className="gate-box rise">
        <Brand />
        <h1 className="display">{title}</h1>
        <p className="muted">{body}</p>
        <form action={signOut}>
          <button className="btn btn-ghost" type="submit">Se déconnecter</button>
        </form>
      </div>
    </div>
  );
}
