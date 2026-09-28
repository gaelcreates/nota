"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export function Submit({ children, className = "btn", done = "Enregistré" }: { children: React.ReactNode; className?: string; done?: string }) {
  const { pending } = useFormStatus();
  const was = useRef(false);
  const [flash, setFlash] = useState(false);
  useEffect(() => {
    if (was.current && !pending) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 1800);
      return () => clearTimeout(t);
    }
    was.current = pending;
  }, [pending]);
  return (
    <button type="submit" className={className} disabled={pending}>
      {pending ? "…" : flash ? done : children}
    </button>
  );
}
