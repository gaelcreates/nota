import { getBundle, getGroupSessions, getSettings, getViewer } from "@/lib/data";
import { ONE_TO_ONE_WEEKS, THEMES } from "@/lib/programme";
import { fmt, today, weekOf } from "@/lib/time";

export const metadata = { title: "Appels" };

export default async function Appels() {
  const viewer = (await getViewer())!;
  const [{ calls }, sessions, settings] = await Promise.all([getBundle(viewer.id), getGroupSessions(), getSettings()]);
  const week = weekOf(viewer.start_date);
  const open = week <= ONE_TO_ONE_WEEKS || viewer.role === "admin";
  const now = today();
  const upcoming = sessions.filter((s) => new Date(s.held_on) >= now).sort((a, b) => a.held_on.localeCompare(b.held_on));
  const replays = sessions.filter((s) => new Date(s.held_on) < now);
  const theme = (k: string) => THEMES.find((t) => t.key === k);

  return (
    <div className="rise">
      <header className="head">
        <p className="label">{open ? `Suivi 1:1 jusqu'à la semaine ${ONE_TO_ONE_WEEKS}` : "Le suivi 1:1 est terminé"}</p>
        <div className="head-row">
          <h1 className="display">Les <span className="hl">appels</span></h1>
          <div className="actions">
            {open && settings.calendly_url && (
              <a className="btn btn-accent" href={settings.calendly_url} target="_blank" rel="noopener noreferrer">Réserver un appel</a>
            )}
            {settings.whatsapp_url && (
              <a className="btn btn-ghost" href={settings.whatsapp_url} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            )}
          </div>
        </div>
      </header>

      <section className="section">
        <div className="section-head"><h2>Tes appels 1:1</h2><span className="muted">{calls.length}</span></div>
        {calls.length === 0 ? (
          <p className="muted">Ton premier appel apparaîtra ici, avec son enregistrement.</p>
        ) : (
          <div className="timeline">
            {calls.map((c) => (
              <article key={c.id} className="call">
                <span className="call-date num">{fmt.short(c.held_on)}</span>
                <div className="call-body">
                  <h3>{c.title || "Appel"}</h3>
                  {c.summary && <p>{c.summary}</p>}
                  {c.next_steps && (
                    <p className="call-next"><span className="label">Pour le prochain</span><br />{c.next_steps}</p>
                  )}
                  {c.recording_url && (
                    <a className="link arrow" href={c.recording_url} target="_blank" rel="noopener noreferrer">L&apos;enregistrement </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="section" id="groupe">
        <div className="section-head">
          <h2>Appels de groupe</h2>
          {viewer.offer !== "repli" && settings.discord_url && (
            <a className="link" href={settings.discord_url} target="_blank" rel="noopener noreferrer">Rejoindre le Discord</a>
          )}
        </div>
        {viewer.offer === "repli" ? (
          <p className="muted">Les appels de groupe ne font pas partie de ta formule.</p>
        ) : (
          <>
            <p className="muted">Un par semaine, une heure, sur le Discord. Huit thèmes qui tournent.</p>
            {upcoming.length > 0 && (
              <div className="list">
                {upcoming.map((s) => (
                  <div key={s.id} className="session">
                    <span className="num">{fmt.long(s.held_on)}</span>
                    <span>{theme(s.theme_key)?.title}</span>
                    <span className="pill pill-accent">À venir</span>
                  </div>
                ))}
              </div>
            )}
            <div className="themes">
              {THEMES.map((t, i) => (
                <div key={t.key} className="theme">
                  <span className="num muted">{i + 1}</span>
                  <p className="theme-title">{t.title}</p>
                  <p className="muted">{t.body}</p>
                </div>
              ))}
            </div>
            {replays.length > 0 && (
              <>
                <div className="section-head" style={{ marginTop: 24 }}><h2>Les replays</h2></div>
                <div className="list">
                  {replays.map((s) => (
                    <div key={s.id} className="session">
                      <span className="num">{fmt.long(s.held_on)}</span>
                      <span>{theme(s.theme_key)?.title}</span>
                      {s.replay_url ? (
                        <a className="link arrow" href={s.replay_url} target="_blank" rel="noopener noreferrer">Revoir </a>
                      ) : (
                        <span className="muted">Pas de replay</span>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  );
}
