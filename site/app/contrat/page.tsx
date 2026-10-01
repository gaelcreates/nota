import { notFound, redirect } from "next/navigation";
import { PrintButton } from "./PrintButton";
import { Brand } from "@/components/Mark";
import { OfferName } from "@/components/Offer";
import { getMember, getSettings, getViewer, type Member } from "@/lib/data";
import { balance, money } from "@/lib/payment";
import { fmt } from "@/lib/time";

export const metadata = { title: "Contrat" };

// Ce à quoi Gael s'engage, selon la formule. Repris de l'offre validée.
function engagements(m: Member) {
  const base = [
    "Des appels individuels de 30 minutes à 1 heure pendant les trois premiers mois, enregistrés avec ton accord.",
    "Un suivi par WhatsApp entre les appels.",
    "L'accès à l'espace membre et au programme pendant six mois.",
    "Une micro-app, construite sur tes propres comptes, qui t'appartient.",
  ];
  if (m.offer !== "repli") base.push("Le Discord et un appel de groupe par semaine pendant six mois.");
  if (m.offer === "nota_plus") {
    base.splice(0, 1, "Des appels individuels sans plafond pendant les trois premiers mois, enregistrés avec ton accord.");
    base.push(
      "L'architecture complète de ta marque, livrée.",
      "Ta stratégie d'acquisition, livrée clé en main : tunnel, page de vente, séquence d'e-mails.",
      "Une journée ensemble en présentiel, frais compris.",
    );
  }
  return base;
}

export default async function Contrat({ searchParams }: PageProps<"/contrat">) {
  const viewer = await getViewer();
  if (!viewer) redirect("/connexion");
  const { m: id } = await searchParams;
  const member = viewer.role === "admin" && typeof id === "string" ? await getMember(id) : viewer;
  if (!member) notFound();
  const s = await getSettings();
  const currency = s.currency || "EUR";
  const price = member.price ?? 0;
  const address = [s.street, [s.postal_code, s.town].filter(Boolean).join(" ")].filter(Boolean).join(", ");

  return (
    <div className="ct-wrap">
      <div className="ct-bar no-print">
        <a href="/espace" className="back muted">← Mon espace</a>
        <PrintButton />
      </div>
      <article className="ct">
        <header className="ct-head">
          <Brand />
          <span className="muted">Contrat d&apos;accompagnement</span>
        </header>
        <h1 className="display">Contrat <OfferName offer={member.offer} /></h1>

        <section className="ct-parties">
          <div>
            <p className="label">Entre</p>
            <p><strong>Gael Fischer</strong>, Nota{address ? <><br />{address}</> : null}<br />gael@notaconsulting.ch</p>
          </div>
          <div>
            <p className="label">Et</p>
            <p><strong>{member.full_name || "………………………………"}</strong><br />{member.email}</p>
          </div>
        </section>

        <section>
          <h2>1. Ce à quoi je m&apos;engage</h2>
          <ul className="ct-list">{engagements(member).map((e) => <li key={e}>{e}</li>)}</ul>
        </section>

        <section>
          <h2>2. Ce à quoi tu t&apos;engages</h2>
          <ul className="ct-list">
            <li>Verser {price ? <strong>{money(price, currency)}</strong> : "le montant convenu"} pour l&apos;accompagnement{member.paid_amount > 0 ? <>, dont {money(member.paid_amount, currency)} déjà versés. Solde : <strong>{money(balance(member), currency)}</strong></> : null}.</li>
            {member.due_note && <li>{member.due_note}</li>}
            <li>Faire le travail entre les appels : compter trois à cinq heures par semaine.</li>
            <li>Prendre en charge les frais de fonctionnement de ta micro-app (hébergement, outils), s&apos;il y en a.</li>
          </ul>
        </section>

        <section>
          <h2>3. La durée</h2>
          <p>Du <strong>{fmt.full(member.start_date)}</strong> au <strong>{fmt.full(member.end_date)}</strong>. À la fin, l&apos;accès à l&apos;espace membre et au Discord se ferme.</p>
        </section>

        <section>
          <h2>4. Le reste</h2>
          <p>Les conditions générales publiées sur notaconsulting.ch/conditions-generales s&apos;appliquent pour tout ce que ce contrat ne précise pas.</p>
        </section>

        <section className="ct-sign">
          <div><p className="label">Lieu et date</p><span className="ct-line" /></div>
          <div><p className="label">Gael Fischer</p><span className="ct-line" /></div>
          <div><p className="label">{member.full_name || "Le client"}</p><span className="ct-line" /></div>
        </section>
      </article>
    </div>
  );
}
