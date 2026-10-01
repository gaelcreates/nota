import { Brand } from "@/components/Mark";
import { LoginForm } from "./LoginForm";
import { LoginPreview } from "@/components/LoginPreview";

export const metadata = { title: "Connexion" };

export default async function Connexion({ searchParams }: PageProps<"/connexion">) {
  const { lien } = await searchParams;
  return (
    <div className="login">
      <div className="login-side">
        <div className="login-form rise">
          <Brand />
          <h1 className="display">Ton <span className="hl">espace</span>.</h1>
          {process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? (
            <LoginForm expired={lien === "expire"} />
          ) : (
            <p className="muted">L&apos;espace ouvre bientôt. Déjà accompagné ? Écris à gael@notaconsulting.ch.</p>
          )}
        </div>
        <p className="login-foot muted"><a href="/" className="link">notaconsulting.ch</a> · Un souci ? gael@notaconsulting.ch</p>
      </div>
      <div className="login-art">
        <LoginPreview />
      </div>
    </div>
  );
}
