"use client";

import { useActionState } from "react";
import { inviteMember } from "./actions";
import { Submit } from "@/components/Submit";

export function InviteForm({ today }: { today: string }) {
  const [error, action] = useActionState(inviteMember, null);
  return (
    <form action={action} className="form invite">
      <div className="form-row">
        <label className="field"><span>Prénom et nom</span><input id="full_name" name="full_name" required /></label>
        <label className="field"><span>E-mail</span><input id="email" name="email" type="email" required /></label>
        <label className="field">
          <span>Formule</span>
          <select id="offer" name="offer" defaultValue="nota">
            <option value="nota">Nota</option>
            <option value="nota_plus">Nota+</option>
            <option value="repli">Nota, sans groupe</option>
          </select>
        </label>
        <label className="field"><span>Début</span><input id="start_date" name="start_date" type="date" defaultValue={today} /></label>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <div><Submit className="btn btn-accent">Inviter</Submit></div>
      <p className="muted small">La personne se connecte avec cette adresse, sans mot de passe. Tant que « payé » n&apos;est pas coché dans sa fiche, elle voit seulement son contrat et le paiement. L&apos;accès se ferme six mois après le début.</p>
    </form>
  );
}
