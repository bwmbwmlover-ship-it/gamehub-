import { db, hasDatabase } from "@/db";
import { products, categories, brands, productImages, orders, orderItems, users, favorites, comparisons, cartItems, banners, storeSettings } from "@/db/schema";
import { eq, and, or, like, gte, lte, gt, desc, asc, sql, count, ne, isNotNull } from "drizzle-orm";
import type { AuthUser } from "./utils";
import { demoCategories, demoBrands, demoProducts, demoBanners, demoSettings, withDemoImages } from "./demo";

// Categories
export async function getAllCategories() {
  if (!hasDatabase) return [...demoCategories].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function getCategoryBySlug(slug: string) {
  if (!hasDatabase) return demoCategories.find(category => category.slug === slug) ?? null;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0] || null;
}

// Brands
export async function getAllBrands() {
  if (!hasDatabase) return [...demoBrands].sort((a, b) => a.name.localeCompare(b.name));
  return db.select().from(brands).orderBy(asc(brands.name));
}

// Products
export async function getProducts(opts: {
  categoryId?: number;
  brandId?: number;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const { categoryId, brandId, search, minPrice, maxPrice, inStock, isNew, isFeatured, sort = "newest", page = 1, limit = 12 } = opts;

  if (!hasDatabase) {
    const filtered = demoProducts.filter(product =>
      product.isActive !== false &&
      (!categoryId || product.categoryId === categoryId) &&
      (!brandId || product.brandId === brandId) &&
      (!search || `${product.name} ${product.description ?? ""}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())) &&
      (minPrice === undefined || product.price >= minPrice) &&
      (maxPrice === undefined || product.price <= maxPrice) &&
      (!inStock || (product.stock ?? 0) > 0) &&
      (!isNew || product.isNew === true) &&
      (!isFeatured || product.isFeatured === true)
    ).sort((a, b) => sort === "price-asc" ? a.price - b.price
      : sort === "price-desc" ? b.price - a.price
      : sort === "popular" ? Number(b.isFeatured) - Number(a.isFeatured)
      : b.id - a.id);
    const safePage = Math.max(1, page);
    const safeLimit = Math.max(1, Math.min(100, limit));
    return {
      items: filtered.slice((safePage - 1) * safeLimit, safePage * safeLimit).map(withDemoImages),
      total: filtered.length, page: safePage, limit: safeLimit,
      totalPages: Math.ceil(filtered.length / safeLimit),
    };
  }

  const conditions = [eq(products.isActive, true)];
  if (categoryId) conditions.push(eq(products.categoryId, categoryId));
  if (brandId) conditions.push(eq(products.brandId, brandId));
  if (search) conditions.push(or(like(products.name, `%${search}%`), like(products.description, `%${search}%`))!);
  if (minPrice) conditions.push(gte(products.price, minPrice));
  if (maxPrice) conditions.push(lte(products.price, maxPrice));
  if (inStock) conditions.push(gt(products.stock, 0));
  if (isNew) conditions.push(eq(products.isNew, true));
  if (isFeatured) conditions.push(eq(products.isFeatured, true));

  const where = and(...conditions);

  let orderBy;
  switch (sort) {
    case "price-asc": orderBy = asc(products.price); break;
    case "price-desc": orderBy = desc(products.price); break;
    case "popular": orderBy = desc(products.isFeatured); break;
    default: orderBy = desc(products.createdAt);
  }

  const offset = (page - 1) * limit;

  const [items, totalResult] = await Promise.all([
    db.select().from(products).where(where).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ count: count() }).from(products).where(where),
  ]);

  const total = totalResult[0]?.count || 0;

  const itemsWithImages = await Promise.all(
    items.map(async (p) => {
      const imgs = await db.select().from(productImages).where(eq(productImages.productId, p.id)).orderBy(asc(productImages.sortOrder));
      return { ...p, images: imgs };
    })
  );

  return { items: itemsWithImages, total, page, limit, totalPages: Math.ceil(total / limit) };
}



export async function getProductBySlug(slug: string) {
  if (!hasDatabase) {
    const product = demoProducts.find(item => item.slug === slug && item.isActive !== false);
    return product ? withDemoImages(product) : null;
  }
  const result = await db.select().from(products).where(and(eq(products.slug, slug), eq(products.isActive, true))).limit(1);
  if (result.length === 0) return null;
  const p = result[0];
  const imgs = await db.select().from(productImages).where(eq(productImages.productId, p.id)).orderBy(asc(productImages.sortOrder));
  return { ...p, images: imgs };
}

export async function getProductById(id: number) {
  if (!hasDatabase) {
    const product = demoProducts.find(item => item.id === id);
    return product ? withDemoImages(product) : null;
  }
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  if (result.length === 0) return null;
  const p = result[0];
  const imgs = await db.select().from(productImages).where(eq(productImages.productId, p.id)).orderBy(asc(productImages.sortOrder));
  return { ...p, images: imgs };
}

export async function getFeaturedProducts(limit = 8) {
  if (!hasDatabase) return demoProducts.filter(item => item.isActive !== false && item.isFeatured).sort((a, b) => b.id - a.id).slice(0, limit).map(withDemoImages);
  const items = await db.select().from(products).where(and(eq(products.isActive, true), eq(products.isFeatured, true))).orderBy(desc(products.createdAt)).limit(limit);
  return Promise.all(items.map(async (p) => {
    const imgs = await db.select().from(productImages).where(eq(productImages.productId, p.id)).orderBy(asc(productImages.sortOrder)).limit(1);
    return { ...p, images: imgs };
  }));
}

export async function getNewArrivals(limit = 8) {
  if (!hasDatabase) return demoProducts.filter(item => item.isActive !== false && item.isNew).sort((a, b) => b.id - a.id).slice(0, limit).map(withDemoImages);
  const items = await db.select().from(products).where(and(eq(products.isActive, true), eq(products.isNew, true))).orderBy(desc(products.createdAt)).limit(limit);
  return Promise.all(items.map(async (p) => {
    const imgs = await db.select().from(productImages).where(eq(productImages.productId, p.id)).orderBy(asc(productImages.sortOrder)).limit(1);
    return { ...p, images: imgs };
  }));
}

export async function getDeals(limit = 8) {
  if (!hasDatabase) return demoProducts.filter(item => item.isActive !== false && item.discountPrice != null).sort((a, b) => b.id - a.id).slice(0, limit).map(withDemoImages);
  const items = await db.select().from(products).where(and(eq(products.isActive, true), isNotNull(products.discountPrice))).orderBy(desc(products.createdAt)).limit(limit);
  return Promise.all(items.map(async (p) => {
    const imgs = await db.select().from(productImages).where(eq(productImages.productId, p.id)).orderBy(asc(productImages.sortOrder)).limit(1);
    return { ...p, images: imgs };
  }));
}

export async function getRelatedProducts(productId: number, categoryId: number, limit = 4) {
  if (!hasDatabase) return demoProducts.filter(item => item.isActive !== false && item.id !== productId && item.categoryId === categoryId).sort((a, b) => b.id - a.id).slice(0, limit).map(withDemoImages);
  const items = await db.select().from(products).where(and(eq(products.isActive, true), eq(products.categoryId, categoryId), ne(products.id, productId))).orderBy(desc(products.createdAt)).limit(limit);
  return Promise.all(items.map(async (p) => {
    const imgs = await db.select().from(productImages).where(eq(productImages.productId, p.id)).orderBy(asc(productImages.sortOrder)).limit(1);
    return { ...p, images: imgs };
  }));
}

// Search suggestions
export async function searchProducts(query: string, limit = 8) {
  if (!query || query.length < 2) return [];
  if (!hasDatabase) return demoProducts.filter(item => item.isActive !== false && item.name.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
    .sort((a, b) => b.id - a.id).slice(0, limit)
    .map(({ id, name, slug, price, discountPrice }) => ({ id, name, slug, price, discountPrice }));
  return db.select({ id: products.id, name: products.name, slug: products.slug, price: products.price, discountPrice: products.discountPrice })
    .from(products)
    .where(and(eq(products.isActive, true), like(products.name, `%${query}%`)))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

// Orders
export async function createOrder(data: {
  userId?: number;
  customerName: string;
  phone: string;
  address?: string;
  region?: string;
  deliveryOption: string;
  paymentMethod: string;
  notes?: string;
  items: { productId: number; productName: string; quantity: number; price: number }[];
}) {
  const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const result = await db.insert(orders).values({
    userId: data.userId,
    customerName: data.customerName,
    phone: data.phone,
    address: data.address,
    region: data.region,
    deliveryOption: data.deliveryOption,
    paymentMethod: data.paymentMethod,
    total,
    notes: data.notes,
    status: "pending",
  }).returning();
  const order = result[0];
  await db.insert(orderItems).values(data.items.map(item => ({ ...item, orderId: order.id })));
  return order;
}

export async function getOrdersByUserId(userId: number) {
  const result = await db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
  return Promise.all(result.map(async (o) => {
    const items = await db.select().from(orderItems).where(eq(orderItems.orderId, o.id));
    return { ...o, items };
  }));
}

export async function getOrderById(id: number) {
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (result.length === 0) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return { ...result[0], items };
}

// Favorites
export async function getFavorites(userId: number) {
  const favs = await db.select({ productId: favorites.productId }).from(favorites).where(eq(favorites.userId, userId));
  return favs.map(f => f.productId);
}

export async function toggleFavorite(userId: number, productId: number) {
  const existing = await db.select().from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.productId, productId))).limit(1);
  if (existing.length > 0) {
    await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.productId, productId)));
    return false;
  } else {
    await db.insert(favorites).values({ userId, productId });
    return true;
  }
}

// Comparisons
export async function getComparisons(userId: number) {
  const comps = await db.select({ productId: comparisons.productId }).from(comparisons).where(eq(comparisons.userId, userId));
  return comps.map(c => c.productId);
}

export async function toggleComparison(userId: number, productId: number) {
  const existing = await db.select().from(comparisons).where(and(eq(comparisons.userId, userId), eq(comparisons.productId, productId))).limit(1);
  if (existing.length > 0) {
    await db.delete(comparisons).where(and(eq(comparisons.userId, userId), eq(comparisons.productId, productId)));
    return false;
  } else {
    const current = await db.select().from(comparisons).where(eq(comparisons.userId, userId));
    if (current.length >= 4) throw new Error("Max 4 products can be compared");
    await db.insert(comparisons).values({ userId, productId });
    return true;
  }
}

// Cart (DB for logged-in users)
export async function getCartItems(userId: number) {
  return db.select({
    id: cartItems.id,
    productId: cartItems.productId,
    quantity: cartItems.quantity,
  }).from(cartItems).where(eq(cartItems.userId, userId));
}

export async function upsertCartItem(userId: number, productId: number, quantity: number) {
  const existing = await db.select().from(cartItems).where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId))).limit(1);
  if (existing.length > 0) {
    await db.update(cartItems).set({ quantity: existing[0].quantity + quantity }).where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values({ userId, productId, quantity });
  }
}

export async function updateCartItemQuantity(id: number, quantity: number) {
  if (quantity <= 0) {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  } else {
    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id));
  }
}

export async function deleteCartItem(id: number) {
  await db.delete(cartItems).where(eq(cartItems.id, id));
}

export async function clearCart(userId: number) {
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

// Banners
export async function getActiveBanners() {
  if (!hasDatabase) return demoBanners.filter(item => item.isActive !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  return db.select().from(banners).where(eq(banners.isActive, true)).orderBy(asc(banners.sortOrder));
}

// Store settings
export async function getSetting(key: string) {
  if (!hasDatabase) return demoSettings.find(item => item.key === key)?.value ?? null;
  const result = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1);
  return result[0]?.value || null;
}

export async function setSetting(key: string, value: string) {
  const existing = await db.select().from(storeSettings).where(eq(storeSettings.key, key)).limit(1);
  if (existing.length > 0) {
    await db.update(storeSettings).set({ value }).where(eq(storeSettings.key, key));
  } else {
    await db.insert(storeSettings).values({ key, value });
  }
}

// Admin dashboard stats
export async function getDashboardStats() {
  const [orderCount, productCount, userCount, revenueResult] = await Promise.all([
    db.select({ count: count() }).from(orders),
    db.select({ count: count() }).from(products).where(eq(products.isActive, true)),
    db.select({ count: count() }).from(users).where(eq(users.role, "customer")),
    db.select({ total: sql<number>`COALESCE(SUM(${orders.total}), 0)` }).from(orders).where(ne(orders.status, "cancelled")),
  ]);

  const recentOrders = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(5);
  const lowStockProducts = await db.select().from(products).where(and(eq(products.isActive, true), lte(products.stock, 5))).orderBy(asc(products.stock)).limit(5);

  return {
    orderCount: orderCount[0]?.count || 0,
    productCount: productCount[0]?.count || 0,
    userCount: userCount[0]?.count || 0,
    revenue: revenueResult[0]?.total || 0,
    recentOrders,
    lowStockProducts,
  };
}

// Admin: all orders
export async function getAllOrders(page = 1, limit = 20, status?: string) {
  const where = status ? eq(orders.status, status) : undefined;
  const offset = (page - 1) * limit;
  const [items, totalResult] = await Promise.all([
    db.select().from(orders).where(where).orderBy(desc(orders.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(orders).where(where),
  ]);
  return { items, total: totalResult[0]?.count || 0, page, limit };
}

// Admin: all customers
export async function getAllCustomers(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const [items, totalResult] = await Promise.all([
    db.select().from(users).where(eq(users.role, "customer")).orderBy(desc(users.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(users).where(eq(users.role, "customer")),
  ]);
  return { items, total: totalResult[0]?.count || 0, page, limit };
}
