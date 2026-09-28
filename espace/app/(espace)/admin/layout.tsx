import { notFound } from "next/navigation";
import { AdminTabs } from "./AdminTabs";
import { getViewer } from "@/lib/data";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  if (viewer?.role !== "admin") notFound();
  return (
    <>
      <AdminTabs />
      {children}
    </>
  );
}
