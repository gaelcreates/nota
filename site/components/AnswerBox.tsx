"use client";

import { useEffect, useRef, useState } from "react";
import { saveAnswer } from "@/app/actions";

// Le livrable s'écrit ici. Enregistrement automatique après une pause de frappe.
export function AnswerBox({ itemKey, initial, placeholder }: { itemKey: string; initial: string; placeholder?: string }) {
  const [value, setValue] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const last = useRef(initial);
  const area = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fit = () => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(140, el.scrollHeight)}px`;
  };
  useEffect(fit, []);

  const save = async (text: string) => {
    if (text === last.current) return;
    setState("saving");
    await saveAnswer(itemKey, text);
    last.current = text;
    setState("saved");
    setTimeout(() => setState("idle"), 1800);
  };

  return (
    <div className="answer">
      <textarea
        ref={area}
        id={`answer-${itemKey}`}
        value={value}
        placeholder={placeholder ?? "Écris ton livrable ici."}
        onChange={(e) => {
          setValue(e.target.value);
          fit();
          if (timer.current) clearTimeout(timer.current);
          const text = e.target.value;
          timer.current = setTimeout(() => save(text), 1200);
        }}
        onBlur={() => save(value)}
        aria-label="Ton livrable"
      />
      <span className="answer-state" aria-live="polite">
        {state === "saving" ? "Enregistrement…" : state === "saved" ? "Enregistré" : value.trim() ? `${value.trim().split(/\s+/).length} mots` : ""}
      </span>
    </div>
  );
}
