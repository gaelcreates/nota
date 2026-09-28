"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

function message(raw: string) {
  if (/saving new user|not invited|non invitée/i.test(raw)) return "Cette adresse n'a pas d'accès. Utilise celle de ton inscription.";
  if (/rate|too many|security purposes/i.test(raw)) return "Trop de demandes d'affilée. Réessaie dans une minute.";
  if (/expired|invalid/i.test(raw)) return "Ce code n'est pas bon ou a expiré.";
  return "Ça n'a pas marché. Réessaie.";
}

export function LoginForm({ expired }: { expired: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(expired ? "Ce lien a expiré. Demande un nouveau code." : "");

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
    setStep("code");
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabaseBrowser().auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: "email" });
    if (error) {
      setBusy(false);
      return setError(message(error.message));
    }
    router.replace("/espace");
    router.refresh();
  }

  if (step === "code") {
    return (
      <form className="login-fields" onSubmit={verify}>
        <p className="muted">Un code vient d&apos;arriver sur <strong className="ink">{email}</strong>. Tu peux aussi cliquer sur le lien du mail.</p>
        <label className="big-field">
          <span className="label">Code</span>
          <input
            id="code"
            className="num code-input"
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            maxLength={10}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
          />
        </label>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="login-actions">
          <button className="btn btn-accent" disabled={busy || code.length < 6}>{busy ? "…" : "Entrer"}</button>
          <button type="button" className="signout" onClick={() => { setStep("email"); setCode(""); setError(""); }}>Changer d&apos;adresse</button>
        </div>
      </form>
    );
  }

  return (
    <form className="login-fields" onSubmit={send}>
      <label className="big-field">
        <span className="label">Ton e-mail</span>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="toi@exemple.ch"
        />
      </label>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="login-actions">
        <button className="btn btn-accent" disabled={busy || !email.includes("@")}>{busy ? "…" : "Recevoir mon code"}</button>
      </div>
    </form>
  );
}
