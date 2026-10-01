import { Brand } from "@/components/Mark";
import { OfferName } from "@/components/Offer";
import { signOut } from "@/app/actions";
import type { Member, Settings } from "@/lib/data";
import { balance, formatIban, money, paymentQr, reference, validIban } from "@/lib/payment";

// Ce que voit un membre tant que Gael n'a pas coché « payé » : le contrat, puis le solde.
export async function PaymentGate({ viewer, settings }: { viewer: Member; settings: Settings }) {
  const due = balance(viewer);
  const currency = settings.currency || "EUR";
  const qr = due > 0 ? await paymentQr(viewer, settings, due) : null;
  const ibanOk = validIban(settings.iban ?? "");
  const first = viewer.full_name.split(" ")[0] || "";

  return (
    <div className="pay">
      <header className="pay-top">
        <Brand />
        <form action={signOut}><button className="signout" type="submit">Se déconnecter</button></form>
      </header>

      <main className="pay-main rise">
        <div className="pay-head">
          <p className="label"><OfferName offer={viewer.offer} /></p>
          <h1 className="display">Encore une <span className="hl">étape</span>{first ? `, ${first}` : ""}.</h1>
          <p className="muted">Ton espace s&apos;ouvre dès que le contrat signé et le solde sont reçus.</p>
        </div>

        <ol className="pay-steps">
          <li className="pay-step">
            <span className="pay-n num">1</span>
            <div className="pay-body">
              <h2>Ton contrat</h2>
              <p className="muted">Lis-le, signe-le, renvoie-le à gael@notaconsulting.ch.</p>
              <a className="btn" href="/contrat" target="_blank" rel="noopener">Ouvrir le contrat</a>
            </div>
          </li>

          <li className="pay-step">
            <span className="pay-n num">2</span>
            <div className="pay-body">
              <h2>Le solde</h2>
              {due > 0 ? (
                <div className="pay-grid">
                  <div className="pay-facts">
                    <div className="pay-amount num">{money(due, currency)}</div>
                    {viewer.due_note && <p className="muted">{viewer.due_note}</p>}
                    {ibanOk ? (
                      <dl className="pay-dl">
                        <div><dt>Titulaire</dt><dd>{settings.beneficiary}</dd></div>
                        <div><dt>IBAN</dt><dd className="num">{formatIban(settings.iban)}</dd></div>
                        <div><dt>Référence</dt><dd>{reference(viewer)}</dd></div>
                      </dl>
                    ) : (
                      <p className="muted">Les coordonnées de paiement arrivent par mail.</p>
                    )}
                  </div>
                  {qr && (
                    <figure className="pay-qr">
                      <div className="pay-qr-box">
                        <div dangerouslySetInnerHTML={{ __html: qr.svg }} />
                        {qr.kind === "swiss" && (
                          <svg className="pay-cross" viewBox="0 0 19.8 19.8" aria-hidden="true">
                            <rect width="19.8" height="19.8" fill="#fff" />
                            <rect x="0.7" y="0.7" width="18.4" height="18.4" fill="#000" />
                            <path d="M8.3 4h3.2v4.3h4.3v3.2h-4.3v4.3H8.3v-4.3H4V8.3h4.3z" fill="#fff" />
                          </svg>
                        )}
                      </div>
                      <figcaption className="muted">Scanne avec l&apos;app de ta banque.</figcaption>
                    </figure>
                  )}
                </div>
              ) : (
                <p className="muted">Rien à régler : tout est payé. Gael ouvre ton espace très vite.</p>
              )}
            </div>
          </li>
        </ol>
      </main>
    </div>
  );
}
