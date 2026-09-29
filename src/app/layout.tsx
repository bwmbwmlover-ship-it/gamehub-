import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { FavCompProvider } from "@/components/FavCompContext";
import LayoutWrapper from "@/components/LayoutWrapper";

export const metadata: Metadata = {
  title: "GAME HUB — Gaming texnikasi markazi",
  description: "O'zbekistondagi eng katta gaming texnikasi do'koni. Gaming noutbuklar, kompyuterlar, sichqonchalar, klaviaturalar va aksesuarlar.",
  keywords: "gaming, noutbuk, kompyuter, O'zbekiston, game hub, gaming texnikasi",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uz">
      <body className="bg-gh-bg text-gh-text antialiased min-h-screen flex flex-col">
        {!process.env.DATABASE_URL && (
          <div className="bg-gh-violet-dark px-4 py-2 text-center text-xs text-white">
            Namuna katalog: narx va mavjudlik maʼlumotlari namunaviy. Buyurtma qabul qilinmaydi.
          </div>
        )}
        <CartProvider>
          <FavCompProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </FavCompProvider>
        </CartProvider>
      </body>
    </html>
  );
}
