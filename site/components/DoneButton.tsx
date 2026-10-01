"use client";

import { useOptimistic, useTransition } from "react";
import { setMission } from "@/app/actions";

export function DoneButton({ itemKey, done }: { itemKey: string; done: boolean }) {
  const [pending, start] = useTransition();
  const [isDone, setDone] = useOptimistic(done);
  return (
    <button
      type="button"
      className={`done-btn${isDone ? " on" : ""}`}
      aria-pressed={isDone}
      disabled={pending}
      onClick={() => start(async () => { setDone(!isDone); await setMission(itemKey, !isDone); })}
    >
      <span className="done-dot" aria-hidden="true">
        <svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </span>
      {isDone ? "Mission faite" : "Marquer la mission comme faite"}
    </button>
  );
}
