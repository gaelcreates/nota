import { Closed, Shell } from "@/components/Shell";
import type { NavItem } from "@/components/Nav";
import { getBundle, getViewer } from "@/lib/data";
import { DEPART, LESSONS } from "@/lib/programme";
import { isEnded } from "@/lib/time";

export default async function EspaceLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  if (!viewer) {
    return <Closed title="Pas d'accès" body="Cette adresse n'est reliée à aucun accompagnement. Écris à gael@notaconsulting.ch." />;
  }
  if (viewer.role !== "admin" && isEnded(viewer.end_date)) {
    return <Closed title="C'est terminé" body="Tes six mois sont passés et ton espace est fermé. Merci pour le chemin fait ensemble." />;
  }

  const { completions } = await getBundle(viewer.id);
  const done = new Set(completions.map((c) => c.item_key));
  const depart = DEPART.filter((m) => done.has(m.key)).length;
  const lessons = LESSONS.filter((l) => done.has(l.key)).length;

  const items: NavItem[] = [
    { href: "/espace", label: "Accueil" },
    { href: "/espace/depart", label: "Le départ", count: `${depart}/${DEPART.length}` },
    { href: "/espace/programme", label: "Programme", count: `${lessons}/${LESSONS.length}` },
    { href: "/espace/appels", label: "Appels" },
    { href: "/espace/micro-app", label: "Micro-app" },
    { href: "/espace/progression", label: "Tes chiffres" },
  ];
  if (viewer.offer === "nota_plus") items.push({ href: "/espace/pour-toi", label: "Fait pour toi" });
  if (viewer.role === "admin") items.push({ href: "/espace/admin", label: "Admin", sep: true });

  return (
    <Shell viewer={viewer} items={items}>
      {children}
    </Shell>
  );
}
