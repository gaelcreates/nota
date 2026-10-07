// Ce qui s'affiche tout de suite au clic, le temps que la page arrive du serveur.
// Le gabarit reprend la forme de la page pour que rien ne saute à l'arrivée.

function Busy({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`skeleton ${className}`} role="status" aria-live="polite">
      <span className="sr-only">Chargement</span>
      {children}
    </div>
  );
}

export function PageSkeleton() {
  return (
    <Busy>
      <span className="sk sk-label" />
      <span className="sk sk-title" />
      <span className="sk sk-line" />
      <div className="sk-grid">
        <span className="sk sk-card" />
        <span className="sk sk-card" />
        <span className="sk sk-card" />
      </div>
    </Busy>
  );
}

export function LessonSkeleton() {
  return (
    <Busy className="lesson-layout">
      <div className="lesson-main">
        <span className="sk sk-label" />
        <span className="sk sk-title" />
        <span className="sk sk-video" />
        <span className="sk sk-line" />
        <span className="sk sk-line sk-short" />
      </div>
      <div className="lesson-side">
        {Array.from({ length: 8 }, (_, i) => <span key={i} className="sk sk-row" />)}
      </div>
    </Busy>
  );
}

export function TableSkeleton() {
  return (
    <Busy>
      <div className="sk-grid sk-grid-4">
        {Array.from({ length: 4 }, (_, i) => <span key={i} className="sk sk-kpi" />)}
      </div>
      {Array.from({ length: 6 }, (_, i) => <span key={i} className="sk sk-row" />)}
    </Busy>
  );
}
