import { notFound, redirect } from "next/navigation";
import { AdminTabs } from "./AdminTabs";
import { getImpersonator, getRealViewer } from "@/lib/data";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getRealViewer();
  if (viewer?.role !== "admin") notFound();
  if (await getImpersonator()) redirect("/espace"); // d'abord quitter l'espace du membre
  return (
    <>
      <AdminTabs />
      {children}
    </>
  );
}
