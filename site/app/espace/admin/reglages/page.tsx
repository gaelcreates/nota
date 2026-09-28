import { saveSettings } from "../actions";
import { Submit } from "@/components/Submit";
import { getSettings } from "@/lib/data";

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
        <div><Submit>Enregistrer</Submit></div>
      </form>
    </div>
  );
}
