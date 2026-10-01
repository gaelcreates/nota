"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

function message(raw: string) {
  if (/saving new user|not invited|non invitée/i.test(raw)) return "Cette adresse n'a pas d'accès. Utilise celle de ton inscription.";
  if (/rate|too many|security purposes/i.test(raw)) return "Trop de demandes d'affilée. Réessaie dans une minute.";
  return "Ça n'a pas marché. Réessaie.";
}

export function LoginForm({ expired }: { expired: boolean }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(expired ? "Ce lien a expiré. Demande-en un nouveau." : "");

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabaseBrowser().auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true, emailRedirectTo: `${location.origin}/auth/confirm` },
    });
    setBusy(false);
    if (error) return setError(message(error.message));
    setSent(true);
  }

  if (sent) {
    return (
      <div className="login-fields sent">
        <span className="sent-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M3 6.5h18v11H3z M3 7l9 6.5L21 7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
        </span>
        <p className="sent-title">C&apos;est envoyé.</p>
        <p className="muted">Tout est dans ta boîte mail, à <strong className="ink">{email}</strong>. Ouvre le lien de connexion, il t&apos;emmène directement dans ton espace.</p>
        <button type="button" className="signout" onClick={() => { setSent(false); setError(""); }}>Changer d&apos;adresse ou renvoyer</button>
      </div>
    );
  }

  return (
    <form className="login-fields" onSubmit={send}>
      <label className="big-field">
        <span className="label">Ton e-mail</span>
        <input id="email" type="email" autoComplete="email" required autoFocus value={email} onChange={(e) => setEmail(e.target.value)} placeholder="toi@exemple.ch" />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="login-actions">
        <button className="btn btn-accent" disabled={busy || !email.includes("@")}>{busy ? "…" : "Recevoir mon lien"}</button>
      </div>
    </form>
  );
}
