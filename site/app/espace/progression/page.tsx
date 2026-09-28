import { saveMetrics } from "@/app/actions";
import { Submit } from "@/components/Submit";
import { getBundle, getViewer, type Metric } from "@/lib/data";
import { METRICS, PERIODS } from "@/lib/programme";
import { weekOf } from "@/lib/time";

export const metadata = { title: "Tes chiffres" };

function delta(now: number | null | undefined, base: number | null | undefined) {
  if (now == null || base == null) return null;
  const diff = now - base;
  const sign = diff > 0 ? "+" : diff < 0 ? "−" : "";
  const pct = base > 0 ? ` · ${sign}${Math.round((Math.abs(diff) / base) * 100)} %` : "";
  return `${sign}${Math.abs(diff).toLocaleString("fr-CH")}${pct}`;
}

export default async function Progression() {
  const viewer = (await getViewer())!;
  const { metrics } = await getBundle(viewer.id);
  const week = weekOf(viewer.start_date);
  const get = (p: string) => metrics.find((m) => m.period === p);
  const base = get("depart");

  return (
    <div className="rise">
      <header className="head">
        <p className="label">Les trente derniers jours, à chaque étape</p>
        <h1 className="display">Tes <span className="hl">chiffres</span></h1>
        <p>Quatre chiffres, trois photos. La progression se voit, elle ne se raconte pas.</p>
      </header>

      <div className="periods">
        {PERIODS.map((p) => {
          const m = get(p.key);
          const open = viewer.role === "admin" || week >= p.week - 1;
          return (
            <form key={p.key} action={saveMetrics.bind(null, p.key)} className={`period${open ? "" : " locked"}`}>
              <div className="period-head">
                <h2 className="display">{p.label}</h2>
                <span className="muted">{open ? `Semaine ${p.week}` : `Dès la semaine ${p.week - 1}`}</span>
              </div>
              {METRICS.map((k) => {
                const v = m?.[k.key as keyof Metric] as number | null | undefined;
                const d = p.key !== "depart" ? delta(v, base?.[k.key as keyof Metric] as number | null | undefined) : null;
                return (
                  <label key={k.key} className="metric">
                    <span className="label">{k.label}</span>
                    <input name={k.key} className="num" inputMode="numeric" defaultValue={v ?? ""} placeholder="—" disabled={!open} aria-label={`${k.label}, ${p.label}`} />
                    {d && <span className="metric-delta">{d}</span>}
                  </label>
                );
              })}
              {open && <Submit className="btn btn-sm">Enregistrer</Submit>}
            </form>
          );
        })}
      </div>
    </div>
  );
}
