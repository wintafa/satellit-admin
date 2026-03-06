// src/lib/get-payload.ts

// Защита от импорта на клиенте — этот файл должен использоваться только на сервере
if (typeof window !== 'undefined') {
  throw new Error('Этот модуль может быть импортирован только на сервере!')
}

import { getPayload as getPayloadClient } from 'payload'
import config from '@/payload.config'

// Проверка, что код выполняется на сервере
const isServer = typeof window === 'undefined'

// Кэш экземпляра Payload для переиспользования
let payloadInstance: Awaited<ReturnType<typeof getPayloadClient>> | null = null

/**
 * Тип для mock-объекта Payload (совместим с реальным API)
 */
type MockPayload = {
  find: (args: any) => Promise<{ docs: any[]; totalDocs: number; page: number; totalPages: number }>
  findGlobal: (args: any) => Promise<Record<string, any>>
  findByID: (args: any) => Promise<any>
  findGlobalByID: (args: any) => Promise<any>
  create: (args: any) => Promise<any>
  update: (args: any) => Promise<any>
  delete: (args: any) => Promise<any>
  updateGlobal: (args: any) => Promise<any>
}

/**
 * Создаёт mock-объект Payload для использования при сборке без БД
 */
function createMockPayload(): MockPayload {
  const emptyResponse = { docs: [], totalDocs: 0, page: 1, totalPages: 1 }
  
  return {
    find: async () => emptyResponse,
    findGlobal: async () => ({}),
    findByID: async () => null,
    findGlobalByID: async () => null,
    create: async () => null,
    update: async () => null,
    delete: async () => null,
    updateGlobal: async () => null,
  }
}

/**
 * Получение экземпляра Payload для серверных компонентов Next.js
 * 
 * 🛡️ Если DATABASE_URL не задан — возвращает mock-объект, чтобы сборка не падала
 * ✅ Использует кэшированный экземпляр для оптимизации
 * 
 * ⚠️ ВАЖНО: Эта функция должна вызываться ТОЛЬКО на сервере!
 */
export async function getPayload() {
  // Защита от вызова на клиенте
  if (!isServer) {
    throw new Error('getPayload() может быть вызван только на сервере!')
  }

  // 🛡️ Если нет DATABASE_URL — возвращаем mock, чтобы сборка в Docker не падала
  if (!process.env.DATABASE_URL) {
    console.warn('⚠️ DATABASE_URL not set — returning mock payload for build')
    return createMockPayload() as any
  }

  // Если экземпляр уже создан и кэширован — возвращаем его
  if (payloadInstance) {
    return payloadInstance
  }

  try {
    // Создаем новый экземпляр с реальной конфигурацией
    payloadInstance = await getPayloadClient({
      config,
    })
    return payloadInstance
  } catch (error) {
    // 🛡️ Если инициализация упала (например, БД недоступна) — возвращаем mock
    console.warn('⚠️ Failed to initialize Payload, falling back to mock:', error)
    return createMockPayload() as any
  }
}

/**
 * Глубокая очистка данных от несериализуемых свойств
 */
function deepClean(obj: any, seen = new WeakSet()): any {
  if (obj === null || obj === undefined) return null
  if (typeof obj !== 'object') return obj
  
  // Предотвращение циклических ссылок
  if (seen.has(obj)) return null
  seen.add(obj)
  
  if (Array.isArray(obj)) {
    return obj.map(item => deepClean(item, seen)).filter(item => item !== undefined)
  }
  
  const cleaned: any = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      
      // Пропускаем функции, символы и undefined
      if (typeof value === 'function' || typeof value === 'symbol') continue
      
      // Пропускаем специальные свойства Payload с auth-контекстом
      if (key === 'auth' || key === '_auth' || key === '__auth' || key === 'user') continue
      
      const cleanedValue = deepClean(value, seen)
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue
      }
    }
  }
  
  return cleaned
}

/**
 * Сериализация данных для передачи на клиент
 * Убирает несериализуемые свойства (функции, классы, auth контекст и т.д.)
 */
export function serializePayloadData<T>(data: T): T {
  try {
    const cleaned = deepClean(data)
    return JSON.parse(JSON.stringify(cleaned)) as T
  } catch (error) {
    console.error('Ошибка сериализации данных Payload:', error)
    try {
      return deepClean(data) as T
    } catch {
      return {} as T
    }
  }
}

export async function getTeamPlayers() {
  const payload = await getPayload({ })
  
  // Запрашиваем данные о игроках с полным изображением
  const { docs } = await payload.find({
    collection: 'team',
    where: { isPublished: { equals: true } },
    sort: 'name', // Сортируем по имени
    depth: 1,     // Критично для получения полного объекта с фото
    revalidate: 60, // 🔹 Кэш запроса на 60 секунд
  })

  // Форматируем данные и извлекаем URL для фото, если оно есть
  return docs.map((player) => ({
    id: player.id,
    name: player.name,
    role: player.role,
    // 🔹 Получаем URL изображения, если оно есть
    photoUrl: player.photo && typeof player.photo === 'object' 
      ? player.photo.url 
      : '/players/placeholder.png', // Если фото нет, ставим заглушку
    number: player.number || '',
    birthDate: player.birthDate || '',
    games: player.stats?.games || 0, // Статистика
    goals: player.stats?.goals || 0,
    assists: player.stats?.assists || 0,
  }))
}

export async function getGames(limit: number = 20) {
  const payload = await getPayload() // ← Используем наш кэшированный getPayload()
  
  const { docs } = await payload.find({
    collection: 'games',
    where: { 
      isPublished: { equals: true },
    },
    sort: '-date', // Сначала новые матчи
    limit,
    depth: 1, // Подгружаем связанные медиа (логотипы)
    revalidate: 60, // 🔹 Кэш запроса на 60 секунд
  })
  
  // 🔹 Хелпер для получения URL логотипа (универсальный)
  const getLogoUrl = (logo: any, fallback: string) => {
    if (!logo) return fallback
    if (typeof logo === 'object' && logo.url) {
      // Если пришёл объект с url (при depth >= 1)
      let url = logo.url
      // Если URL полный — оставляем только путь (для Next.js Image)
      if (url.startsWith('http')) {
        try {
          url = new URL(url).pathname
        } catch {
          // Если не распарсилось — возвращаем как есть
        }
      }
      return url
    }
    if (typeof logo === 'string') return logo // Текстовый путь из админки
    return fallback
  }
  
  return docs.map((game) => ({
    id: game.id,
    opponent: game.opponent,
    slug: game.slug,
    date: game.date || '',
    score: game.score || '0:0',
    
    // 🔹 Обработка логотипов: Payload Media или текстовый путь
    team1: getLogoUrl(game.team1Logo, '/logo/satellite.svg'),
    team2: getLogoUrl(game.team2Logo, '/logo/opponent-placeholder.svg'),
    
    // 🔹 Статистика с fallback'ами
    stats: {
      goals: game.stats?.goals || 0,
      assists: game.stats?.assists || 0,
      yellowCards: game.stats?.yellowCards || 0,
      redCards: game.stats?.redCards || 0,
    },
  }))
}


export async function getLatestNews(limit: number = 6) {
  const payload = await getPayload()
  
  const { docs } = await payload.find({
    collection: 'news',
    where: { isPublished: { equals: true } },
    sort: '-createdAt', // Сортировка по дате создания (если date — текст)
    limit,
    depth: 1, // Подгружаем связанные медиа
    revalidate: 60, // 🔹 Кэш запроса на 60 секунд
  })
  
  return docs.map((item) => {
    // 🔹 Встроенный хелпер — как в getGames!
    const getImageUrl = (img: any, fallback: string) => {
      if (!img) return fallback
      if (typeof img === 'object' && img.url) {
        let url = img.url
        if (url.startsWith('http')) {
          try { url = new URL(url).pathname } catch {}
        }
        return url
      }
      if (typeof img === 'string') return img
      return fallback
    }
    
    // 🔹 Форматируем под твой JSON-формат
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      date: item.date, // Если поле date — тип 'text', то как есть
      readTime: item.readTime,
      
      // 🔹 Обработка изображения (inline-хелпер)
      imageUrl: getImageUrl(item.image, '/news/placeholder.png'),
      
      slug: item.slug,
    }
  })
}

export async function getAllNews(page: number = 1, limit: number = 8) {  // ← export ОБЯЗАТЕЛЬНО!
  const payload = await getPayload()
  
  const result = await payload.find({
    collection: 'news',
    where: { isPublished: { equals: true } },
    sort: '-createdAt',
    page,
    limit,
    depth: 1,
    revalidate: 60, // 🔹 Кэш запроса на 60 секунд
  })
  
  const getImageUrl = (img: any, fallback: string) => {
    if (!img) return fallback
    if (typeof img === 'object' && img.url) {
      let url = img.url
      if (url.startsWith('http')) {
        try { url = new URL(url).pathname } catch {}
      }
      return url
    }
    if (typeof img === 'string') return img
    return fallback
  }
  
  return {
    news: result.docs.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      category: item.category,
      date: item.date,
      readTime: item.readTime,
      imageUrl: getImageUrl(item.image, '/news/placeholder.png'),
      slug: item.slug,
    })),
    totalPages: result.totalPages,
    currentPage: result.page,
    hasNextPage: result.nextPage !== null,
    hasPrevPage: result.prevPage !== null,
  }
}


export async function getNewsBySlug(slug: string) {
  const payload = await getPayload()
  
  const { docs } = await payload.find({
    collection: 'news',
    where: { 
      slug: { equals: slug },
      isPublished: { equals: true },
    },
    depth: 1,
    revalidate: 60, // 🔹 Кэш запроса на 60 секунд
  })
  
  if (!docs[0]) return null
  
  const item = docs[0]
  
  const getImageUrl = (img: any, fallback: string) => {
    if (!img) return fallback
    if (typeof img === 'object' && img.url) {
      let url = img.url
      if (url.startsWith('http')) {
        try { url = new URL(url).pathname } catch {}
      }
      return url
    }
    if (typeof img === 'string') return img
    return fallback
  }
  
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    date: item.date,
    readTime: item.readTime,
    imageUrl: getImageUrl(item.image, '/news/placeholder.png'),
    slug: item.slug,
    
    // 🔹 ВОЗВРАЩАЕМ полный текст — только для детальной страницы!
    fullText: item.fullText || item.description, // Fallback на description если fullText пуст
  }
}
/**
 * 🔹 Получить похожие новости (для блока "Читайте также")
 */
export async function getRelatedNews(category: string, currentSlug: string, limit: number = 3) {
  if (!category) return []
  
  const payload = await getPayload()
  
  const { docs } = await payload.find({
    collection: 'news',
    where: { 
      and: [
        { category: { equals: category } },
        { slug: { not_equals: currentSlug } },
        { isPublished: { equals: true } },
      ],
    },
    sort: '-createdAt',
    limit,
    depth: 1,
    revalidate: 60, // 🔹 Кэш запроса на 60 секунд
  })
  
  const getImageUrl = (img: any, fallback: string) => {
    if (!img) return fallback
    if (typeof img === 'object' && img.url) {
      let url = img.url
      if (url.startsWith('http')) {
        try { url = new URL(url).pathname } catch {}
      }
      return url
    }
    if (typeof img === 'string') return img
    return fallback
  }
  
  return docs.map((item) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    date: item.date,
    imageUrl: getImageUrl(item.image, '/news/placeholder.png'),
    slug: item.slug,
  }))
}

/**
 * 🔹 Получить все slug'и для генерации статических путей
 */
export async function getAllNewsSlugs() {
  const payload = await getPayload()
  
  const { docs } = await payload.find({
    collection: 'news',
    where: { isPublished: { equals: true } },
    select: { slug: true }, // Запрашиваем только slug для скорости
    revalidate: 60, // 🔹 Кэш запроса на 60 секунд
  })
  
  return docs.map((doc) => ({ slug: doc.slug }))
}


export async function getHeroStreamUrl(): Promise<string> {
  const payload = await getPayload()
  
  try {
    const settings = await payload.findGlobal({
      slug: 'hero-settings',
      depth: 0,
    revalidate: 0, // Не кэшировать глобал
    })
    
    return settings.streamUrl || 'https://live.vkvideo.ru/app/embed/mex1kanec'
  } catch {
    // Fallback если что-то пошло не так
    return 'https://live.vkvideo.ru/app/embed/mex1kanec'
  }
}