"use client";

import { Brand } from "@/components/Mark";

// Filet de sécurité hors de l'espace (connexion, contrat) ou quand l'espace lui-même n'a pas pu s'ouvrir.
export default function RootError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="gate">
      <div className="gate-box rise">
        <Brand />
        <h1 className="display">La page n&apos;a pas pu se charger.</h1>
        <p className="muted">Réessaie dans un instant. Si ça continue, écris à gael@notaconsulting.ch.</p>
        <button type="button" className="btn" onClick={() => retry()}>Réessayer</button>
      </div>
    </div>
  );
}
