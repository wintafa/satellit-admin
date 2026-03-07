import Link from "next/link";
import Image from "next/image";
import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Левая часть: Навигация */}
        <nav className={styles.nav}>
           <Link href="/#team">Команда</Link>
            <Link href="/#games">Игры</Link>
            <Link href="/news">Новости</Link>
            <Link href="/#albums">Альбомы</Link>
        </nav>

        {/* Центральная часть: Логотип */}
        <div className={styles.logoWrapper}>
          <Image 
            src="/logo/logoHead.svg" // замени на свой путь
            alt="ФК САТЕЛЛИТ" 
            width={297} 
            height={267.35} 
            className={styles.logo}
          />
        </div>

        {/* Правая часть: Соцсети */}
        <div className={styles.socials}>
          <Link href="https://max.ru/join/AQszKoiHD87t1tdz9A1djDizYMBonilkI1tXLEo8jYU" target="_blank" className={`${styles.socialBtn} ${styles.maxBtn}`}>
             <Image src="/icons/maxWhite1.svg" alt="MAX" width={24} height={24} />
             <span>MAX</span>
          </Link>
          <Link href="https://vk.ru/club230186395" target="_blank" className={styles.socialBtn}>
             <Image src="/icons/vk.svg" alt="VK" width={32} height={32} />
             <span>VK</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}
