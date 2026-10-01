"use client";

export function PrintButton() {
  return <button type="button" className="btn" onClick={() => window.print()}>Imprimer ou enregistrer en PDF</button>;
}
