# GAME HUB

Gaming texnikasi do‘koni uchun Next.js loyiha.

## Hozirgi ish rejimi

`DATABASE_URL` bo‘lmasa, sayt ZIP ichidagi 28 ta namunaviy mahsulot bilan katalogni ko‘rsatadi. Narx va mavjudlik maʼlumotlari namunaviy. Buyurtma, hisob va admin panel yopiq bo‘ladi; buyurtma serverga saqlanmaydi.

## To‘liq do‘konni ulash

1. PostgreSQL bazasi yarating va Vercel Project Settings → Environment Variables’da `DATABASE_URL` hamda kamida 32 belgili tasodifiy `JWT_SECRET` ni saqlang. Qiymatlarni GitHub’ga yozmang.
2. Lokal muhitda `.env.example` asosida `.env` yarating. `SEED_ADMIN_EMAIL` va kuchli `SEED_ADMIN_PASSWORD` ni faqat birinchi admin yaratish uchun kiriting.
3. `npm ci`, `npm run db:push` va bir marta `npm run db:seed` ni bajaring. Seed namunaviy katalogni bazaga kiritadi; uni takrorlash mumkin emas.
4. Vercel’da qayta deploy qiling. Shu build’dan keyin namuna rejimi o‘chadi.

`npm run build` bazasiz ham ishlaydi. `npm run typecheck` TypeScript tekshiruvini bajaradi.
