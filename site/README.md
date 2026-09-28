# Nota · site et espace membre

Un seul projet Vercel « nota » sur `notaconsulting.ch` :
- la LP et les pages légales, pages statiques dans `public/` (générées par `../build.py`, qui les copie ici) ;
- l'espace membre sous `/espace`, la connexion sur `/connexion`.

- Next.js 16 (App Router, `proxy.ts`), Supabase (projet « Nota »), Vercel.
- Connexion sans mot de passe : code à 6 chiffres ou lien par e-mail. Seules les adresses invitées depuis l'admin peuvent entrer.
- Accès fermé automatiquement à la date de fin (six mois après le début).

## Lancer en local

```bash
npm install
cp .env.example .env.local   # puis coller la clé publishable
npm run dev
```

Pour regarder l'interface sans base : `NOTA_DEMO=1 npm run dev` (données d'exemple, rien n'est enregistré, jamais actif en production).

## Où est quoi

- `lib/programme.ts` : le départ, les 4 modules et leurs missions, les thèmes de groupe, les étapes micro-app, les livraisons Nota+. Pour ajouter une vidéo à une leçon : champ `video`.
- `supabase/schema.sql` : tables, sécurité ligne par ligne, admin de départ.
- `supabase/email-connexion.html` : le mail de connexion à coller dans Supabase.
- `app/espace` : les pages membres. `app/espace/admin` : membres, appels de groupe, réglages.
- `next.config.ts` : adresses propres de la LP, redirections, en-têtes de sécurité.

## Mettre en ligne

```bash
npx vercel --prod --yes
```
