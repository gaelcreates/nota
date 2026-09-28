import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Rafraîchit la session et renvoie vers /connexion si personne n'est connecté.
export async function proxy(request: NextRequest) {
  if (process.env.NOTA_DEMO === "1" && process.env.NODE_ENV !== "production") return NextResponse.next();
  // Clé pas encore posée : l'espace n'est pas ouvert, la page de connexion l'affiche
  if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    if (request.nextUrl.pathname.startsWith("/espace")) return NextResponse.redirect(new URL("/connexion", request.url));
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (list) => {
          list.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  const path = request.nextUrl.pathname;
  if (!data?.claims && path.startsWith("/espace")) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    url.search = "";
    return NextResponse.redirect(url);
  }
  if (data?.claims && path === "/connexion") {
    const url = request.nextUrl.clone();
    url.pathname = "/espace";
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: ["/espace/:path*", "/espace", "/connexion", "/auth/:path*"],
};
