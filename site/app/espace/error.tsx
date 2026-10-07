"use client";

// Une page de l'espace a échoué (base injoignable, par exemple) : la navigation reste, on propose de réessayer.
export default function EspaceError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <div className="head rise">
      <p className="label">Oups</p>
      <h1 className="display">La page n&apos;a pas pu se charger.</h1>
      <p>Réessaie dans un instant. Si ça continue, écris à gael@notaconsulting.ch.</p>
      <div><button type="button" className="btn" onClick={() => retry()}>Réessayer</button></div>
    </div>
  );
}
