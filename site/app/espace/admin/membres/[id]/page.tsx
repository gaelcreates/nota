import Link from "next/link";
import { notFound } from "next/navigation";
import { addCall, deleteCall, enterSpace, removeMember, saveDelivery, saveMicroapp, updateMember, updatePayment } from "../../actions";
import { balance, money } from "@/lib/payment";
import { Confirm } from "@/components/Confirm";
import { OfferName, Plus } from "@/components/Offer";
import { Submit } from "@/components/Submit";
import { getBundle, getMember, type Answer } from "@/lib/data";
import { MICRO_STEPS } from "@/lib/microapp";
import { DELIVERIES, DELIVERY_STATUS, DEPART, LESSONS, MICROAPP_STEPS, MODULES } from "@/lib/programme";
import { daysLeft, fmt, weekOf } from "@/lib/time";

export async function generateMetadata({ params }: PageProps<"/espace/admin/membres/[id]">) {
  const m = await getMember((await params).id);
  return { title: m?.full_name || "Membre" };
}

const DAY = 86_400_000;
const daysSince = (d?: string) => (d ? Math.floor((Date.now() - new Date(d).getTime()) / DAY) : null);
const isLink = (s: string) => /^https?:\/\/\S+$/.test(s.trim());

// Une réponse écrite : un lien cliquable, ou le texte (replié s'il est long)
function Reply({ a }: { a: Answer | undefined }) {
  if (!a) return <span className="muted small">Rien de déposé</span>;
  const text = a.answer.trim();
  if (isLink(text)) {
    return <a className="reply-link" href={text} target="_blank" rel="noopener noreferrer">{text.replace(/^https?:\/\/(www\.)?/, "").slice(0, 48)}… ↗</a>;
  }
  return <p className="reply-text">{text}</p>;
}

export default async function MemberPage({ params }: PageProps<"/espace/admin/membres/[id]">) {
  const { id } = await params;
  const m = await getMember(id);
  if (!m) notFound();
  const { completions, calls, microapp, deliveries, answers } = await getBundle(id);
  const done = new Set(completions.map((c) => c.item_key));
  const answer = new Map(answers.filter((a) => a.answer.trim()).map((a) => [a.item_key, a]));
  const dByKey = new Map(deliveries.map((d) => [d.item_key, d]));

  const dep = DEPART.filter((d) => done.has(d.key)).length;
  const les = LESSONS.filter((l) => done.has(l.key)).length;
  const step = microapp?.step ?? 0;
  const left = daysLeft(m.end_date);
  const owes = balance(m);

  // Dernier signe de vie : visite, mission cochée ou texte écrit
  const last = [m.last_seen, ...completions.map((c) => c.done_at), ...answers.map((a) => a.updated_at)].filter(Boolean).sort().at(-1) as string | undefined;
  const quiet = daysSince(last);

  const lessonAnswers = [
    ...LESSONS.map((l) => ({ key: l.key, title: l.title, group: `Leçon ${l.module.number}·${l.n}` })),
    ...MICRO_STEPS.flatMap((st) => (st.fields ?? []).map((f) => ({ key: f.key, title: f.label, group: `Micro-app · ${st.title}` }))),
  ].filter((x) => answer.has(x.key));

  return (
    <div className="rise">
      <Link href="/espace/admin" className="back muted">← Membres</Link>

      <header className="head member-head">
        <div className="head-row">
          <div className="member-title">
            <h1 className="display">{m.full_name || m.email}</h1>
            <p className="muted">{m.email} · <OfferName offer={m.offer} /> · semaine {weekOf(m.start_date)} · {left < 0 ? "terminé" : `fin le ${fmt.long(m.end_date)}`}</p>
          </div>
          <div className="actions">
            <a className="btn btn-ghost" href={`/contrat?m=${id}`} target="_blank" rel="noopener">Son contrat</a>
            <form action={enterSpace.bind(null, id)}><Submit className="btn btn-accent">Ouvrir son espace</Submit></form>
          </div>
        </div>
      </header>

      <section className="kpis">
        <div className={`kpi${owes > 0 || !m.paid ? " kpi-warn" : ""}`}>
          <span className="label">Paiement</span>
          <span className="kpi-num num">{owes > 0 ? money(owes) : "Payé"}</span>
          <span className="muted small">{owes > 0 ? `reste à payer · ${money(m.paid_amount)} versés` : `${money(m.paid_amount)} versés`}{m.paid ? "" : " · accès fermé"}</span>
        </div>
        <div className={`kpi${quiet == null || quiet >= 7 ? " kpi-warn" : ""}`}>
          <span className="label">Dernière activité</span>
          <span className="kpi-num num">{quiet == null ? "Jamais" : quiet === 0 ? "Aujourd'hui" : quiet === 1 ? "Hier" : `${quiet} j`}</span>
          <span className="muted small">{m.user_id ? (last ? fmt.long(last) : "Connecté, rien fait") : "Jamais connecté"}</span>
        </div>
        <div className="kpi">
          <span className="label">Le départ</span>
          <span className="kpi-num num">{dep}<small>/{DEPART.length}</small></span>
          <span className="segs">{DEPART.map((d) => <i key={d.key} className={done.has(d.key) ? "on" : ""} />)}</span>
        </div>
        <div className="kpi">
          <span className="label">Programme</span>
          <span className="kpi-num num">{les}<small>/{LESSONS.length}</small></span>
          <span className="segs">{LESSONS.map((l) => <i key={l.key} className={done.has(l.key) ? "on" : ""} />)}</span>
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Son départ</h2><span className="muted">{dep} sur {DEPART.length} cochées</span></div>
        <div className="check-list">
          {DEPART.map((d) => (
            <div key={d.key} className={`check-row${done.has(d.key) ? " on" : ""}`}>
              <span className="check-dot" aria-label={done.has(d.key) ? "Faite" : "À faire"} />
              <span className="check-title">{d.title}</span>
              <div className="check-reply">{d.input ? <Reply a={answer.get(d.key)} /> : <span className="muted small">Sur son Miro</span>}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Son programme</h2><span className="muted">{lessonAnswers.length} textes écrits</span></div>
        <div className="mod-lines">
          {MODULES.map((mod) => {
            const n = mod.lessons.filter((l) => done.has(l.key)).length;
            return (
              <div key={mod.slug} className="mod-line">
                <span className="small"><b className="num">{mod.number}</b> {mod.title}</span>
                <span className="segs">{mod.lessons.map((l) => <i key={l.key} className={done.has(l.key) ? "on" : ""} />)}</span>
                <span className="num small muted">{n}/{mod.lessons.length}</span>
              </div>
            );
          })}
        </div>
        {lessonAnswers.length > 0 && (
          <div className="written">
            {lessonAnswers.map((x) => {
              const a = answer.get(x.key)!;
              return (
                <details key={x.key} className="written-item">
                  <summary>
                    <span className="label">{x.group}</span>
                    <span className="written-title">{x.title}</span>
                    <span className="muted small">{fmt.short(a.updated_at)}</span>
                  </summary>
                  <div className="written-body"><Reply a={a} /></div>
                </details>
              );
            })}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head"><h2>Gérer</h2></div>
        <div className="manage">
          <details className="manage-item" open={!m.paid || owes > 0}>
            <summary>Paiement<span className="muted small">{m.paid ? "accès ouvert" : "accès fermé"}</span></summary>
            <form action={updatePayment.bind(null, id)} className="form manage-body">
              <label className="switch">
                <input id="paid" name="paid" type="checkbox" defaultChecked={m.paid} />
                <span className="switch-ui" aria-hidden="true" />
                <span><strong>{m.paid ? "Payé, accès ouvert" : "En attente, accès fermé"}</strong><br /><span className="muted small">Coche quand le contrat signé et le solde sont reçus.</span></span>
              </label>
              <div className="form-row">
                <label className="field"><span>Prix total</span><input id="price" name="price" inputMode="numeric" defaultValue={m.price ?? ""} /></label>
                <label className="field"><span>Déjà versé</span><input id="paid_amount" name="paid_amount" inputMode="numeric" defaultValue={m.paid_amount} /></label>
              </div>
              <label className="field"><span>Échéances (visibles dans le contrat et l&apos;écran de paiement)</span><input id="due_note" name="due_note" defaultValue={m.due_note ?? ""} placeholder="Solde avant le premier appel 1:1" /></label>
              <div><Submit>Enregistrer</Submit></div>
            </form>
          </details>

          <details className="manage-item">
            <summary>Appels 1:1<span className="muted small">{calls.length} {calls.length > 1 ? "appels" : "appel"}</span></summary>
            <div className="manage-body">
              <form action={addCall.bind(null, id)} className="form">
                <div className="form-row">
                  <label className="field"><span>Date</span><input id="held_on" name="held_on" type="date" defaultValue={new Date().toISOString().slice(0, 10)} /></label>
                  <label className="field"><span>Titre</span><input id="title" name="title" placeholder="Premier appel" /></label>
                  <label className="field"><span>Enregistrement</span><input id="recording_url" name="recording_url" type="url" placeholder="Lien Fathom, Loom…" /></label>
                </div>
                <div className="form-row">
                  <label className="field"><span>Résumé</span><textarea id="summary" name="summary" /></label>
                  <label className="field"><span>Pour le prochain (affiché sur son accueil)</span><textarea id="next_steps" name="next_steps" /></label>
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
            </div>
          </details>

          <details className="manage-item">
            <summary>Micro-app<span className="muted small">{step >= 6 ? "en ligne" : `étape ${step + 1} · ${MICROAPP_STEPS[step].title}`}</span></summary>
            <form action={saveMicroapp.bind(null, id)} className="form manage-body">
              <div className="form-row">
                <label className="field">
                  <span>Niveau</span>
                  <select id="level" name="level" defaultValue={microapp?.level ?? 1}>
                    <option value={1}>1 · page-outil</option>
                    <option value={2}>2 · mini-app</option>
                  </select>
                </label>
                <label className="field">
                  <span>Étape en cours</span>
                  <select id="step" name="step" defaultValue={step}>
                    {MICROAPP_STEPS.map((s, i) => <option key={s.title} value={i}>{i + 1}. {s.title}</option>)}
                    <option value={6}>Terminée</option>
                  </select>
                </label>
                <label className="field"><span>Adresse en ligne</span><input id="url" name="url" type="url" defaultValue={microapp?.url ?? ""} /></label>
              </div>
              <label className="field"><span>Ton mot (affiché sur sa page micro-app)</span><textarea id="note" name="note" defaultValue={microapp?.note ?? ""} /></label>
              <div><Submit>Enregistrer</Submit></div>
            </form>
          </details>

          {m.offer === "nota_plus" && (
            <details className="manage-item">
              <summary><span>Livraisons Nota<Plus /></span><span className="muted small">{deliveries.filter((d) => d.status === "livre").length}/{DELIVERIES.length} livrées</span></summary>
              <div className="list manage-body">
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
            </details>
          )}

          <details className="manage-item">
            <summary>Fiche et accès<span className="muted small">début le {fmt.long(m.start_date)}</span></summary>
            <div className="manage-body">
              <form action={updateMember.bind(null, id)} className="form">
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
                <div><Submit>Enregistrer</Submit></div>
              </form>
              <form action={removeMember.bind(null, id)} className="danger">
                <span className="muted">Retirer l&apos;accès efface ses missions, ses textes et ses appels.</span>
                <Confirm message={`Retirer l'accès de ${m.full_name || m.email} ? Tout sera effacé.`}>Retirer l&apos;accès</Confirm>
              </form>
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
