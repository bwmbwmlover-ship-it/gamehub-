import snapshot from "./demo-data.json";
import { categories, brands, products, productImages, banners, storeSettings } from "@/db/schema";

export const demoCategories = snapshot.categories as unknown as (typeof categories.$inferSelect)[];
export const demoBrands = snapshot.brands as unknown as (typeof brands.$inferSelect)[];
export const demoProducts = snapshot.products as unknown as (typeof products.$inferSelect)[];
export const demoImages = snapshot.productImages as unknown as (typeof productImages.$inferSelect)[];
export const demoBanners = snapshot.banners as unknown as (typeof banners.$inferSelect)[];
export const demoSettings = snapshot.storeSettings as unknown as (typeof storeSettings.$inferSelect)[];

export function withDemoImages(product: (typeof products.$inferSelect)) {
  return {
    ...product,
    images: demoImages.filter(image => image.productId === product.id)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
  };
}
