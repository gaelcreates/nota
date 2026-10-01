import Link from "next/link";
import { AnswerBox } from "@/components/AnswerBox";
import { CheckItem } from "@/components/CheckItem";
import { getBundle, getViewer } from "@/lib/data";
import { FLOW, IDEAS, LEVELS, MICRO_STEPS } from "@/lib/microapp";

export const metadata = { title: "Micro-app" };

export default async function MicroApp() {
  const viewer = (await getViewer())!;
  const { microapp, completions, answers } = await getBundle(viewer.id);
  const done = new Set(completions.map((c) => c.item_key));
  const answer = new Map(answers.map((a) => [a.item_key, a.answer]));
  const level = microapp?.level ?? 1;
  const step = microapp?.step ?? 0; // réglé par Gael : 0 à 5 en cours, 6 terminée
  const finished = step >= 6;
  const live = microapp?.url;

  const steps = MICRO_STEPS.map((s, i) => {
    const tasks = s.tasks.filter((t) => !t.level || t.level <= level);
    const n = tasks.filter((t) => done.has(t.key)).length;
    const state = i < step ? "done" : i === step ? "cur" : "todo";
    return { ...s, i, tasks, n, state };
  });
  const allTasks = steps.reduce((a, s) => a + s.tasks.length, 0);
  const allDone = steps.reduce((a, s) => a + s.n, 0);
  const current = steps[Math.min(step, 5)];

  return (
    <div className="rise">
      <header className="head">
        <p className="label">Niveau {level} · {LEVELS[level - 1].title}</p>
        <div className="head-row">
          <h1 className="display">Ta <span className="hl">micro-app</span></h1>
          {live && <a className="btn btn-accent" href={live} target="_blank" rel="noopener noreferrer">Ouvrir mon outil ↗</a>}
        </div>
        <p>Un petit outil gratuit qui rend service à ton client idéal, récolte son e-mail et l&apos;amène vers ton offre. Construit sur tes comptes, il t&apos;appartient.</p>
      </header>

      <ol className="flow" aria-label="Comment ça marche">
        {FLOW.map((f, i) => (
          <li key={f.t} className="flow-step">
            <span className="flow-n num">{i + 1}</span>
            <span className="flow-t">{f.t}</span>
            <span className="muted small">{f.b}</span>
          </li>
        ))}
      </ol>

      <section className="section">
        <div className="ma-status card">
          <div className="ma-status-top">
            <div>
              <span className="label">Où on en est</span>
              <p className="ma-status-title display">{finished ? "Elle est à toi." : `Étape ${step + 1} · ${current.title}`}</p>
              <p className="muted">{finished ? "En ligne, sur tes comptes. Tu sais la modifier." : current.who}</p>
            </div>
            <span className="num ma-status-count">{allDone}<small>/{allTasks}</small></span>
          </div>
          <ol className="ma-track" aria-hidden="true">
            {steps.map((s) => (
              <li key={s.title} className={s.state}>
                <a href={`#etape-${s.i + 1}`}>
                  <i />
                  <span>{s.title}</span>
                </a>
              </li>
            ))}
          </ol>
          {microapp?.note && <p className="quote">{microapp.note}<span className="quote-by">Gael</span></p>}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Les six étapes</h2><span className="muted small">Gael valide chaque étape avant de passer à la suivante</span></div>
        <div className="ma-steps">
          {steps.map((s) => (
            <details key={s.title} id={`etape-${s.i + 1}`} className={`ma-step ${s.state}`} open={s.state === "cur"}>
              <summary>
                <span className="ma-dot num">{s.state === "done" ? "✓" : s.i + 1}</span>
                <span className="ma-sum">
                  <span className="ma-title">{s.title}</span>
                  <span className="muted small">{s.who}</span>
                </span>
                <span className="ma-right">
                  {s.state === "cur" && <span className="pill pill-accent">En cours</span>}
                  {s.state === "done" && <span className="pill pill-ink">Validée</span>}
                  <span className="muted small num">{s.n}/{s.tasks.length}</span>
                </span>
              </summary>

              <div className="ma-body">
                <p className="ma-intro">{s.intro}</p>

                {s.how && (
                  <div className="ma-block">
                    <p className="label">Comment faire</p>
                    <ol className="how-steps">{s.how.map((h) => <li key={h}>{h}</li>)}</ol>
                  </div>
                )}

                {s.action && (
                  <a href={s.action.href} className="btn btn-sm" target="_blank" rel="noopener noreferrer">{s.action.label} ↗</a>
                )}

                {s.i === 2 && (
                  <div className="ma-block">
                    <p className="label">Quatre formes qui marchent</p>
                    <div className="ideas">
                      {IDEAS.map((x) => (
                        <div key={x.t} className="idea"><strong>{x.t}</strong><span className="muted small">{x.b}</span></div>
                      ))}
                    </div>
                    <p className="muted small">La leçon <Link className="link" href="/espace/programme/offre/6">02·6 Ta micro-app, l&apos;offre d&apos;appel</Link> t&apos;aide à choisir.</p>
                  </div>
                )}

                <div className="ma-block">
                  <p className="label">À cocher</p>
                  <div className="tasks">
                    {s.tasks.map((t) => (
                      <CheckItem key={t.key} itemKey={t.key} done={done.has(t.key)}>
                        <span className="task-label">
                          {t.href ? <a href={t.href} target="_blank" rel="noopener noreferrer" className="link">{t.label} ↗</a> : t.label}
                        </span>
                        {t.help && <span className="muted small">{t.help}</span>}
                      </CheckItem>
                    ))}
                  </div>
                </div>

                {s.fields && (
                  <div className={`ma-fields${s.i === 2 ? " ma-fields-3" : ""}`}>
                    {s.fields.map((f) => (
                      <AnswerBox key={f.key} itemKey={f.key} initial={answer.get(f.key) ?? ""} label={f.label} placeholder={f.placeholder} single={f.single} min={110} />
                    ))}
                  </div>
                )}

                {s.tip && <p className="ma-tip">{s.tip}</p>}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-head"><h2>Ce que ça coûte</h2><span className="muted small">Par mois, sur tes comptes. Tarifs relevés le 28 septembre 2026.</span></div>
        <div className="grid-2">
          {LEVELS.map((l) => (
            <div key={l.n} className={`level card-flat${l.n === level ? " on" : ""}`}>
              <div className="level-top">
                <span className="label">Niveau {l.n}</span>
                {l.n === level && <span className="pill pill-accent">Ton niveau</span>}
              </div>
              <p className="level-title">{l.title}</p>
              <p className="muted">{l.body}</p>
              <p className="level-cost num">{l.cost}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
