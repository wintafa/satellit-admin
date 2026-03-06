// src/components/news/NewsList.tsx
"use client";  // ← Обязательно! Здесь интерактив
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'
import Link from "next/link";
import styles from "./newsCard.module.scss"; // Твои стили

// 🔹 Типы для TypeScript
interface NewsItem {
  id: string | number;
  title: string;
  description: string;
  category?: string;
  date: string;
  readTime?: string;
  imageUrl: string;
  slug: string;
}

interface NewsListProps {
  news: NewsItem[];
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  basePath?: string;
}

// 🔹 Твой компонент карточки — без изменений!
function NewsCard({ title, description, category, date, readTime, imageUrl, slug }: NewsItem) {
  return (
    <Link href={`/news/${slug}`} className={styles.newsCard}>
      <div className={styles.imageWrapper}>
        <img 
          src={imageUrl} 
          alt={title} 
          className={styles.newsImage}
          loading="lazy"
        />
        <div className={styles.categoryBadge}>{category}</div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.date}>📅 {date}</span>
          <span className={styles.readTime}>⏱️ {readTime}</span>
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.excerpt}>{description}</p>

        <div className={styles.footer}>
          <span className={styles.readMore}>Читать далее →</span>
        </div>
      </div>
    </Link>
  );
}

// 🔹 Твой компонент пагинации — без изменений!
function Pagination({ currentPage, totalPages, basePath = "/news" }: { 
  currentPage: number; 
  totalPages: number; 
  basePath?: string;
}) {
  const pages = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const getPageHref = (page: number) => {
    if (page === 1) return basePath;
    return `${basePath}?page=${page}`;
  };

  return (
    <div className={styles.pagination}>
      <Link
        href={currentPage > 1 ? getPageHref(currentPage - 1) : "#"}
        className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ""}`}
        aria-label="Предыдущая страница"
      >
        ← Назад
      </Link>

      <div className={styles.pageNumbers}>
        {startPage > 1 && (
          <>
            <Link href={getPageHref(1)} className={`${styles.pageButton} ${currentPage === 1 ? styles.active : ""}`}>1</Link>
            {startPage > 2 && <span className={styles.ellipsis}>...</span>}
          </>
        )}

        {pages.map((page) => (
          <Link
            key={page}
            href={getPageHref(page)}
            className={`${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
            aria-label={`Страница ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </Link>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className={styles.ellipsis}>...</span>}
            <Link href={getPageHref(totalPages)} className={`${styles.pageButton} ${currentPage === totalPages ? styles.active : ""}`}>
              {totalPages}
            </Link>
          </>
        )}
      </div>

      <Link
        href={currentPage < totalPages ? getPageHref(currentPage + 1) : "#"}
        className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ""}`}
        aria-label="Следующая страница"
      >
        Вперед →
      </Link>
    </div>
  );
}

// 🔹 Главный компонент списка
export default function NewsList({ 
  news, 
  currentPage, 
  totalPages, 
  hasNextPage, 
  hasPrevPage, 
  basePath = "/news" 
}: NewsListProps) {
  return (
    <>
      <div className={styles.grid}>
        {news.map((post) => (
          <NewsCard key={post.id} {...post} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath={basePath}
        />
      )}
    </>
  );
}