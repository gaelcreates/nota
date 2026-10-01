"use client";

import { useOptimistic, useState, useTransition } from "react";
import { setMission, setMissionLink } from "@/app/actions";

type Props = {
  itemKey: string;
  title: string;
  body?: string;
  done: boolean;
  link: string | null;
  meta?: React.ReactNode;
  extra?: React.ReactNode;
  readOnly?: boolean;
  children?: React.ReactNode;
};

export function MissionRow({ itemKey, title, body, done, link, meta, extra, readOnly, children }: Props) {
  const [pending, start] = useTransition();
  const [isDone, setDone] = useOptimistic(done);
  const [value, setValue] = useState(link ?? "");
  const [saved, setSaved] = useState(false);

  const toggle = () =>
    start(async () => {
      setDone(!isDone);
      await setMission(itemKey, !isDone);
    });

  const save = () => {
    if ((link ?? "") === value.trim()) return;
    start(async () => {
      await setMissionLink(itemKey, value);
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
    });
  };

  return (
    <div className={`row${isDone ? " done" : ""}`}>
      <button
        type="button"
        className="check"
        aria-pressed={isDone}
        aria-label={isDone ? `Décocher ${title}` : `Cocher ${title}`}
        onClick={toggle}
        disabled={readOnly || pending}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div>
        <div className="row-title"><span className="t">{title}</span></div>
        {body && <p className="row-body">{body}</p>}
        {(extra || isDone || link) && (
          <div className="row-extra">
            {extra}
            {!readOnly && (isDone || link) && (
              <label className="inline-link">
                <input
                  type="url"
                  inputMode="url"
                  placeholder="Lien vers ton livrable"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onBlur={save}
                  onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur())}
                  aria-label={`Lien du livrable : ${title}`}
                />
                {saved && <span className="note-ok">Enregistré</span>}
              </label>
            )}
            {readOnly && link && (
              <a className="link" href={link} target="_blank" rel="noopener noreferrer">Voir le livrable</a>
            )}
          </div>
        )}
        {children}
      </div>
      {meta && <div className="row-meta">{meta}</div>}
    </div>
  );
}
