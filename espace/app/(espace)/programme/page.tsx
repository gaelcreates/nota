import Link from "next/link";
import { getBundle, getViewer } from "@/lib/data";
import { EXTRAS, LESSONS, MODULES } from "@/lib/programme";

export const metadata = { title: "Programme" };

export default async function Programme() {
  const viewer = (await getViewer())!;
  const { completions } = await getBundle(viewer.id);
  const done = new Set(completions.map((c) => c.item_key));
  const total = LESSONS.filter((l) => done.has(l.key)).length;

  return (
    <div className="rise">
      <header className="head">
        <p className="label">Quatre modules, dans l&apos;ordre de la promesse</p>
        <div className="head-row">
          <h1 className="display">Le <span className="hl">programme</span></h1>
          <span className="num big-count">{total}<small>/{LESSONS.length}</small></span>
        </div>
        <p>Une leçon, une mission, un livrable. Chaque livrable est repris en appel.</p>
      </header>

      <div className="modules">
        {MODULES.map((m) => {
          const n = m.lessons.filter((l) => done.has(l.key)).length;
          return (
            <Link key={m.slug} href={`/programme/${m.slug}`} className="module">
              <span className="module-num display">{m.number}</span>
              <div className="module-body">
                <h2 className="module-title">{m.title}</h2>
                <p className="muted">{m.livrable}</p>
              </div>
              <div className="module-side">
                <span className="num">{n}/{m.lessons.length}</span>
                <div className="bar"><i style={{ width: `${(n / m.lessons.length) * 100}%` }} /></div>
              </div>
            </Link>
          );
        })}
      </div>

      <section className="section">
        <div className="section-head"><h2>Hors modules</h2></div>
        <div className="grid-3">
          {EXTRAS.map((e) => (
            <div key={e.title} className="card-flat extra">
              <p className="extra-title">{e.title}</p>
              <p className="muted">{e.body}</p>
              <span className="pill">À venir</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
