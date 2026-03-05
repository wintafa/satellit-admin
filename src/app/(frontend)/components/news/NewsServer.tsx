// src/components/news/NewsServer.tsx
import { getLatestNews } from '@/lib/get-payload'
import { serializePayloadData } from '@/lib/get-payload'
import NewsClient from './NewsClient' // Твой старый компонент, чуть переименованный

export default async function NewsServer() {
  // Получаем данные с сервера
  const news = await getLatestNews(6)
  
  // Сериализуем для безопасной передачи в клиентский компонент
  const serializedNews = serializePayloadData(news)
  
  return <NewsClient initialNews={serializedNews} />
}