import type { Offer } from "@/lib/programme";

// Les polices de la marque dessinent mal le « + » : il passe en police système.
export function Plus() {
  return <span className="plus">+</span>;
}

export function OfferName({ offer }: { offer: Offer }) {
  return <>Nota{offer === "nota_plus" && <Plus />}{offer === "repli" && " · sans groupe"}</>;
}
