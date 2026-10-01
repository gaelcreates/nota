import { signOut, updateMyName } from "@/app/actions";
import { OfferName } from "@/components/Offer";
import { Submit } from "@/components/Submit";
import { getViewer } from "@/lib/data";
import { daysLeft, fmt, weekOf } from "@/lib/time";

export const metadata = { title: "Mon compte" };

export default async function Compte() {
  const viewer = (await getViewer())!;
  const left = daysLeft(viewer.end_date);

  return (
    <div className="rise">
      <header className="head">
        <p className="label">Mon compte</p>
        <h1 className="display">{viewer.full_name || "Ton compte"}</h1>
      </header>

      <div className="grid-2">
        <section className="card account">
          <dl className="pay-dl">
            <div><dt>Formule</dt><dd><OfferName offer={viewer.offer} /></dd></div>
            <div><dt>E-mail</dt><dd>{viewer.email}</dd></div>
            <div><dt>Début</dt><dd>{fmt.full(viewer.start_date)}</dd></div>
            <div><dt>Fin de l&apos;accès</dt><dd>{fmt.full(viewer.end_date)}{viewer.role !== "admin" && left >= 0 ? ` · encore ${left} jours` : ""}</dd></div>
            <div><dt>Semaine</dt><dd>{weekOf(viewer.start_date)} sur 26</dd></div>
          </dl>
          <div className="account-actions">
            <a className="btn btn-ghost btn-sm" href="/contrat" target="_blank" rel="noopener">Mon contrat</a>
            <form action={signOut}><button className="btn btn-ghost btn-sm" type="submit">Se déconnecter</button></form>
          </div>
        </section>

        <form action={updateMyName} className="card form">
          <label className="field">
            <span>Ton prénom et ton nom</span>
            <input id="my_name" name="full_name" defaultValue={viewer.full_name} maxLength={80} required />
          </label>
          <div><Submit>Enregistrer</Submit></div>
          <p className="muted small">Pour changer d&apos;adresse e-mail, écris à gael@notaconsulting.ch.</p>
        </form>
      </div>
    </div>
  );
}
