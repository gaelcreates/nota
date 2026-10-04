"use client";

import { useEffect, useRef } from "react";
import { Mark } from "@/components/Mark";

// Aperçu vivant de l'espace sur la page de connexion : une fenêtre en perspective qui suit la souris,
// une mission qui se coche, un compteur qui avance. Données d'exemple, purement décoratives.
const NAV = [
  ["Accueil", ""],
  ["Le départ", "7/10"],
  ["Programme", "3/28"],
  ["Appels", ""],
  ["Ma marque", "5/15"],
  ["Micro-app", ""],
];

export function LoginPreview() {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--px", x.toFixed(3));
        el.style.setProperty("--py", y.toFixed(3));
      });
    };
    const reset = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="lp-stage" ref={stage} aria-hidden="true">
      <div className="lp-grid" />
      <div className="lp-glow" />

      <div className="lp-scene">
        {/* Fenêtre arrière : le programme */}
        <div className="lp-win lp-back">
          <div className="lp-bar"><i /><i /><i /><span>notaconsulting.ch/espace/programme</span></div>
          <div className="lp-prog">
            {[["01", "La marque", 38], ["02", "L'offre", 0], ["03", "Le contenu", 0], ["04", "La conversion", 0]].map(([n, t, w]) => (
              <div key={n as string} className="lp-mod">
                <b>{n}</b>
                <span>{t}</span>
                <em><i style={{ width: `${w}%` }} /></em>
              </div>
            ))}
          </div>
        </div>

        {/* Fenêtre principale : l'accueil */}
        <div className="lp-win lp-front">
          <div className="lp-bar"><i /><i /><i /><span>notaconsulting.ch/espace</span></div>
          <div className="lp-app">
            <aside className="lp-rail">
              <span className="lp-brand"><Mark />Nota</span>
              {NAV.map(([t, c], i) => (
                <span key={t} className={`lp-nav${i === 0 ? " on" : ""}`}>
                  {t}
                  {i === 1 ? (
                    <span className="lp-count"><span className="a">6/10</span><span className="b">7/10</span></span>
                  ) : (
                    c && <span className="lp-c">{c}</span>
                  )}
                </span>
              ))}
            </aside>
            <main className="lp-main">
              <div className="lp-hero">
                <div>
                  <span className="lp-label">Ton espace Nota</span>
                  <span className="lp-h1">Bonjour <span className="lp-hl">Camille</span>.</span>
                </div>
                <span className="lp-week">26</span>
              </div>
              <div className="lp-ruler">
                {Array.from({ length: 28 }, (_, i) => (
                  <i key={i} className={i < 3 ? "p" : i === 3 ? "c" : ""} style={{ ["--i" as string]: i }} />
                ))}
              </div>
              <div className="lp-now">
                <span className="lp-label">Maintenant</span>
                <span className="lp-now-t">Ta banque de preuves</span>
                <span className="lp-now-go">Y aller →</span>
              </div>
              <div className="lp-tiles">
                <div><span className="lp-label">Le départ</span><b><span className="lp-count"><span className="a">6</span><span className="b">7</span></span><small>/10</small></b><em><i className="lp-grow" /></em></div>
                <div><span className="lp-label">Programme</span><b>3<small>/28</small></b><em><i style={{ width: "11%" }} /></em></div>
                <div><span className="lp-label">Appels 1:1</span><b>2</b><span className="lp-mini">Réserver →</span></div>
              </div>
            </main>
          </div>
        </div>

        {/* Cartes flottantes */}
        <div className="lp-float lp-mission">
          <span className="lp-check"><svg viewBox="0 0 16 16"><path d="M3 8.5l3.2 3L13 4.5" /></svg></span>
          <div>
            <span className="lp-mt"><span className="lp-sweep">Ta banque de preuves</span></span>
            <span className="lp-ms">Leçons 01·4 et 02·3 · 30 min</span>
          </div>
        </div>
        <div className="lp-float lp-call">
          <span className="lp-dot" />
          <div><span className="lp-mt">Appel de groupe</span><span className="lp-ms">Jeudi · Hooks</span></div>
        </div>
        <div className="lp-float lp-figs">
          <span className="lp-label">Où tu en es</span>
          <div className="lp-figrow">
            <div><b>28 %</b><span>Parcours</span></div>
            <div><b>5/15</b><span>Ma marque</span></div>
            <div><b>3/6</b><span>Micro-app</span></div>
          </div>
        </div>
        <div className="lp-toast"><span className="lp-tick">✓</span>Mission cochée</div>
      </div>

      <p className="lp-caption">Six mois.<br />Une marque qui tient.</p>
    </div>
  );
}
