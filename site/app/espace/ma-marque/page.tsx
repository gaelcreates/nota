import Link from "next/link";
import { PrintButton } from "@/app/contrat/PrintButton";
import { getBundle, getViewer } from "@/lib/data";
import { MODULES } from "@/lib/programme";

export const metadata = { title: "Ma marque" };

// Le socle se construit tout seul avec ce que le membre écrit dans les leçons des modules 01 et 02.
export default async function MaMarque() {
  const viewer = (await getViewer())!;
  const { answers } = await getBundle(viewer.id);
  const byKey = new Map(answers.filter((a) => a.answer.trim()).map((a) => [a.item_key, a.answer]));
  const parts = MODULES.slice(0, 2);
  const total = parts.reduce((n, m) => n + m.lessons.length, 0);
  const written = parts.reduce((n, m) => n + m.lessons.filter((l) => byKey.has(l.key)).length, 0);
  const name = viewer.full_name || "Ma marque";

  return (
    <div className="rise brand-doc">
      <header className="head">
        <p className="label">Ton socle, écrit au fil des leçons</p>
        <div className="head-row">
          <h1 className="display">Ma <span className="hl">marque</span></h1>
          <div className="actions no-print">
            <span className="num big-count">{written}<small>/{total}</small></span>
          </div>
        </div>
        <p>Chaque livrable que tu écris dans une leçon arrive ici. À la fin du module 02, tu as ta marque et ton offre sur une page.</p>
        <div className="no-print"><PrintButton /></div>
      </header>

      <div className="brand-sheet">
        <div className="brand-sheet-top">
          <span className="label">Socle de marque</span>
          <span className="brand-sheet-name display">{name}</span>
        </div>
        {parts.map((m) => (
          <section key={m.slug} className="brand-part">
            <h2><span className="num">{m.number}</span> {m.title}</h2>
            <div className="brand-grid">
              {m.lessons.map((l, i) => {
                const a = byKey.get(l.key);
                return (
                  <article key={l.key} className={`brand-cell${a ? "" : " empty"}`}>
                    <p className="label">{l.title}</p>
                    {a ? (
                      <p className="brand-answer">{a}</p>
                    ) : (
                      <Link href={`/espace/programme/${m.slug}/${i + 1}`} className="link small no-print">À écrire dans la leçon {m.number}·{i + 1}</Link>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
