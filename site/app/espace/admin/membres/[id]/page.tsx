import Link from "next/link";
import { notFound } from "next/navigation";
import { addCall, deleteCall, removeMember, saveDelivery, saveMicroapp, updateMember, updatePayment } from "../../actions";
import { balance, money } from "@/lib/payment";
import { Confirm } from "@/components/Confirm";
import { OfferName, Plus } from "@/components/Offer";
import { Submit } from "@/components/Submit";
import { getBundle, getMember } from "@/lib/data";
import { MICRO_STEPS } from "@/lib/microapp";
import { DELIVERIES, DELIVERY_STATUS, DEPART, LESSONS, MICROAPP_STEPS, MODULES } from "@/lib/programme";
import { daysLeft, fmt, weekOf } from "@/lib/time";

export async function generateMetadata({ params }: PageProps<"/espace/admin/membres/[id]">) {
  const m = await getMember((await params).id);
  return { title: m?.full_name || "Membre" };
}

export default async function MemberPage({ params }: PageProps<"/espace/admin/membres/[id]">) {
  const { id } = await params;
  const m = await getMember(id);
  if (!m) notFound();
  const { completions, calls, microapp, deliveries, answers } = await getBundle(id);
  const answer = new Map(answers.filter((a) => a.answer.trim()).map((a) => [a.item_key, a]));
  const dep = DEPART.filter((d) => byKeyHas(completions, d.key)).length;
  const les = LESSONS.filter((l) => byKeyHas(completions, l.key)).length;
  const step = microapp?.step ?? 0;
  const left = daysLeft(m.end_date);
  const byKey = new Map(completions.map((c) => [c.item_key, c]));
  const dByKey = new Map(deliveries.map((d) => [d.item_key, d]));

  const Item = ({ k, title }: { k: string; title: string }) => {
    const c = byKey.get(k);
    return (
      <li className={`mini${c ? " on" : ""}`}>
        <span className="mini-dot" aria-hidden="true" />
        <span className="mini-title">{title}</span>
        {c?.link && <a className="link small" href={c.link} target="_blank" rel="noopener noreferrer">Livrable</a>}
      </li>
    );
  };

  return (
    <div className="rise">
      <Link href="/espace/admin" className="back muted">← Membres</Link>
      <header className="head">
        <p className="label">{m.user_id ? `Dernière visite ${m.last_seen ? fmt.long(m.last_seen) : "inconnue"}` : "Jamais connecté"}</p>
        <div className="head-row">
          <h1 className="display">{m.full_name || m.email}</h1>
          <span className="pill pill-ink"><OfferName offer={m.offer} /> · semaine {weekOf(m.start_date)}</span>
        </div>
        <p>{m.email}</p>
      </header>

      <section className="kpis">
        <div className={`kpi${!m.paid || balance(m) > 0 ? " kpi-warn" : ""}`}>
          <span className="label">Paiement</span>
          <span className="kpi-num num">{balance(m) > 0 ? money(balance(m)) : "Payé"}</span>
          <span className="muted small">{balance(m) > 0 ? `Solde · ${money(m.paid_amount)} versés sur ${money(m.price ?? 0)}` : `${money(m.paid_amount)} versés`}{m.paid ? "" : " · accès fermé"}</span>
        </div>
        <div className="kpi">
          <span className="label">Le départ</span>
          <span className="kpi-num num">{dep}<small>/{DEPART.length}</small></span>
          <span className="bar"><i style={{ width: `${(dep / DEPART.length) * 100}%` }} /></span>
        </div>
        <div className="kpi">
          <span className="label">Programme</span>
          <span className="kpi-num num">{les}<small>/{LESSONS.length}</small></span>
          <span className="bar"><i style={{ width: `${(les / LESSONS.length) * 100}%` }} /></span>
        </div>
        <div className="kpi">
          <span className="label">Fin de l&apos;accès</span>
          <span className="kpi-num num">{left < 0 ? "Terminé" : `J-${left}`}</span>
          <span className="muted small">{fmt.full(m.end_date)}</span>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <h2>Paiement</h2>
          <a className="link" href={`/contrat?m=${id}`} target="_blank" rel="noopener">Voir son contrat</a>
        </div>
        <form action={updatePayment.bind(null, id)} className={`card form pay-admin${m.paid ? " is-paid" : ""}`}>
          <label className="switch">
            <input id="paid" name="paid" type="checkbox" defaultChecked={m.paid} />
            <span className="switch-ui" aria-hidden="true" />
            <span><strong>{m.paid ? "Payé, accès ouvert" : "En attente, accès fermé"}</strong><br /><span className="muted small">Coche quand le contrat signé et le solde sont reçus.</span></span>
          </label>
          <div className="form-row">
            <label className="field"><span>Prix total</span><input id="price" name="price" inputMode="numeric" defaultValue={m.price ?? ""} /></label>
            <label className="field"><span>Déjà versé</span><input id="paid_amount" name="paid_amount" inputMode="numeric" defaultValue={m.paid_amount} /></label>
            <div className="field"><span>Solde</span><div className="pay-solde num">{money(balance(m))}</div></div>
          </div>
          <label className="field"><span>Échéances (visibles dans le contrat et l&apos;écran de paiement)</span><input id="due_note" name="due_note" defaultValue={m.due_note ?? ""} placeholder="Solde avant le premier appel 1:1" /></label>
          <div><Submit>Enregistrer</Submit></div>
        </form>
      </section>

      <section className="section">
        <div className="section-head"><h2>Missions</h2><span className="muted">{completions.length} cochées</span></div>
        <div className="mini-grid">
          <div>
            <p className="label">Le départ</p>
            <ul className="minis">{DEPART.map((d) => <Item key={d.key} k={d.key} title={d.title} />)}</ul>
          </div>
          {MODULES.map((mod) => (
            <div key={mod.slug}>
              <p className="label">{mod.number} {mod.title}</p>
              <ul className="minis">{mod.lessons.map((l) => <Item key={l.key} k={l.key} title={l.mission} />)}</ul>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head" id="ecrit"><h2>Ses réponses</h2><span className="muted">{answer.size} réponses</span></div>
        {answer.size === 0 ? (
          <p className="empty">Rien d&apos;écrit pour l&apos;instant.</p>
        ) : (
          <div className="written">
            {[
              ...DEPART.map((d) => ({ key: d.key, title: d.title, group: "Le départ" })),
              ...LESSONS.map((l) => ({ key: l.key, title: l.title, group: `Leçon ${l.module.number}·${l.key.split(".")[1]}` })),
              ...MICRO_STEPS.flatMap((st) => (st.fields ?? []).map((f) => ({ key: f.key, title: f.label, group: `Micro-app · ${st.title}` }))),
            ]
              .filter((x) => answer.has(x.key))
              .map((x) => {
                const a = answer.get(x.key)!;
                const isLink = /^https?:\/\/\S+$/.test(a.answer.trim());
                return (
                  <details key={x.key} className="written-item">
                    <summary>
                      <span className="label">{x.group}</span>
                      <span className="written-title">{x.title}</span>
                      <span className="muted small">{fmt.short(a.updated_at)}</span>
                    </summary>
                    {isLink ? (
                      <a className="link" href={a.answer.trim()} target="_blank" rel="noopener noreferrer">{a.answer.trim()}</a>
                    ) : (
                      <p className="brand-answer">{a.answer}</p>
                    )}
                  </details>
                );
              })}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head"><h2>Appels 1:1</h2><span className="muted">{calls.length}</span></div>
        <form action={addCall.bind(null, id)} className="card form">
          <div className="form-row">
            <label className="field"><span>Date</span><input id="held_on" name="held_on" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label>
            <label className="field"><span>Titre</span><input id="title" name="title" placeholder="Premier appel" /></label>
            <label className="field"><span>Enregistrement</span><input id="recording_url" name="recording_url" type="url" placeholder="Lien Fathom, Loom…" /></label>
          </div>
          <div className="form-row">
            <label className="field"><span>Résumé</span><textarea id="summary" name="summary" /></label>
            <label className="field"><span>Pour le prochain</span><textarea id="next_steps" name="next_steps" /></label>
          </div>
          <div><Submit>Ajouter l&apos;appel</Submit></div>
        </form>
        {calls.length > 0 && (
          <div className="list">
            {calls.map((c) => (
              <div key={c.id} className="session">
                <span className="num">{fmt.long(c.held_on)}</span>
                <span>{c.title || "Appel"}{c.recording_url ? " · enregistré" : ""}</span>
                <form action={deleteCall.bind(null, id, c.id)}><Confirm message="Supprimer cet appel ?">Supprimer</Confirm></form>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head"><h2>Micro-app</h2><a className="link" href="#ecrit">Voir ses réponses</a></div>
        <div className="ma-admin">
          {MICRO_STEPS.map((st, i) => {
            const tasks = st.tasks.filter((t) => !t.level || t.level <= (microapp?.level ?? 1));
            const n = tasks.filter((t) => byKeyHas(completions, t.key)).length;
            return (
              <div key={st.title} className={`ma-admin-step${i < step ? " done" : i === step ? " cur" : ""}`}>
                <span className="label">{i + 1}. {st.title}</span>
                <span className="num">{n}/{tasks.length}</span>
                <span className="bar"><i style={{ width: `${tasks.length ? (n / tasks.length) * 100 : 0}%` }} /></span>
              </div>
            );
          })}
        </div>
        <form action={saveMicroapp.bind(null, id)} className="card form">
          <div className="form-row">
            <label className="field">
              <span>Niveau</span>
              <select id="level" name="level" defaultValue={microapp?.level ?? 1}>
                <option value={1}>1 · page-outil</option>
                <option value={2}>2 · mini-app</option>
              </select>
            </label>
            <label className="field">
              <span>Étape validée (le membre voit « En cours » sur celle-ci)</span>
              <select id="step" name="step" defaultValue={microapp?.step ?? 0}>
                {MICROAPP_STEPS.map((s, i) => <option key={s.title} value={i}>{i + 1}. {s.title}</option>)}
                <option value={6}>Terminée</option>
              </select>
            </label>
            <label className="field"><span>Adresse en ligne</span><input id="url" name="url" type="url" defaultValue={microapp?.url ?? ""} /></label>
          </div>
          <label className="field"><span>Le mot de Gael</span><textarea id="note" name="note" defaultValue={microapp?.note ?? ""} /></label>
          <div><Submit>Enregistrer</Submit></div>
        </form>
      </section>

      {m.offer === "nota_plus" && (
        <section className="section">
          <div className="section-head"><h2>Livraisons Nota<Plus /></h2></div>
          <div className="list">
            {DELIVERIES.map((it) => {
              const d = dByKey.get(it.key);
              return (
                <form key={it.key} action={saveDelivery.bind(null, id, it.key)} className="delivery-edit">
                  <span>{it.title}</span>
                  <select name="status" aria-label={`Statut : ${it.title}`} defaultValue={d?.status ?? "a_venir"} className="input">
                    {Object.entries(DELIVERY_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <input name="link" type="url" aria-label={`Lien : ${it.title}`} placeholder="Lien" defaultValue={d?.link ?? ""} className="input" />
                  <Submit className="btn btn-ghost btn-sm">OK</Submit>
                </form>
              );
            })}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head"><h2>Fiche</h2></div>
        <form action={updateMember.bind(null, id)} className="card form">
          <div className="form-row">
            <label className="field"><span>Prénom et nom</span><input id="m_full_name" name="full_name" defaultValue={m.full_name} /></label>
            <label className="field">
              <span>Formule</span>
              <select id="m_offer" name="offer" defaultValue={m.offer}>
                <option value="nota">Nota</option>
                <option value="nota_plus">Nota+</option>
                <option value="repli">Nota, sans groupe</option>
              </select>
            </label>
            <label className="field">
              <span>Rôle</span>
              <select id="m_role" name="role" defaultValue={m.role}>
                <option value="member">Membre</option>
                <option value="admin">Admin</option>
              </select>
            </label>
          </div>
          <div className="form-row">
            <label className="field"><span>Début</span><input id="m_start" name="start_date" type="date" defaultValue={m.start_date} /></label>
            <label className="field"><span>Fin de l&apos;accès</span><input id="m_end" name="end_date" type="date" defaultValue={m.end_date} /></label>
          </div>
          <div className="form-foot">
            <Submit>Enregistrer</Submit>
          </div>
        </form>
        <form action={removeMember.bind(null, id)} className="danger">
          <span className="muted">Retirer l&apos;accès efface ses missions, ses chiffres et ses appels.</span>
          <Confirm message={`Retirer l'accès de ${m.full_name || m.email} ? Tout sera effacé.`}>Retirer l&apos;accès</Confirm>
        </form>
      </section>
    </div>
  );
}

function byKeyHas(list: { item_key: string }[], key: string) {
  return list.some((c) => c.item_key === key);
}
