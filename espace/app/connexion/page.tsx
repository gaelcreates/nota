import { Brand } from "@/components/Mark";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Connexion" };

export default async function Connexion({ searchParams }: PageProps<"/connexion">) {
  const { lien } = await searchParams;
  return (
    <div className="login">
      <div className="login-side">
        <div className="login-form rise">
          <Brand />
          <h1 className="display">Ton <span className="hl">espace</span>.</h1>
          <LoginForm expired={lien === "expire"} />
        </div>
        <p className="login-foot muted">Un souci ? gael@notaconsulting.ch</p>
      </div>
      <div className="login-art" aria-hidden="true">
        <div className="login-ticks">
          {Array.from({ length: 26 }, (_, i) => (
            <i key={i} style={{ ["--i" as string]: i }} className={i < 13 ? "solo" : ""} />
          ))}
        </div>
        <p className="login-art-text display">Six mois.<br />Une marque qui tient.</p>
      </div>
    </div>
  );
}
