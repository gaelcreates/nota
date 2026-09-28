@AGENTS.md

# Espace Nota · règles du projet

- Français partout (interface, commentaires). Pas de tiret cadratin, pas de superlatifs, peu de texte dans l'interface.
- Aucune clé dans le code ni dans Git. Gael colle lui-même les clés dans Vercel et `.env.local`.
- La sécurité passe par les règles RLS de `supabase/schema.sql`. Toute nouvelle table : RLS activée + politiques membre / admin.
- Le contenu du programme vit dans `lib/programme.ts`, pas en base.
- Charte : encre et papier, un seul jaune (#FFC508) qui surligne. Milligram (titres, chiffres), Sh Ad Grotesk (texte), Quicksand pour le mot « Nota ». Le « + » de Nota+ passe par `<Plus />`.
- Ne jamais réutiliser une classe CSS existante pour un autre usage (`.now`, `.cur`, `.done` ont déjà un sens).
