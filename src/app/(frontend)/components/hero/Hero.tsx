// src/components/hero/Hero.tsx
import styles from "./Hero.module.scss";
import { getHeroStreamUrl } from '@/lib/get-payload';

// 🔹 Отключаем кэширование для этого компонента
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Hero() {
  // 🔹 Получаем ссылку на трансляцию из Payload (всё, что нужно!)
  const streamUrl = await getHeroStreamUrl();

  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        
        {/* Текст — статичный */}
        <div className={styles.heroContent}>
          <h1 className={styles.title}>САТЕЛЛИТ</h1>
          <p className={styles.subtitle}>
            ФУТБОЛЬНАЯ КОМАНДА <br /> ИЗ ГОРОДА ОРЕХОВО-ЗУЕВО
          </p>
        </div>

        {/* Видео — ссылка из админки */}
        <div className={styles.videoColumn}>
          <div className={styles.videoWrapper}>
            <iframe 
              src={streamUrl} 
              frameBorder="0" 
              allowFullScreen 
              scrolling="no"
              className={styles.videoFrame}
              title="VK Video Stream"
              loading="lazy"
              // 🔹 Добавь эти атрибуты для работы видео:
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}