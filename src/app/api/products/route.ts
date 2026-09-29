import { NextResponse } from "next/server";
import { getProducts, getAllCategories, getAllBrands, getProductBySlug } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (slug) {
    const product = await getProductBySlug(slug);
    if (!product) return NextResponse.json({ error: "Topilmadi" }, { status: 404 });
    return NextResponse.json(product);
  }

  const sub = searchParams.get("sub");
  if (sub === "categories") {
    const cats = await getAllCategories();
    return NextResponse.json(cats);
  }
  if (sub === "brands") {
    const brands = await getAllBrands();
    return NextResponse.json(brands);
  }

  const result = await getProducts({
    categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
    brandId: searchParams.get("brandId") ? Number(searchParams.get("brandId")) : undefined,
    search: searchParams.get("search") || undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    inStock: searchParams.get("inStock") === "true",
    isNew: searchParams.get("isNew") === "true",
    sort: searchParams.get("sort") || undefined,
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 12,
  });
  return NextResponse.json(result);
}
