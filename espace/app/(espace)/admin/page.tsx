import Link from "next/link";
import { InviteForm } from "./InviteForm";
import { listMembers } from "@/lib/data";
import { OfferName } from "@/components/Offer";
import { DEPART, LESSONS, ONE_TO_ONE_WEEKS } from "@/lib/programme";
import { daysLeft, fmt, isEnded, weekOf } from "@/lib/time";

export const metadata = { title: "Admin" };

export default async function Admin() {
  const members = (await listMembers()).filter((m) => m.role !== "admin");
  const active = members.filter((m) => !isEnded(m.end_date));
  const solo = active.filter((m) => weekOf(m.start_date) <= ONE_TO_ONE_WEEKS).length;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="rise">
      <header className="head">
        <div className="head-row">
          <h1 className="display">Les <span className="hl">membres</span></h1>
          <div className="head-stats">
            <span><b className="num">{active.length}</b> actifs</span>
            <span><b className="num">{solo}</b> en 1:1</span>
          </div>
        </div>
      </header>

      <details className="card invite-card">
        <summary><span className="btn btn-sm">Inviter un membre</span></summary>
        <InviteForm today={today} />
      </details>

      <section className="section">
        {members.length === 0 ? (
          <p className="muted">Personne pour l&apos;instant.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Membre</th>
                  <th>Formule</th>
                  <th>Semaine</th>
                  <th>Départ</th>
                  <th>Programme</th>
                  <th>Dernière mission</th>
                  <th>Fin</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const d = DEPART.filter((x) => m.done.includes(x.key)).length;
                  const p = LESSONS.filter((x) => m.done.includes(x.key)).length;
                  const left = daysLeft(m.end_date);
                  return (
                    <tr key={m.id} className="click">
                      <td>
                        <Link href={`/admin/membres/${m.id}`} className="stretch">
                          <span className="who-name">{m.full_name || m.email}</span>
                          <span className="muted small">{m.user_id ? m.email : `${m.email} · jamais connecté`}</span>
                        </Link>
                      </td>
                      <td><span className={`pill${m.offer === "nota_plus" ? " pill-ink" : ""}`}><OfferName offer={m.offer} /></span></td>
                      <td className="num">{isEnded(m.end_date) ? "—" : weekOf(m.start_date)}</td>
                      <td><div className="cell-bar"><span className="num">{d}/{DEPART.length}</span><div className="bar mini-bar"><i style={{ width: `${(d / DEPART.length) * 100}%` }} /></div></div></td>
                      <td><div className="cell-bar"><span className="num">{p}/{LESSONS.length}</span><div className="bar mini-bar"><i style={{ width: `${(p / LESSONS.length) * 100}%` }} /></div></div></td>
                      <td className="muted">{m.last_done ? fmt.short(m.last_done) : "—"}</td>
                      <td className={left < 0 ? "muted" : left <= 14 ? "warn" : ""}>{left < 0 ? "Terminé" : fmt.short(m.end_date)}</td>
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
