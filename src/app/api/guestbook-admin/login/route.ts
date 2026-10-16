import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const origin = request.headers.get("origin") ?? "";
  const configuredOrigin = process.env.SUPABASE_AUTH_REDIRECT_ORIGIN?.trim().replace(/\/$/, "");
  const allowedOrigins = new Set(["http://localhost:3000", configuredOrigin].filter(Boolean));

  if (!allowedOrigins.has(origin)) {
    return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const ownerEmail = process.env.SUPABASE_GUESTBOOK_OWNER_EMAIL?.trim().toLowerCase();

  if (!supabaseUrl || !publishableKey || !ownerEmail) {
    return NextResponse.json({ error: "관리자 로그인을 준비하지 못했어요." }, { status: 503 });
  }

  const supabase = createClient(supabaseUrl, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
  const { error } = await supabase.auth.signInWithOtp({
    email: ownerEmail,
    options: { emailRedirectTo: `${origin}/admin`, shouldCreateUser: true },
  });

  if (error) {
    console.error("Guestbook owner login email could not be sent:", error.message);
    return NextResponse.json({ error: "로그인 링크를 보내지 못했어요. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }

  return NextResponse.json({ sent: true }, { headers: { "Cache-Control": "no-store" } });
}
