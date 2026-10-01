import Link from "next/link";
import { AnswerBox } from "@/components/AnswerBox";
import { CheckItem } from "@/components/CheckItem";
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
  const [{ completions, answers }, settings] = await Promise.all([getBundle(viewer.id), getSettings()]);
  const done = new Set(completions.map((c) => c.item_key));
  const answer = new Map(answers.map((a) => [a.item_key, a.answer]));
  const count = DEPART.filter((m) => done.has(m.key)).length;
  const next = DEPART.find((m) => m.group !== "bonus" && !done.has(m.key));
  const left = DEPART.filter((m) => m.group !== "bonus" && !done.has(m.key)).reduce((s, m) => s + m.minutes, 0);

  return (
    <div className="rise">
      <header className="head">
        <p className="label">Avant le premier appel</p>
        <div className="head-row">
          <h1 className="display">Le <span className="hl">départ</span></h1>
          <span className="num big-count">{count}<small>/{DEPART.length}</small></span>
        </div>
        <p>Des missions courtes qui font, pas qui répondent. Ouvre « Comment faire » sous chacune : tout est expliqué, étape par étape.</p>
        <div className="depart-meter">
          <div className="bar"><i style={{ width: `${(count / DEPART.length) * 100}%` }} /></div>
          <span className="muted small">{left > 0 ? `Encore ${duration(left)} avant le premier appel` : "Tout est prêt pour le premier appel"}</span>
        </div>
      </header>

      {DEPART_GROUPS.map((g) => {
        const items = DEPART.filter((m) => m.group === g.key);
        const total = items.reduce((s, m) => s + m.minutes, 0);
        const n = items.filter((m) => done.has(m.key)).length;
        return (
          <section key={g.key} className="section">
            <div className="section-head">
              <div>
                <h2>{g.title}</h2>
                <p className="muted small">{g.body}</p>
              </div>
              <span className="muted">{n}/{items.length} · {duration(total)}</span>
            </div>
            <div className="dms">
              {items.map((m) => {
                const feeds = LESSONS.filter((l) => l.feeds?.includes(m.key));
                const href = m.action?.href ?? (m.action?.setting ? settings[m.action.setting] : undefined);
                const isDone = done.has(m.key);
                const isNext = next?.key === m.key;
                return (
                  <article key={m.key} id={m.key} className={`dm${isDone ? " done" : ""}${isNext ? " is-next" : ""}`}>
                    <CheckItem itemKey={m.key} done={isDone} big>
                      <div className="dm-top">
                        <div>
                          <h3 className="dm-title"><span className="t">{m.title}</span></h3>
                          <p className="muted">{m.body}</p>
                        </div>
                        <div className="dm-meta">
                          {isNext && <span className="pill pill-accent">À faire maintenant</span>}
                          <span className="pill">{duration(m.minutes)}</span>
                          <span className="pill">{m.where}</span>
                        </div>
                      </div>
                    </CheckItem>

                    <details className="how" open={isNext}>
                      <summary>Comment faire</summary>
                      <div className="how-body">
                        <ol className="how-steps">{m.how.map((s) => <li key={s}>{s}</li>)}</ol>
                        {m.action && (href ? (
                          m.action.href ? (
                            <Link href={href} className="btn btn-sm">{m.action.label}</Link>
                          ) : (
                            <a href={href} className="btn btn-sm" target="_blank" rel="noopener noreferrer">{m.action.label} ↗</a>
                          )
                        ) : (
                          <p className="muted small">Le lien arrive. Gael te l&apos;envoie en attendant.</p>
                        ))}
                      </div>
                    </details>

                    {m.input && (
                      <AnswerBox
                        itemKey={m.key}
                        initial={answer.get(m.key) ?? ""}
                        placeholder={m.input.placeholder}
                        single={m.input.kind === "link"}
                        label={m.input.kind === "link" ? m.input.placeholder : "Ta réponse, enregistrée automatiquement"}
                        min={110}
                      />
                    )}

                    {feeds.length > 0 && (
                      <p className="dm-feeds muted small">
                        Sert aux leçons{" "}
                        {feeds.map((l, i) => (
                          <span key={l.key}>
                            {i > 0 && ", "}
                            <Link className="link" href={`/espace/programme/${l.module.slug}/${l.key.split(".")[1]}`}>{l.module.number}·{l.key.split(".")[1]} {l.title}</Link>
                          </span>
                        ))}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
