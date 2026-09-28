import { notFound } from "next/navigation";
import { Plus } from "@/components/Offer";
import { getBundle, getViewer } from "@/lib/data";
import { DELIVERIES, DELIVERY_STATUS } from "@/lib/programme";

export const metadata = { title: "Fait pour toi" };

export default async function PourToi() {
  const viewer = (await getViewer())!;
  if (viewer.offer !== "nota_plus") notFound();
  const { deliveries } = await getBundle(viewer.id);
  const byKey = new Map(deliveries.map((d) => [d.item_key, d]));
  const shipped = deliveries.filter((d) => d.status === "livre").length;

  return (
    <div className="rise">
      <header className="head">
        <p className="label">Nota<Plus /></p>
        <div className="head-row">
          <h1 className="display">Fait <span className="hl">pour toi</span></h1>
          <span className="num big-count">{shipped}<small>/{DELIVERIES.length}</small></span>
        </div>
        <p>Ce que Gael construit et te livre. Chaque pièce apparaît ici dès qu&apos;elle est prête.</p>
      </header>

      <div className="deliveries">
        {DELIVERIES.map((it, i) => {
          const d = byKey.get(it.key);
          const status = d?.status ?? "a_venir";
          return (
            <div key={it.key} className={`delivery ${status}`}>
              <span className="num muted">{String(i + 1).padStart(2, "0")}</span>
              <p className="delivery-title">{it.title}</p>
              <span className={`pill pill-dot${status === "livre" ? " pill-ink" : status === "en_cours" ? " pill-accent" : ""}`}>{DELIVERY_STATUS[status]}</span>
              {d?.link && status === "livre" ? (
                <a className="link arrow" href={d.link} target="_blank" rel="noopener noreferrer">Ouvrir </a>
              ) : (
                <span />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
