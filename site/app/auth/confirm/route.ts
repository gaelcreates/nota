import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

// Lien reçu par e-mail : fonctionne même s'il est ouvert dans un autre navigateur.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const token_hash = searchParams.get("token_hash");
  const type = (searchParams.get("type") ?? "email") as EmailOtpType;
  if (token_hash) {
    const db = await supabaseServer();
    const { error } = await db.auth.verifyOtp({ type, token_hash });
    if (!error) return NextResponse.redirect(`${origin}/espace`);
  }
  return NextResponse.redirect(`${origin}/connexion?lien=expire`);
}
