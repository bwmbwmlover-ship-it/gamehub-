import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/db";
import { products, productImages, categories, brands, banners, storeSettings, users } from "@/db/schema";
import { eq, desc, count, asc, sql, ne } from "drizzle-orm";
import { getDashboardStats } from "@/lib/data";

export async function GET(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Ruxsatsiz" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const sub = searchParams.get("sub");

  if (sub === "dashboard") {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  }

  if (sub === "products") {
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const offset = (page - 1) * limit;
    const [items, totalResult] = await Promise.all([
      db.select().from(products).orderBy(desc(products.createdAt)).limit(limit).offset(offset),
      db.select({ count: count() }).from(products),
    ]);
    return NextResponse.json({ items, total: totalResult[0]?.count || 0 });
  }

  if (sub === "categories") {
    const cats = await db.select().from(categories).orderBy(asc(categories.sortOrder));
    return NextResponse.json(cats);
  }

  if (sub === "brands") {
    const brs = await db.select().from(brands).orderBy(asc(brands.name));
    return NextResponse.json(brs);
  }

  if (sub === "banners") {
    const bns = await db.select().from(banners).orderBy(asc(banners.sortOrder));
    return NextResponse.json(bns);
  }

  if (sub === "settings") {
    const settings = await db.select().from(storeSettings);
    return NextResponse.json(settings);
  }

  if (sub === "customers") {
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const offset = (page - 1) * limit;
    const [items, totalResult] = await Promise.all([
      db.select().from(users).where(eq(users.role, "customer")).orderBy(desc(users.createdAt)).limit(limit).offset(offset),
      db.select({ count: count() }).from(users).where(eq(users.role, "customer")),
    ]);
    return NextResponse.json({ items, total: totalResult[0]?.count || 0 });
  }

  return NextResponse.json({ error: "Noma'lum sub-resurs" }, { status: 400 });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Ruxsatsiz" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { sub } = body;

    if (sub === "product") {
      const result = await db.insert(products).values({
        slug: body.slug,
        name: body.name,
        description: body.description || "",
        price: body.price,
        discountPrice: body.discountPrice || null,
        categoryId: body.categoryId,
        brandId: body.brandId || null,
        stock: body.stock || 0,
        specs: body.specs || {},
        isNew: body.isNew || false,
        isFeatured: body.isFeatured || false,
        isActive: body.isActive !== false,
      }).returning();
      if (body.images && Array.isArray(body.images)) {
        const imgVals = body.images.map((url: string, i: number) => ({
          productId: result[0].id, url, alt: body.name, sortOrder: i, isPrimary: i === 0,
        }));
        if (imgVals.length > 0) await db.insert(productImages).values(imgVals);
      }
      return NextResponse.json(result[0], { status: 201 });
    }

    if (sub === "category") {
      const result = await db.insert(categories).values({ slug: body.slug, nameUz: body.nameUz, image: body.image || null, description: body.description || null, sortOrder: body.sortOrder || 0 }).returning();
      return NextResponse.json(result[0], { status: 201 });
    }

    if (sub === "brand") {
      const result = await db.insert(brands).values({ slug: body.slug, name: body.name, logo: body.logo || null }).returning();
      return NextResponse.json(result[0], { status: 201 });
    }

    if (sub === "banner") {
      const result = await db.insert(banners).values({ title: body.title, subtitle: body.subtitle || null, image: body.image || null, link: body.link || null, sortOrder: body.sortOrder || 0, isActive: body.isActive !== false }).returning();
      return NextResponse.json(result[0], { status: 201 });
    }

    return NextResponse.json({ error: "Noma'lum sub-resurs" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message || "Server xatosi" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Ruxsatsiz" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { sub, id } = body;

    if (sub === "product") {
      const result = await db.update(products).set({
        slug: body.slug, name: body.name, description: body.description, price: body.price,
        discountPrice: body.discountPrice || null, categoryId: body.categoryId, brandId: body.brandId || null,
        stock: body.stock, specs: body.specs || {}, isNew: body.isNew, isFeatured: body.isFeatured,
        isActive: body.isActive, updatedAt: new Date(),
      }).where(eq(products.id, id)).returning();
      if (body.images && Array.isArray(body.images)) {
        await db.delete(productImages).where(eq(productImages.productId, id));
        const imgVals = body.images.map((url: string, i: number) => ({
          productId: id, url, alt: body.name, sortOrder: i, isPrimary: i === 0,
        }));
        if (imgVals.length > 0) await db.insert(productImages).values(imgVals);
      }
      return NextResponse.json(result[0]);
    }

    if (sub === "category") {
      const result = await db.update(categories).set({ slug: body.slug, nameUz: body.nameUz, image: body.image, description: body.description, sortOrder: body.sortOrder }).where(eq(categories.id, id)).returning();
      return NextResponse.json(result[0]);
    }

    if (sub === "banner") {
      const result = await db.update(banners).set({ title: body.title, subtitle: body.subtitle, image: body.image, link: body.link, sortOrder: body.sortOrder, isActive: body.isActive }).where(eq(banners.id, id)).returning();
      return NextResponse.json(result[0]);
    }

    if (sub === "setting") {
      const existing = await db.select().from(storeSettings).where(eq(storeSettings.key, body.key)).limit(1);
      if (existing.length > 0) {
        await db.update(storeSettings).set({ value: body.value }).where(eq(storeSettings.key, body.key));
      } else {
        await db.insert(storeSettings).values({ key: body.key, value: body.value });
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Noma'lum sub-resurs" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message || "Server xatosi" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Ruxsatsiz" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const sub = searchParams.get("sub");
    const id = Number(searchParams.get("id"));

    if (sub === "product") {
      await db.delete(productImages).where(eq(productImages.productId, id));
      await db.delete(products).where(eq(products.id, id));
      return NextResponse.json({ ok: true });
    }
    if (sub === "category") {
      await db.delete(categories).where(eq(categories.id, id));
      return NextResponse.json({ ok: true });
    }
    if (sub === "banner") {
      await db.delete(banners).where(eq(banners.id, id));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Noma'lum sub-resurs" }, { status: 400 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message || "Server xatosi" }, { status: 500 });
  }
}
