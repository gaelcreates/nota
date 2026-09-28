import Link from "next/link";
import { notFound } from "next/navigation";
import { MissionRow } from "@/components/MissionRow";
import { getBundle, getViewer } from "@/lib/data";
import { DEPART, MODULES } from "@/lib/programme";

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
  const { completions } = await getBundle(viewer.id);
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

      <div className="list">
        {m.lessons.map((l, i) => {
          const c = byKey.get(l.key);
          const feeds = DEPART.filter((d) => l.feeds?.includes(d.key));
          return (
            <div key={l.key} id={l.key} className="lesson">
              <span className="lesson-num num">{m.number}·{i + 1}</span>
              <MissionRow
                itemKey={l.key}
                title={l.mission}
                body={`${l.title} · Livrable : ${l.livrable}`}
                done={!!c}
                link={c?.link ?? null}
                meta={l.video ? <a className="pill pill-ink" href={l.video} target="_blank" rel="noopener noreferrer">Vidéo</a> : <span className="pill">Vidéo à venir</span>}
                extra={
                  feeds.length > 0 && (
                    <>
                      {feeds.map((d) => (
                        <Link key={d.key} href="/espace/depart" className={`pill${byKey.has(d.key) ? " pill-accent" : ""}`}>
                          Matière : {d.title}
                        </Link>
                      ))}
                    </>
                  )
                }
              />
            </div>
          );
        })}
      </div>

      <nav className="pager">
        {prev ? <Link href={`/espace/programme/${prev.slug}`} className="pager-link"><span className="label">Précédent</span>{prev.number} {prev.title}</Link> : <span />}
        {next && <Link href={`/espace/programme/${next.slug}`} className="pager-link right"><span className="label">Suivant</span>{next.number} {next.title}</Link>}
      </nav>
    </div>
  );
}
