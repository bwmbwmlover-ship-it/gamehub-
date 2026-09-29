import { NextResponse } from "next/server";
import { login, register, createSession, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { getSession } from "@/lib/auth";
import { hasDatabase } from "@/db";

export async function POST(request: Request) {
  if (!hasDatabase || !process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Hisob xizmati hozircha mavjud emas" }, { status: 503 });
  }
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "login") {
      const { email, password } = body;
      if (!email || !password) return NextResponse.json({ error: "Email va parol talab qilinadi" }, { status: 400 });
      const user = await login(email, password);
      if (!user) return NextResponse.json({ error: "Noto'g'ri email yoki parol" }, { status: 401 });
      const token = await createSession(user);
      await setSessionCookie(token);
      return NextResponse.json({ user });
    }

    if (action === "register") {
      const { email, password, name, phone } = body;
      if (!email || !password || !name) return NextResponse.json({ error: "Barcha maydonlar talab qilinadi" }, { status: 400 });
      if (password.length < 6) return NextResponse.json({ error: "Parol kamida 6 belgi bo'lishi kerak" }, { status: 400 });
      try {
        const user = await register(email, password, name, phone);
        const token = await createSession(user);
        await setSessionCookie(token);
        return NextResponse.json({ user });
      } catch {
        return NextResponse.json({ error: "Bu email allaqachon ro'yxatdan o'tgan" }, { status: 409 });
      }
    }

    if (action === "logout") {
      await clearSessionCookie();
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Noma'lum amal" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getSession();
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
