"use client";
import { useState } from "react";
import Image from "next/image";

interface Img { id: number; url: string; alt: string | null; }

export default function ProductGallery({ images, name }: { images: Img[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/3] bg-gh-surface2 rounded-xl overflow-hidden flex items-center justify-center text-gh-muted">
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] bg-gh-surface2 rounded-xl overflow-hidden mb-3">
        <Image key={current?.id} src={current?.url || ""} alt={current?.alt || name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={img.id} onClick={() => setActive(i)} className={`relative w-20 h-16 rounded-lg overflow-hidden shrink-0 border-2 transition-colors ${i === active ? "border-gh-violet" : "border-gh-border hover:border-gh-violet/50"}`}>
              <Image src={img.url} alt={img.alt || name} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
