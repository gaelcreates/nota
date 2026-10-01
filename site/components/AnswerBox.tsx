"use client";

import { useEffect, useRef, useState } from "react";
import { saveAnswer } from "@/app/actions";

// Un texte que le membre écrit dans son espace. Enregistrement automatique après une pause de frappe.
// `single` : une seule ligne (un lien, un identifiant).
type Props = { itemKey: string; initial: string; placeholder?: string; label?: string; single?: boolean; min?: number };

export function AnswerBox({ itemKey, initial, placeholder, label, single, min = 140 }: Props) {
  const [value, setValue] = useState(initial);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");
  const last = useRef(initial);
  const area = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fit = () => {
    const el = area.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(min, el.scrollHeight)}px`;
  };
  useEffect(fit, []); // eslint-disable-line react-hooks/exhaustive-deps

  const save = async (text: string) => {
    if (text === last.current) return;
    setState("saving");
    await saveAnswer(itemKey, text);
    last.current = text;
    setState("saved");
    setTimeout(() => setState("idle"), 1800);
  };

  const change = (text: string) => {
    setValue(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => save(text), 1200);
  };

  const id = `answer-${itemKey}`;
  const status = state === "saving" ? "Enregistrement…" : state === "saved" ? "Enregistré" : !single && value.trim() ? `${value.trim().split(/\s+/).length} mots` : "";

  return (
    <div className={`answer${single ? " answer-single" : ""}`}>
      {label && <label htmlFor={id} className="answer-label">{label}</label>}
      {single ? (
        <input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => change(e.target.value)}
          onBlur={() => save(value)}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          aria-label={label ? undefined : placeholder}
        />
      ) : (
        <textarea
          ref={area}
          id={id}
          value={value}
          placeholder={placeholder ?? "Écris ton livrable ici."}
          onChange={(e) => {
            change(e.target.value);
            fit();
          }}
          onBlur={() => save(value)}
          aria-label={label ? undefined : "Ton livrable"}
        />
      )}
      <span className="answer-state" aria-live="polite">{status}</span>
    </div>
  );
}
