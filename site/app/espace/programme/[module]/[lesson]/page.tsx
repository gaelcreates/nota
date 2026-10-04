import Link from "next/link";
import { notFound } from "next/navigation";
import { AnswerBox } from "@/components/AnswerBox";
import { DoneButton } from "@/components/DoneButton";
import { Mark } from "@/components/Mark";
import { getBundle, getViewer } from "@/lib/data";
import { CONTENT } from "@/lib/lessons";
import { DEPART, MODULES } from "@/lib/programme";

// Espaces insécables du français : « », : ; ? ! ne restent jamais seuls en début de ligne
const fr = (s: string) => s.replace(/« /g, "«\u00a0").replace(/ ([»:;?!])/g, "\u00a0$1");

function find(slug: string, n: string) {
  const mi = MODULES.findIndex((m) => m.slug === slug);
  const li = Number(n) - 1;
  const mod = MODULES[mi];
  if (!mod || !mod.lessons[li]) return null;
  return { mod, mi, li, lesson: mod.lessons[li] };
}

export function generateStaticParams() {
  return MODULES.flatMap((m) => m.lessons.map((_, i) => ({ module: m.slug, lesson: String(i + 1) })));
}

export async function generateMetadata({ params }: PageProps<"/espace/programme/[module]/[lesson]">) {
  const { module, lesson } = await params;
  const f = find(module, lesson);
  return { title: f ? f.lesson.title : "Leçon" };
}

export default async function LessonPage({ params }: PageProps<"/espace/programme/[module]/[lesson]">) {
  const { module, lesson } = await params;
  const f = find(module, lesson);
  if (!f) notFound();
  const { mod, mi, li } = f;
  const l = f.lesson;
  const c = CONTENT[l.key];

  const viewer = (await getViewer())!;
  const { completions, answers } = await getBundle(viewer.id);
  const done = new Set(completions.map((x) => x.item_key));
  const answer = answers.find((a) => a.item_key === l.key)?.answer ?? "";
  const feeds = DEPART.filter((d) => l.feeds?.includes(d.key));
  // Module 01 : chaque leçon a sa section dans la copie Miro du membre
  const miro = mi === 0 ? answers.find((a) => a.item_key === "d.miro")?.answer.trim() : undefined;

  // Leçon précédente et suivante, à travers les modules
  const flat = MODULES.flatMap((m) => m.lessons.map((x, i) => ({ m, x, n: i + 1 })));
  const pos = flat.findIndex((x) => x.x.key === l.key);
  const prev = flat[pos - 1];
  const next = flat[pos + 1];
  const href = (x: (typeof flat)[number]) => `/espace/programme/${x.m.slug}/${x.n}`;

  return (
    <div className="lesson-layout">
      <div className="lesson-main rise">
        <Link href={`/espace/programme/${mod.slug}`} className="back muted">← {mod.number} {mod.title}</Link>
        <header className="lesson-head">
          <p className="label">Leçon {mod.number}·{li + 1}{c ? ` · ${c.minutes} min` : ""}</p>
          <h1 className="display">{l.title}</h1>
        </header>

        <div className="video-slot">
          {l.video ? (
            <video controls preload="metadata" playsInline src={l.video} />
          ) : (
            <div className="video-soon" aria-label="Vidéo à venir">
              <Mark className="video-mark" />
              <span>La vidéo arrive</span>
            </div>
          )}
        </div>

        {c && (
          <>
            <section className="lesson-block">
              <h2>L&apos;essentiel</h2>
              <ol className="essentials">{c.points.map((p) => <li key={p}>{fr(p)}</li>)}</ol>
            </section>
            {c.examples.length > 0 && (
              <section className="lesson-block">
                <h2>Exemples</h2>
                <ul className="examples">{c.examples.map((e) => <li key={e}>{fr(e)}</li>)}</ul>
              </section>
            )}
          </>
        )}

        <section className="mission-card">
          <p className="label">Ta mission</p>
          <h2 className="display">{l.mission}</h2>
          <p className="muted">Livrable : {l.livrable}</p>
          {(feeds.length > 0 || mi === 0 || l.key === "m2.6") && (
            <div className="row-extra">
              {mi === 0 && (miro?.startsWith("http")
                ? <a href={miro} target="_blank" rel="noopener noreferrer" className="pill pill-ink">Ton Miro · section {li + 1} ↗</a>
                : <Link href="/espace/depart#d.miro" className="pill pill-ink">Ton Miro · fais d&apos;abord ta copie</Link>)}
              {l.key === "m2.6" && <Link href="/espace/micro-app" className="pill pill-ink">Ta micro-app, étape par étape</Link>}
              {feeds.map((d) => (
                <Link key={d.key} href={`/espace/depart#${d.key}`} className={`pill${done.has(d.key) ? " pill-accent" : ""}`}>Matière : {d.title}</Link>
              ))}
            </div>
          )}
          <AnswerBox itemKey={l.key} initial={answer} />
          <DoneButton itemKey={l.key} done={done.has(l.key)} />
        </section>

        <nav className="pager">
          {prev ? <Link href={href(prev)} className="pager-link"><span className="label">Précédente</span>{prev.x.title}</Link> : <span />}
          {next && <Link href={href(next)} className="pager-link right"><span className="label">Suivante</span>{next.x.title}</Link>}
        </nav>
      </div>

      <aside className="lesson-side">
        <p className="label">{mod.number} {mod.title}</p>
        <ol className="side-list">
          {mod.lessons.map((x, i) => (
            <li key={x.key}>
              <Link href={`/espace/programme/${mod.slug}/${i + 1}`} aria-current={i === li ? "page" : undefined} className={done.has(x.key) ? "is-done" : ""}>
                <span className="side-n num">{done.has(x.key) ? "✓" : i + 1}</span>
                {x.title}
              </Link>
            </li>
          ))}
        </ol>
        {MODULES[mi + 1] && <Link href={`/espace/programme/${MODULES[mi + 1].slug}`} className="link small">Module suivant : {MODULES[mi + 1].title}</Link>}
      </aside>
    </div>
  );
}
