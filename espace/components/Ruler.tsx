import { ONE_TO_ONE_WEEKS, TOTAL_WEEKS } from "@/lib/programme";

// Les 26 semaines de l'accompagnement. Les 13 premières sont plus hautes : le suivi 1:1.
export function Ruler({ week }: { week: number }) {
  return (
    <div className="ruler" aria-label={`Semaine ${week} sur ${TOTAL_WEEKS}`}>
      <div className="ruler-track" aria-hidden="true">
        {Array.from({ length: TOTAL_WEEKS }, (_, i) => {
          const n = i + 1;
          const cls = [n <= ONE_TO_ONE_WEEKS ? "solo" : "", n < week ? "past" : "", n === week ? "cur" : "", n === 13 || n === 26 ? "mark" : ""]
            .filter(Boolean)
            .join(" ");
          return <i key={n} className={cls} style={{ ["--i" as string]: i }} />;
        })}
      </div>
      <div className="ruler-legend">
        <span style={{ gridColumn: "1 / span 8" }}><b>Départ</b> · suivi 1:1</span>
        <span style={{ gridColumn: "13 / span 7" }}><b>3 mois</b></span>
        <span style={{ gridColumn: "20 / 27", textAlign: "right" }}><b>6 mois</b></span>
      </div>
    </div>
  );
}
