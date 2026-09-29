"use client";
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface FavCompContextType {
  favorites: number[];
  comparisons: number[];
  toggleFavorite: (id: number) => void;
  toggleComparison: (id: number) => void;
  isFavorite: (id: number) => boolean;
  isComparison: (id: number) => boolean;
}

const FCContext = createContext<FavCompContextType | null>(null);

export function FavCompProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [comparisons, setComparisons] = useState<number[]>([]);

  useEffect(() => {
    try {
      const f = localStorage.getItem("gh_favorites");
      if (f) setFavorites(JSON.parse(f));
      const c = localStorage.getItem("gh_comparisons");
      if (c) setComparisons(JSON.parse(c));
    } catch {}
  }, []);

  useEffect(() => { localStorage.setItem("gh_favorites", JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem("gh_comparisons", JSON.stringify(comparisons)); }, [comparisons]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };
  const toggleComparison = (id: number) => {
    setComparisons(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  };
  const isFavorite = (id: number) => favorites.includes(id);
  const isComparison = (id: number) => comparisons.includes(id);

  return (
    <FCContext.Provider value={{ favorites, comparisons, toggleFavorite, toggleComparison, isFavorite, isComparison }}>
      {children}
    </FCContext.Provider>
  );
}

export function useFavComp() {
  const ctx = useContext(FCContext);
  if (!ctx) throw new Error("useFavComp must be used within FavCompProvider");
  return ctx;
}
