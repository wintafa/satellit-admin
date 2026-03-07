"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.scss";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname(); // ✅ Получаем текущий путь

  // Проверяем, находимся ли мы на страницах новостей
  const isNewsPage = pathname?.startsWith('/news');

  // Следим за скроллом для эффекта хедера (только не на новостях)
  useEffect(() => {
    if (isNewsPage) {
      setIsScrolled(true); // ✅ На страницах новостей всегда включено
      return;
    }

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isNewsPage]);

  // Функция для закрытия меню при клике на ссылку
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <div className={styles.logoSide}>
          <Link href="/" className={styles.logo}>
            <Image 
              src="/logo/logoHead.svg" 
              alt="ФК Сателлит" 
              width={100} 
              height={70} 
              priority 
            />
            <span className={styles.clubName}>ФК САТЕЛЛИТ</span>
          </Link>
        </div>

        <div className={styles.rightNav}>
          <nav className={styles.nav}>
            <Link href="/#team">Команда</Link>
            <Link href="/#games">Игры</Link>
            <Link href="/#news">Новости</Link>
            {/* <Link href="/#albums">Альбомы</Link> */}
          </nav>

          <div className={styles.actions}>
            <Link href="https://max.ru/join/AQszKoiHD87t1tdz9A1djDizYMBonilkI1tXLEo8jYU" target="_blank" className={`${styles.socialBtn} ${styles.maxBtn}`}>
              <Image src="/icons/maxWhite1.svg" alt="MAX" width={32} height={32}/>
              <span>MAX</span>
            </Link>
            <Link href="https://vk.ru/club230186395" target="_blank" className={styles.socialBtn}>
              <Image src="/icons/vk.svg" alt="VK" width={32} height={32} />
              <span>VK</span>
            </Link>
          </div>
        </div>

        {/* Кнопка Бургер */}
        <button 
          className={`${styles.burger} ${menuOpen ? styles.burgerActive : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Мобильное меню (Overlay) */}
      <div
        className={`${styles.mobileMenuOverlay} ${
          menuOpen ? styles.mobileMenuOverlayActive : ""
        }`}
        onClick={closeMenu}
      >
        <div
          className={`${styles.mobileMenu} ${
            menuOpen ? styles.mobileMenuActive : ""
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Link href="/" onClick={closeMenu} className={styles.mobile_logo_container}>
            <Image 
              src="/logo/logoHead.svg" 
              alt="Логотип" 
              width={80} 
              height={70} 
              className={styles.mobile_logo} 
            />
          </Link>

          <nav className={styles.nav_mobile}>
            <Link href="/#team">Команда</Link>
            <Link href="/#games">Игры</Link>
            <Link href="/#news" onClick={closeMenu}>Новости</Link>
            
          </nav>

          <div className={styles.mobileContacts}>
            <Link href="tel:+79935714130" className={styles.phone}>
              +7 993 571-41-30
            </Link>

            <div className={styles.socials}>
              <Link href="https://max.ru/join/AQszKoiHD87t1tdz9A1djDizYMBonilkI1tXLEo8jYU" target="_blank">
                <Image src="/icons/maxWhite1.svg" alt="MAX" width={32} height={32} />
              </Link>
              <Link href="https://vk.ru/club230186395" target="_blank">
                <Image src="/icons/vk.svg" alt="VK" width={32} height={32} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}