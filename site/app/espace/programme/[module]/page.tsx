import Link from "next/link";
import { notFound } from "next/navigation";
import { getBundle, getViewer } from "@/lib/data";
import { CONTENT } from "@/lib/lessons";
import { MODULES } from "@/lib/programme";

export function generateStaticParams() {
  return MODULES.map((m) => ({ module: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/espace/programme/[module]">) {
  const { module } = await params;
  const m = MODULES.find((x) => x.slug === module);
  return { title: m ? `${m.number} ${m.title}` : "Programme" };
}

export default async function ModulePage({ params }: PageProps<"/espace/programme/[module]">) {
  const { module } = await params;
  const index = MODULES.findIndex((m) => m.slug === module);
  if (index < 0) notFound();
  const m = MODULES[index];
  const prev = MODULES[index - 1];
  const next = MODULES[index + 1];

  const viewer = (await getViewer())!;
  const { completions, answers } = await getBundle(viewer.id);
  const answered = new Set(answers.filter((x) => x.answer.trim()).map((x) => x.item_key));
  const byKey = new Map(completions.map((c) => [c.item_key, c]));
  const n = m.lessons.filter((l) => byKey.has(l.key)).length;

  return (
    <div className="rise">
      <Link href="/espace/programme" className="back muted">← Programme</Link>
      <header className="head module-head">
        <span className="module-num-xl display" aria-hidden="true">{m.number}</span>
        <h1 className="display">{m.title}</h1>
        <span className="pill pill-accent module-count">{n} sur {m.lessons.length}</span>
        <p>
          <span className="label">Livrable du module</span>
          <br />
          {m.livrable}
        </p>
      </header>

      <ol className="lessons">
        {m.lessons.map((l, i) => {
          const isDone = byKey.has(l.key);
          const c = CONTENT[l.key];
          return (
            <li key={l.key} id={l.key}>
              <Link href={`/espace/programme/${m.slug}/${i + 1}`} className={`lesson-row${isDone ? " is-done" : ""}`}>
                <span className="lesson-n num">{isDone ? "✓" : `${m.number}·${i + 1}`}</span>
                <span className="lesson-txt">
                  <span className="lesson-title">{l.title}</span>
                  <span className="muted">{l.mission}</span>
                </span>
                <span className="lesson-meta">
                  {answered.has(l.key) && <span className="pill pill-accent">Livrable écrit</span>}
                  {c && <span className="muted small">{c.minutes} min</span>}
                  <span className="arrow" aria-hidden="true" />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      <nav className="pager">
        {prev ? <Link href={`/espace/programme/${prev.slug}`} className="pager-link"><span className="label">Précédent</span>{prev.number} {prev.title}</Link> : <span />}
        {next && <Link href={`/espace/programme/${next.slug}`} className="pager-link right"><span className="label">Suivant</span>{next.number} {next.title}</Link>}
      </nav>
    </div>
  );
}
