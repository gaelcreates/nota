import Link from "next/link";
import { InviteForm } from "./InviteForm";
import { getSettings, listMembers, type MemberRow } from "@/lib/data";
import { OfferName } from "@/components/Offer";
import { balance, money } from "@/lib/payment";
import { MICRO_STEPS } from "@/lib/microapp";
import { DEPART, LESSONS, ONE_TO_ONE_WEEKS } from "@/lib/programme";
import { daysLeft, fmt, isEnded, weekOf } from "@/lib/time";

export const metadata = { title: "Admin" };

const DAY = 86_400_000;

// Dernier signe de vie : une visite ou une mission cochée
function lastActivity(m: MemberRow) {
  const dates = [m.last_seen, m.last_done].filter(Boolean) as string[];
  return dates.sort().at(-1) ?? null;
}
function quietDays(m: MemberRow) {
  const last = lastActivity(m);
  return last ? Math.floor((Date.now() - new Date(last).getTime()) / DAY) : null;
}
const ago = (d: number | null) => (d == null ? "Jamais" : d === 0 ? "Aujourd'hui" : d === 1 ? "Hier" : `Il y a ${d} j`);

const FILTERS = [
  { key: "", label: "Tous" },
  { key: "encaisser", label: "À encaisser" },
  { key: "silence", label: "Sans nouvelles" },
  { key: "fin", label: "Fin proche" },
  { key: "termines", label: "Terminés" },
] as const;

export default async function Admin({ searchParams }: PageProps<"/espace/admin">) {
  const { f = "" } = (await searchParams) as { f?: string };
  const [all, settings] = await Promise.all([listMembers(), getSettings()]);
  const cur = settings.currency || "EUR";
  const members = all.filter((m) => m.role !== "admin");
  const active = members.filter((m) => !isEnded(m.end_date));

  const owed = active.filter((m) => balance(m) > 0);
  const toCollect = owed.reduce((s, m) => s + balance(m), 0);
  const collected = members.reduce((s, m) => s + (m.paid_amount ?? 0), 0);
  const silent = active.filter((m) => m.paid && (quietDays(m) ?? 99) >= 7);
  const ending = active.filter((m) => daysLeft(m.end_date) <= 30);
  const solo = active.filter((m) => weekOf(m.start_date) <= ONE_TO_ONE_WEEKS).length;

  const lists: Record<string, MemberRow[]> = {
    "": members,
    encaisser: owed,
    silence: silent,
    fin: ending,
    termines: members.filter((m) => isEnded(m.end_date)),
  };
  const shown = lists[f] ?? members;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="rise">
      <header className="head">
        <div className="head-row">
          <h1 className="display">Les <span className="hl">membres</span></h1>
          <details className="invite-pop">
            <summary className="btn">Inviter un membre</summary>
            <div className="card invite-card"><InviteForm today={today} /></div>
          </details>
        </div>
      </header>

      <section className="kpis">
        <div className="kpi">
          <span className="label">Actifs</span>
          <span className="kpi-num num">{active.length}</span>
          <span className="muted small">{solo} en suivi 1:1</span>
        </div>
        <Link href="/espace/admin?f=encaisser" className={`kpi${toCollect > 0 ? " kpi-warn" : ""}`}>
          <span className="label">À encaisser</span>
          <span className="kpi-num num">{money(toCollect, cur)}</span>
          <span className="muted small">{owed.length} {owed.length > 1 ? "soldes ouverts" : "solde ouvert"}</span>
        </Link>
        <div className="kpi">
          <span className="label">Encaissé</span>
          <span className="kpi-num num">{money(collected, cur)}</span>
          <span className="muted small">Depuis le début</span>
        </div>
        <Link href="/espace/admin?f=silence" className={`kpi${silent.length > 0 ? " kpi-warn" : ""}`}>
          <span className="label">Sans nouvelles</span>
          <span className="kpi-num num">{silent.length}</span>
          <span className="muted small">Rien depuis 7 jours ou plus</span>
        </Link>
      </section>

      <nav className="chips" aria-label="Filtrer">
        {FILTERS.map((x) => (
          <Link key={x.key} href={x.key ? `/espace/admin?f=${x.key}` : "/espace/admin"} aria-current={f === x.key ? "page" : undefined} className="chip">
            {x.label}
            <span className="num">{lists[x.key].length}</span>
          </Link>
        ))}
      </nav>

      <section className="section" style={{ marginTop: 18 }}>
        {shown.length === 0 ? (
          <p className="empty">{members.length === 0 ? "Personne pour l'instant. Invite ton premier membre avec le bouton en haut." : "Personne dans cette liste."}</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Membre</th>
                  <th>Paiement</th>
                  <th>Semaine</th>
                  <th>Départ</th>
                  <th>Programme</th>
                  <th>Micro-app</th>
                  <th>Activité</th>
                  <th>Fin</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((m) => {
                  const d = DEPART.filter((x) => m.done.includes(x.key)).length;
                  const p = LESSONS.filter((x) => m.done.includes(x.key)).length;
                  const left = daysLeft(m.end_date);
                  const quiet = quietDays(m);
                  const owes = balance(m);
                  const name = m.full_name || m.email;
                  const step = m.micro_step ?? 0;
                  return (
                    <tr key={m.id} className="click">
                      <td>
                        <Link href={`/espace/admin/membres/${m.id}`} className="stretch member-cell">
                          <span className="avatar" aria-hidden="true">{name.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase()}</span>
                          <span className="member-id">
                            <span className="who-name">{name}</span>
                            <span className="muted small"><OfferName offer={m.offer} />{m.user_id ? "" : " · jamais connecté"}</span>
                          </span>
                        </Link>
                      </td>
                      <td>
                        {m.paid && owes === 0 ? (
                          <span className="pill pill-dot pill-ink">Payé</span>
                        ) : (
                          <div className="cell-bar">
                            <span className={m.paid ? "small" : "small warn"}>{m.paid ? "Accès ouvert · " : ""}Solde {money(owes, cur)}</span>
                            <div className="bar mini-bar"><i style={{ width: `${m.price ? ((m.paid_amount ?? 0) / m.price) * 100 : 0}%` }} /></div>
                          </div>
                        )}
                      </td>
                      <td className="num">{isEnded(m.end_date) ? "—" : weekOf(m.start_date)}</td>
                      <td><div className="cell-bar"><span className="num">{d}/{DEPART.length}</span><div className="bar mini-bar"><i style={{ width: `${(d / DEPART.length) * 100}%` }} /></div></div></td>
                      <td><div className="cell-bar"><span className="num">{p}/{LESSONS.length}</span><div className="bar mini-bar"><i style={{ width: `${(p / LESSONS.length) * 100}%` }} /></div></div></td>
                      <td className="small">{step >= 6 ? "En ligne" : `${step + 1}. ${MICRO_STEPS[step].title}`}</td>
                      <td className={quiet == null || quiet >= 7 ? "warn small" : "small"}>{ago(quiet)}</td>
                      <td className={left < 0 ? "muted small" : left <= 30 ? "warn small" : "small"}>{left < 0 ? "Terminé" : fmt.short(m.end_date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
