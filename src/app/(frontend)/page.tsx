// src/app/(frontend)/page.tsx
import Hero from "./components/hero/Hero"
import TeamServer from "./components/team/TeamServer"
import Games from "./components/games/GamesServer"
import NewsServer from "./components/news/NewsServer"

// 🔹 Импортируем функции получения данных
import { 
  getLatestNews, 
  getGames, 
  getHeroStreamUrl 
} from '@/lib/get-payload'

// 🔹 Настройки Next.js — динамический режим (никакого кэша при build)
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

// 🔹 Функция получения данных с защитой от падения
async function getSafeNews() {
  try {
    return await getLatestNews(6);
  } catch (e: any) {
    console.error('⚠️ News fetch failed:', e.message);
    return [];
  }
}

async function getSafeGames() {
  try {
    return await getGames(2);
  } catch (e: any) {
    console.error('⚠️ Games fetch failed:', e.message);
    return [];
  }
}

async function getSafeStreamUrl() {
  try {
    return await getHeroStreamUrl();
  } catch (e: any) {
    console.error('⚠️ Stream URL fetch failed:', e.message);
    return 'https://live.vkvideo.ru/app/embed/mex1kanec';
  }
}

// 🔹 ЕДИНСТВЕННЫЙ экспорт по умолчанию — асинхронный серверный компонент
export default async function HomePage() {
  // 🔹 Получаем данные с защитой
  const [news, games, streamUrl] = await Promise.all([
    getSafeNews(),
    getSafeGames(), 
    getSafeStreamUrl(),
  ]);

  return (
    <>
      {/* 🔹 Передаём данные в компоненты как props */}
      <Hero streamUrl={streamUrl} />
      <TeamServer />
      <Games games={games} />
      <NewsServer news={news} />
    </>
  );
}