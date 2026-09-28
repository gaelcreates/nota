import { getBundle, getViewer } from "@/lib/data";
import { MICROAPP_STEPS } from "@/lib/programme";

export const metadata = { title: "Micro-app" };

export default async function MicroApp() {
  const viewer = (await getViewer())!;
  const { microapp } = await getBundle(viewer.id);
  const step = microapp?.step ?? 0;
  const live = step >= 5 && microapp?.url;

  return (
    <div className="rise">
      <header className="head">
        <p className="label">{microapp ? `Niveau ${microapp.level} · ${microapp.level === 1 ? "page-outil" : "mini-app"}` : "Elle se lance au module 02"}</p>
        <div className="head-row">
          <h1 className="display">Ta <span className="hl">micro-app</span></h1>
          {live && (
            <a className="btn btn-accent" href={microapp!.url!} target="_blank" rel="noopener noreferrer">Ouvrir</a>
          )}
        </div>
        <p>Un petit outil qui rend service à ton client idéal et récolte ses coordonnées. Construite sur tes comptes, elle t&apos;appartient.</p>
      </header>

      <ol className="steps">
        {MICROAPP_STEPS.map((s, i) => {
          const state = i < step ? "done" : i === step ? "cur" : "todo";
          return (
            <li key={s.title} className={`step ${state}`}>
              <span className="step-dot num">{i < step ? "✓" : i + 1}</span>
              <div>
                <p className="step-title">{s.title}</p>
                <p className="muted">{s.body}</p>
              </div>
              {state === "cur" && <span className="pill pill-accent">En cours</span>}
            </li>
          );
        })}
      </ol>

      {microapp?.note && (
        <section className="section">
          <div className="section-head"><h2>Le mot de Gael</h2></div>
          <p className="quote">{microapp.note}</p>
        </section>
      )}
    </div>
  );
}
