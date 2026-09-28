"use client";

// Bouton qui demande confirmation avant d'envoyer son formulaire
export function Confirm({ children, message, className = "btn btn-ghost btn-sm" }: { children: React.ReactNode; message: string; className?: string }) {
  return (
    <button type="submit" className={className} onClick={(e) => { if (!confirm(message)) e.preventDefault(); }}>
      {children}
    </button>
  );
}
