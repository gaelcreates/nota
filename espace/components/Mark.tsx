export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="-8 -8 116 116" aria-hidden="true">
      <g fill="currentColor" stroke="currentColor" strokeWidth="13" strokeLinejoin="round">
        <polygon points="0.5,6 58.5,29 0.5,72" />
        <polygon points="99.5,94 41.5,71 99.5,28" />
      </g>
    </svg>
  );
}

export function Brand() {
  return (
    <span className="brand">
      <Mark />
      Nota
    </span>
  );
}
