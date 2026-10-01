import { saveSettings } from "../actions";
import { Submit } from "@/components/Submit";
import { getSettings } from "@/lib/data";
import { formatIban, validIban } from "@/lib/payment";

export const metadata = { title: "Réglages" };

const FIELDS = [
  { key: "calendly_url", label: "Réserver un appel 1:1", hint: "Lien Calendly des membres" },
  { key: "discord_url", label: "Discord", hint: "Lien d'invitation" },
  { key: "whatsapp_url", label: "WhatsApp", hint: "Lien wa.me" },
  { key: "questionnaire_url", label: "Questionnaire d'entrée", hint: "Lien /copy du Google Doc" },
  { key: "miro_url", label: "Modèle Miro « Ta marque »", hint: "Lien de partage du modèle" },
];

export default async function Reglages() {
  const settings = await getSettings();
  return (
    <div className="rise">
      <header className="head">
        <h1 className="display"><span className="hl">Réglages</span></h1>
        <p>Les liens que les membres voient dans leur espace. Un champ vide masque le bouton.</p>
      </header>
      <form action={saveSettings} className="card form settings">
        {FIELDS.map((f) => (
          <label key={f.key} className="field">
            <span>{f.label} · {f.hint}</span>
            <input id={f.key} name={f.key} type="url" defaultValue={settings[f.key] ?? ""} />
          </label>
        ))}
        <h2 className="settings-h">Paiement</h2>
        <p className="muted small">Affiché sur l&apos;écran de paiement et dans le QR code. IBAN suisse : QR-facture. IBAN européen en euros : code SEPA.</p>
        <div className="form-row">
          <label className="field"><span>Titulaire du compte</span><input id="beneficiary" name="beneficiary" defaultValue={settings.beneficiary ?? ""} /></label>
          <label className="field"><span>IBAN{settings.iban && !validIban(settings.iban) ? " · à vérifier" : ""}</span><input id="iban" name="iban" defaultValue={settings.iban ? formatIban(settings.iban) : ""} autoComplete="off" /></label>
        </div>
        <div className="form-row">
          <label className="field"><span>Rue et numéro</span><input id="street" name="street" defaultValue={settings.street ?? ""} /></label>
          <label className="field"><span>NPA</span><input id="postal_code" name="postal_code" defaultValue={settings.postal_code ?? ""} /></label>
          <label className="field"><span>Ville</span><input id="town" name="town" defaultValue={settings.town ?? ""} /></label>
        </div>
        <div className="form-row">
          <label className="field"><span>Pays (code)</span><input id="country" name="country" maxLength={2} defaultValue={settings.country || "CH"} /></label>
          <label className="field">
            <span>Monnaie</span>
            <select id="currency" name="currency" defaultValue={settings.currency || "EUR"}><option value="EUR">EUR</option><option value="CHF">CHF</option></select>
          </label>
        </div>
        <div><Submit>Enregistrer</Submit></div>
      </form>
    </div>
  );
}
