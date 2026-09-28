import { addSession, deleteSession, updateSession } from "../actions";
import { Confirm } from "@/components/Confirm";
import { Submit } from "@/components/Submit";
import { getGroupSessions } from "@/lib/data";
import { THEMES } from "@/lib/programme";
import { fmt } from "@/lib/time";

export const metadata = { title: "Appels de groupe" };

export default async function Groupe() {
  const sessions = await getGroupSessions();
  // Le thème suivant reprend la rotation après le dernier appel posé
  const last = sessions[0] && THEMES.findIndex((t) => t.key === sessions[0].theme_key);
  const nextTheme = THEMES[last == null || last < 0 ? 0 : (last + 1) % THEMES.length];

  return (
    <div className="rise">
      <header className="head">
        <h1 className="display">Appels de <span className="hl">groupe</span></h1>
        <p>Un par semaine, huit thèmes qui tournent. Les membres sans groupe ne les voient pas.</p>
      </header>

      <form action={addSession} className="card form">
        <div className="form-row">
          <label className="field"><span>Date</span><input id="s_date" name="held_on" type="date" required /></label>
          <label className="field">
            <span>Thème</span>
            <select id="s_theme" name="theme_key" defaultValue={nextTheme.key}>
              {THEMES.map((t, i) => <option key={t.key} value={t.key}>{i + 1}. {t.title}</option>)}
            </select>
          </label>
          <label className="field"><span>Replay</span><input id="s_replay" name="replay_url" type="url" placeholder="Plus tard" /></label>
        </div>
        <div><Submit>Ajouter</Submit></div>
      </form>

      <section className="section">
        {sessions.length === 0 ? (
          <p className="muted">Aucun appel posé.</p>
        ) : (
          <div className="list">
            {sessions.map((s) => (
              <div key={s.id} className="session-edit">
                <span className="num">{fmt.long(s.held_on)}</span>
                <span>{THEMES.find((t) => t.key === s.theme_key)?.title}</span>
                <form action={updateSession.bind(null, s.id)} className="inline-link">
                  <input name="replay_url" type="url" aria-label="Lien du replay" placeholder="Lien du replay" defaultValue={s.replay_url ?? ""} />
                  <Submit className="btn btn-ghost btn-sm">OK</Submit>
                </form>
                <form action={deleteSession.bind(null, s.id)}><Confirm message="Supprimer cet appel de groupe ?">Supprimer</Confirm></form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
