import Link from "next/link";
import { Ring } from "@/components/Ring";
import { Ruler } from "@/components/Ruler";
import { getBundle, getGroupSessions, getSettings, getViewer } from "@/lib/data";
import { MICRO_STEPS, MICRO_TASKS } from "@/lib/microapp";
import { DEPART, LESSONS, MODULES, ONE_TO_ONE_WEEKS, THEMES } from "@/lib/programme";
import { daysLeft, fmt, today, weekOf } from "@/lib/time";

const lessonHref = (l: (typeof LESSONS)[number]) => `/espace/programme/${l.module.slug}/${l.key.split(".")[1]}`;

// Titre et lien de chaque élément cochable, pour « Fait récemment »
const ITEMS = new Map<string, { title: string; kind: string; href: string }>([
  ...DEPART.map((m) => [m.key, { title: m.title, kind: "Le départ", href: `/espace/depart#${m.key}` }] as const),
  ...LESSONS.map((l) => [l.key, { title: l.title, kind: `Leçon ${l.module.number}·${l.key.split(".")[1]}`, href: lessonHref(l) }] as const),
  ...MICRO_TASKS.map((t) => [t.key, { title: t.label, kind: "Micro-app", href: "/espace/micro-app" }] as const),
]);

export default async function Accueil() {
  const viewer = (await getViewer())!;
  const [{ completions, calls, microapp, answers }, sessions, settings] = await Promise.all([
    getBundle(viewer.id),
    getGroupSessions(),
    getSettings(),
  ]);
  const done = new Set(completions.map((c) => c.item_key));
  const week = weekOf(viewer.start_date);
  const left = daysLeft(viewer.end_date);
  const first = viewer.full_name.split(" ")[0] || "toi";

  // Le parcours : le départ puis les quatre modules
  const stations = [
    { key: "depart", n: "D", title: "Le départ", href: "/espace/depart", total: DEPART.length, count: DEPART.filter((m) => done.has(m.key)).length },
    ...MODULES.map((m) => ({ key: m.slug, n: m.number, title: m.title, href: `/espace/programme/${m.slug}`, total: m.lessons.length, count: m.lessons.filter((l) => done.has(l.key)).length })),
  ];
  const curStation = stations.findIndex((s) => s.count < s.total);
  const total = stations.reduce((a, s) => a + s.total, 0);
  const count = stations.reduce((a, s) => a + s.count, 0);

  // Ce qu'il reste à faire, dans l'ordre
  const queue = [
    ...DEPART.filter((m) => m.group !== "bonus" && !done.has(m.key)).map((m) => ({ key: m.key, title: m.title, kind: "Le départ", body: m.body, href: `/espace/depart#${m.key}`, tag: `${m.minutes} min` })),
    ...LESSONS.filter((l) => !done.has(l.key)).map((l) => ({ key: l.key, title: l.mission, kind: `Leçon ${l.module.number}·${l.key.split(".")[1]} · ${l.title}`, body: l.livrable, href: lessonHref(l), tag: "Mission" })),
  ];
  const next = queue[0];
  const after = queue.slice(1, 4);

  const recent = [...completions]
    .filter((c) => ITEMS.has(c.item_key))
    .sort((a, b) => b.done_at.localeCompare(a.done_at))
    .slice(0, 5);

  const upcoming = sessions
    .filter((s) => new Date(s.held_on) >= today())
    .sort((a, b) => a.held_on.localeCompare(b.held_on))[0];
  const theme = upcoming && THEMES.find((t) => t.key === upcoming.theme_key);
  const inOneToOne = week <= ONE_TO_ONE_WEEKS;
  const lastCall = calls[0];

  const step = microapp?.step ?? 0;
  const brandKeys = MODULES.slice(0, 2).flatMap((m) => m.lessons.map((l) => l.key));
  const written = answers.filter((a) => brandKeys.includes(a.item_key) && a.answer.trim()).length;

  return (
    <div className="rise">
      <section className="dash-hero">
        <div className="dash-hello">
          <p className="label">Semaine {week} sur 26 · {left > 0 ? `${left} jours restants` : "dernier jour"}</p>
          <h1 className="display">Bonjour <span className="hl">{first}</span>.</h1>
          <p className="dash-sub">
            {next ? <>Ta prochaine mission : <Link href={next.href} className="link ink">{next.title}</Link>.</> : "Tout est coché. On se voit au prochain appel."}
          </p>
        </div>
        <Ring value={count / total}>
          <span className="num ring-num">{Math.round((count / total) * 100)}<small>%</small></span>
          <span className="muted small">{count} sur {total}</span>
        </Ring>
      </section>

      <Ruler week={week} />

      <section className="journey" aria-label="Ton parcours">
        {stations.map((s, i) => {
          const state = s.count === s.total ? "done" : i === curStation ? "cur" : "todo";
          return (
            <Link key={s.key} href={s.href} className={`station ${state}`}>
              <span className="station-n num">{state === "done" ? "✓" : s.n}</span>
              <span className="station-txt">
                <span className="station-title">{s.title}</span>
                <span className="muted small num">{s.count} sur {s.total}</span>
              </span>
              <span className="bar"><i style={{ width: `${(s.count / s.total) * 100}%` }} /></span>
            </Link>
          );
        })}
      </section>

      <div className="dash-grid">
        <div className="dash-main">
          {next ? (
            <Link href={next.href} className="now">
              <div className="now-top">
                <span className="label">Maintenant</span>
                <span className="pill pill-accent">{next.tag}</span>
              </div>
              <p className="now-title display">{next.title}</p>
              <p className="now-body">{next.kind}</p>
              <span className="now-go arrow">Y aller </span>
            </Link>
          ) : (
            <div className="now">
              <span className="label">Maintenant</span>
              <p className="now-title display">Tout est coché.</p>
            </div>
          )}

          {after.length > 0 && (
            <div className="dash-block">
              <p className="label">Ensuite</p>
              <ol className="queue">
                {after.map((q, i) => (
                  <li key={q.key}>
                    <Link href={q.href} className="queue-row">
                      <span className="queue-n num">{i + 2}</span>
                      <span className="queue-txt"><span>{q.title}</span><span className="muted small">{q.kind}</span></span>
                      <span className="pill">{q.tag}</span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="dash-block">
            <p className="label">Fait récemment</p>
            {recent.length > 0 ? (
              <ul className="recent">
                {recent.map((c) => {
                  const it = ITEMS.get(c.item_key)!;
                  return (
                    <li key={c.item_key}>
                      <span className="recent-dot" aria-hidden="true" />
                      <Link href={it.href} className="recent-title">{it.title}</Link>
                      <span className="muted small">{it.kind} · {fmt.short(c.done_at)}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="muted">Ta première mission cochée s&apos;affichera ici.</p>
            )}
          </div>
        </div>

        <aside className="dash-side">
          <div className="side-card">
            <div className="side-card-head"><span className="label">Tes appels</span><Link href="/espace/appels" className="link small">Tout voir</Link></div>
            {inOneToOne ? (
              <div className="side-call">
                <p className="side-title">Appel 1:1</p>
                <p className="muted small">{lastCall ? `Le dernier, le ${fmt.long(lastCall.held_on)}.` : "Le premier se réserve ici, dans les sept jours."} Jusqu&apos;à la semaine {ONE_TO_ONE_WEEKS}.</p>
                {settings.calendly_url && <a className="btn btn-sm" href={settings.calendly_url} target="_blank" rel="noopener noreferrer">Réserver un appel ↗</a>}
              </div>
            ) : null}
            {viewer.offer !== "repli" && (
              <div className="side-call">
                <p className="side-title">Appel de groupe</p>
                {upcoming && theme ? (
                  <p className="muted small"><b className="ink">{fmt.long(upcoming.held_on)}</b> · {theme.title}. {theme.body}</p>
                ) : (
                  <p className="muted small">La date du prochain arrive bientôt.</p>
                )}
              </div>
            )}
            {lastCall?.next_steps && (
              <div className="side-next">
                <span className="label">Pour le prochain appel</span>
                <p>{lastCall.next_steps}</p>
              </div>
            )}
          </div>

          <Link href="/espace/micro-app" className="side-card side-link">
            <div className="side-card-head"><span className="label">Ta micro-app</span><span className="arrow" aria-hidden="true" /></div>
            <p className="side-title">{step >= 6 ? "En ligne, elle est à toi" : `Étape ${step + 1} · ${MICRO_STEPS[step].title}`}</p>
            <span className="dots" aria-hidden="true">
              {MICRO_STEPS.map((s, i) => <i key={s.title} className={i < step ? "done" : i === step ? "cur" : ""} />)}
            </span>
          </Link>

          <Link href="/espace/ma-marque" className="side-card side-link">
            <div className="side-card-head"><span className="label">Ma marque</span><span className="arrow" aria-hidden="true" /></div>
            <p className="side-title"><span className="num">{written}</span> sur {brandKeys.length} parties écrites</p>
            <span className="bar"><i style={{ width: `${(written / brandKeys.length) * 100}%` }} /></span>
          </Link>
        </aside>
      </div>
    </div>
  );
}
