"use client";

import { useOptimistic, useTransition } from "react";
import { setMission } from "@/app/actions";

// Une tâche cochable (micro-app, guides). Enregistrée comme une mission.
export function CheckItem({ itemKey, done, children, readOnly, big }: { itemKey: string; done: boolean; children: React.ReactNode; readOnly?: boolean; big?: boolean }) {
  const [pending, start] = useTransition();
  const [isDone, setDone] = useOptimistic(done);
  return (
    <div className={`task${big ? " task-lg" : ""}${isDone ? " done" : ""}`}>
      <button
        type="button"
        className={`check${big ? "" : " check-sm"}`}
        aria-pressed={isDone}
        disabled={readOnly || pending}
        onClick={() => start(async () => { setDone(!isDone); await setMission(itemKey, !isDone); })}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="sr-only">{isDone ? "Fait" : "À faire"}</span>
      </button>
      <div className="task-body">{children}</div>
    </div>
  );
}
