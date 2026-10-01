import Link from "next/link";
import { MissionRow } from "@/components/MissionRow";
import { getBundle, getSettings, getViewer } from "@/lib/data";
import { DEPART, DEPART_GROUPS, LESSONS } from "@/lib/programme";

export const metadata = { title: "Le départ" };

const duration = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h === 0 ? `${m} min` : m === 0 ? `${h} h` : `${h} h ${String(m).padStart(2, "0")}`;
};

export default async function Depart() {
  const viewer = (await getViewer())!;
  const [{ completions }, settings] = await Promise.all([getBundle(viewer.id), getSettings()]);
  const byKey = new Map(completions.map((c) => [c.item_key, c]));
  const done = DEPART.filter((m) => byKey.has(m.key)).length;

  return (
    <div className="rise">
      <header className="head">
        <p className="label">Avant le premier appel</p>
        <div className="head-row">
          <h1 className="display">Le <span className="hl">départ</span></h1>
          <span className="num big-count">{done}<small>/{DEPART.length}</small></span>
        </div>
        <p>Des missions courtes qui font, pas qui répondent. Chacune prépare une leçon.</p>
      </header>

      {DEPART_GROUPS.map((g) => {
        const items = DEPART.filter((m) => m.group === g.key);
        const total = items.reduce((s, m) => s + m.minutes, 0);
        return (
          <section key={g.key} className="section">
            <div className="section-head">
              <h2>{g.title}</h2>
              <span className="muted">{duration(total)}</span>
            </div>
            <div className="list">
              {items.map((m) => {
                const feeds = LESSONS.filter((l) => l.feeds?.includes(m.key));
                const href = m.action?.href ?? (m.action?.setting ? settings[m.action.setting] : undefined);
                const c = byKey.get(m.key);
                return (
                  <MissionRow
                    key={m.key}
                    itemKey={m.key}
                    title={m.title}
                    body={m.body}
                    done={!!c}
                    link={c?.link ?? null}
                    meta={<span className="pill">{duration(m.minutes)}</span>}
                    extra={
                      <>
                        {m.action && href && (
                          m.action.href ? (
                            <Link href={href} className="btn btn-ghost btn-sm">{m.action.label}</Link>
                          ) : (
                            <a href={href} className="btn btn-ghost btn-sm" target="_blank" rel="noopener noreferrer">{m.action.label}</a>
                          )
                        )}
                        {feeds.map((l) => (
                          <Link key={l.key} href={`/espace/programme/${l.module.slug}/${l.key.split(".")[1]}`} className="pill">
                            Leçon {l.module.number}·{l.key.split(".")[1]}
                          </Link>
                        ))}
                      </>
                    }
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
