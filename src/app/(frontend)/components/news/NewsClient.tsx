// src/components/news/NewsClient.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";
import styles from "./News.module.scss";

// 🔹 Типы для TypeScript (опционально, но удобно)
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

interface NewsClientProps {
  initialNews: NewsItem[]; // ← Данные приходят через пропсы, а не из JSON
}

export default function NewsClient({ initialNews }: NewsClientProps) {
  // 🔹 Больше не нужно: const latestNews = newsData.slice(0, 6);
  // Данные уже отфильтрованы на сервере (getLatestNews(6))
  
  return (
    <section className={styles.newsSection} id="news">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>НОВОСТИ</h2>
          <Link href="/news" className={styles.allNewsBtn}>
            Все новости →
          </Link>
        </div>

        <Swiper
          modules={[Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className={styles.swiperContainer}
        >
          {initialNews.map((item) => (
            <SwiperSlide key={item.id}>
              <article className={styles.newsCard}>
                {/* 🔹 Ссылка на детальную страницу — как в оригинале */}
                <Link href={`/news/${item.slug}`} className={styles.cardLink}>
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className={styles.image}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      // 🔹 Для SVG отключаем оптимизацию:
                      unoptimized={item.imageUrl.endsWith('.svg')}
                    />
                  </div>
                  <div className={styles.content}>
                    <span className={styles.date}>{item.date}</span>
                    <h3 className={styles.newsTitle}>{item.title}</h3>
                    <p className={styles.description}>{item.description}</p>
                    <span className={styles.moreBtn}>Подробнее →</span>
                  </div>
                </Link>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}