// src/app/(frontend)/news/page.jsx
import { getAllNews } from '@/lib/get-payload'
import { serializePayloadData } from '@/lib/get-payload'
import NewsList from './NewList'
import styles from './newsCard.module.scss'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
// 🔹 Это серверный компонент! (нет "use client")
export default async function NewsPage({ searchParams }) {
  // 🔹 Получаем номер страницы из URL (?page=2)
  const { page: pageParam } = await searchParams
  const page = pageParam ? parseInt(pageParam) : 1
  const ITEMS_PER_PAGE = 8
  
  // 🔹 Запрашиваем данные с сервера
  const { news, totalPages, currentPage, hasNextPage, hasPrevPage } = await getAllNews(page, ITEMS_PER_PAGE)
  
  // 🔹 Сериализуем для безопасной передачи в клиент
  const serializedNews = serializePayloadData(news)
  
  // 🔹 Если новостей нет — показываем заглушку
  if (serializedNews.length === 0) {
    return (
      <section className={styles.newsSection}>
        <div className={styles.container}>
          <h1 className={styles.news_title}>НОВОСТИ КЛУБА</h1>
          <div className={styles.noArticles}>Нет новостей для отображения</div>
        </div>
      </section>
    )
  }
  
  return (
    <section className={styles.newsSection}>
      <div className={styles.container}>
        <h1 className={styles.news_title}>НОВОСТИ КЛУБА</h1>
        
        {/* 🔹 Клиентский компонент: рендерит карточки + пагинацию */}
        <NewsList 
          news={serializedNews}
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
          basePath="/news"
        />
      </div>
    </section>
  )
}