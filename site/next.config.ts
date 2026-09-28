import type { NextConfig } from "next";

// Un seul projet : la LP (pages statiques dans public/) et l'espace membre (/espace).
const LEGAL = "conditions-generales|confidentialite|mentions-legales";
const SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self' data:",
  "media-src 'self'",
  `connect-src 'self' ${SUPABASE}`.trim(),
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "www.notaconsulting.ch" }], destination: "https://notaconsulting.ch/:path*", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: `/:page(${LEGAL}).html`, destination: "/:page", permanent: true },
      { source: "/connexion.html", destination: "/connexion", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/index.html" },
        { source: `/:page(${LEGAL})`, destination: "/:page.html" },
      ],
    };
  },
  async headers() {
    const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
      { source: "/fonts/:file*", headers: immutable },
      { source: "/:file(.*\\.(?:png|jpg|mp4))", headers: immutable },
    ];
  },
};

export default nextConfig;
