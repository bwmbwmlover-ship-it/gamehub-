import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db, hasDatabase } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { AuthUser } from "./utils";

const COOKIE_NAME = "gh_session";

function sessionSecret() {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required for sessions");
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(user: AuthUser): Promise<string> {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(sessionSecret());
  return token;
}

export async function getSession(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, sessionSecret());
    return payload as unknown as AuthUser;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function login(email: string, password: string): Promise<AuthUser | null> {
  if (!hasDatabase) return null;
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (user.length === 0) return null;
  const valid = await verifyPassword(password, user[0].passwordHash);
  if (!valid) return null;
  return { id: user[0].id, email: user[0].email, name: user[0].name, role: user[0].role, phone: user[0].phone };
}

export async function register(email: string, password: string, name: string, phone?: string): Promise<AuthUser> {
  if (!hasDatabase) throw new Error("Database is not configured");
  const hash = await hashPassword(password);
  const result = await db.insert(users).values({ email, passwordHash: hash, name, phone, role: "customer" }).returning();
  const u = result[0];
  return { id: u.id, email: u.email, name: u.name, role: u.role, phone: u.phone };
}

export async function requireAdmin(): Promise<AuthUser> {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}
