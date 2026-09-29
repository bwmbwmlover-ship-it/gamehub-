import { NextResponse } from "next/server";
import { createOrder, getOrdersByUserId, getOrderById, getProductById } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { db, hasDatabase } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: Request) {
  if (!hasDatabase) return NextResponse.json({ error: "Namuna rejimida buyurtma qabul qilinmaydi" }, { status: 503 });
  try {
    const body = await request.json();
    if (typeof body.customerName !== "string" || !body.customerName.trim() ||
        typeof body.phone !== "string" || !body.phone.trim() ||
        !Array.isArray(body.items) || body.items.length === 0 || body.items.length > 30) {
      return NextResponse.json({ error: "Buyurtma maʼlumotlari noto‘g‘ri" }, { status: 400 });
    }
    const ids = new Set<number>();
    const items = await Promise.all(body.items.map(async (item: { productId: number; quantity: number }) => {
      if (!Number.isInteger(item.productId) || !Number.isInteger(item.quantity) ||
          item.quantity < 1 || item.quantity > 99 || ids.has(item.productId)) {
        throw new Error("Mahsulot yoki miqdor noto‘g‘ri");
      }
      ids.add(item.productId);
      const product = await getProductById(item.productId);
      if (!product || !product.isActive || (product.stock ?? 0) < item.quantity) {
        throw new Error("Mahsulot mavjud emas yoki zaxira yetarli emas");
      }
      return {
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        price: product.discountPrice ?? product.price,
      };
    }));
    const session = await getSession();
    const order = await createOrder({
      userId: session?.id,
      customerName: body.customerName,
      phone: body.phone,
      address: body.address,
      region: body.region,
      deliveryOption: body.deliveryOption,
      paymentMethod: body.paymentMethod,
      notes: body.notes,
      items,
    });
    return NextResponse.json(order, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}

export async function GET(request: Request) {
  if (!hasDatabase) return NextResponse.json({ error: "Buyurtma xizmati sozlanmagan" }, { status: 503 });
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Autentifikatsiya talab qilinadi" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const order = await getOrderById(Number(id));
      if (!order) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
      if (session.role !== "admin" && order.userId !== session.id) {
        return NextResponse.json({ error: "Ruxsatsiz" }, { status: 403 });
      }
      return NextResponse.json(order);
    }

    if (session.role === "admin") {
      const page = Number(searchParams.get("page")) || 1;
      const limit = Number(searchParams.get("limit")) || 20;
      const status = searchParams.get("status") || undefined;
      const offset = (page - 1) * limit;
      const where = status ? eq(orders.status, status) : undefined;
      const [items, totalResult] = await Promise.all([
        db.select().from(orders).where(where).orderBy(desc(orders.createdAt)).limit(limit).offset(offset),
        db.select({ count: count() }).from(orders).where(where),
      ]);
      return NextResponse.json({ items, total: totalResult[0]?.count || 0, page, limit });
    }

    const userOrders = await getOrdersByUserId(session.id);
    return NextResponse.json(userOrders);
  } catch {
    return NextResponse.json({ error: "Server xatosi" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!hasDatabase) return NextResponse.json({ error: "Buyurtma xizmati sozlanmagan" }, { status: 503 });
  try {
    await requireAdmin();
    const body = await request.json();
    const { id, status } = body;
    if (!id || !status) return NextResponse.json({ error: "ID va status talab qilinadi" }, { status: 400 });
    const result = await db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return NextResponse.json(result[0]);
  } catch {
    return NextResponse.json({ error: "Ruxsatsiz" }, { status: 403 });
  }
}
