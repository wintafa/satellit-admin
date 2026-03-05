// src/components/hero/Hero.tsx
import styles from "./Hero.module.scss";
import { getHeroStreamUrl } from '@/lib/get-payload';
export const revalidate = 60;
export default async function Hero() {
  // 🔹 Получаем ссылку на трансляцию из Payload
  const streamUrl = await getHeroStreamUrl();
  
  return (
    <section className={styles.hero}>
      <div className={styles.heroGrid}>
        
        {/* Текст — статичный, как у тебя */}
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
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}