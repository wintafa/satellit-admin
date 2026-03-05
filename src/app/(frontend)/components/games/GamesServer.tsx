// src/components/games/GamesServer.tsx
import { getPayload } from 'payload'
import config from '@payload-config'
import GamesClient from './GamesClient'

export default async function GamesServer() {
  const payload = await getPayload({ config })
  
  // Получаем матчи из коллекции 'games'
  const { docs: games } = await payload.find({
    collection: 'games',
    where: { isPublished: { equals: true } },
    sort: '-date', // Сначала новые
    limit: 20,
    depth: 1, // Подгружаем связанные медиа (логотипы)
  })

  // Форматируем данные под формат компонента
  const formattedGames = games.map((game) => {
    // 🔹 Обработка логотипов: если загружены через Media — берём URL, иначе — текстовый путь
    const getLogoUrl = (logo: any, fallback: string) => {
      if (!logo) return fallback
      if (typeof logo === 'object' && logo.url) return logo.url
      if (typeof logo === 'string') return logo
      return fallback
    }

    return {
      id: game.id,
      opponent: game.opponent,
      slug: game.slug,
      date: game.date || '',
      score: game.score || '0:0',
      team1: getLogoUrl(game.team1Logo, '/logo/satellite.svg'),
      team2: getLogoUrl(game.team2Logo, '/logo/opponent-placeholder.svg'),
      stats: game.stats || {
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
      },
    }
  })

  return <GamesClient initialGames={formattedGames} />
}