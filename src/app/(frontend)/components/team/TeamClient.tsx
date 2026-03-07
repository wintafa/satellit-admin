// src/components/team/TeamClient.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";  // ✅ Уже импортирован
import styles from "./Team.module.scss";

interface Player {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
  number: string;
  birthDate?: string;
  stats?: {
    games?: number;
    goals?: number;
    assists?: number;
  };
}

interface TeamClientProps {
  initialPlayers: Player[];
}

export default function TeamClient({ initialPlayers }: TeamClientProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const updateRows = () => {
      if (window.innerWidth <= 768) setItemsPerRow(1);
      else if (window.innerWidth <= 1024) setItemsPerRow(2);
      else if (window.innerWidth <= 1450) setItemsPerRow(3);
      else setItemsPerRow(4);
    };
    updateRows();
    window.addEventListener("resize", updateRows);
    return () => window.removeEventListener("resize", updateRows);
  }, []);

  const visiblePlayers = isExpanded ? initialPlayers : initialPlayers.slice(0, itemsPerRow);
  const closeModal = () => setSelectedPlayer(null);

  if (initialPlayers.length === 0) {
    return (
      <section className={styles.teamSection}>
        <h2 className={styles.title}>КОМАНДА</h2>
        <p>Список игроков пуст</p>
      </section>
    );
  }

  return (
    <section className={styles.teamSection} id="team">
      <h2 className={styles.title}>КОМАНДА</h2>
      
      <div className={styles.grid}>
        {visiblePlayers.map((player) => (
          <div 
            key={player.id} 
            className={styles.card}
            onClick={() => setSelectedPlayer(player)}
          >
            {/* 🔹 imageWrapper с относительным позиционированием */}
            <div className={styles.imageWrapper}>
              
              {/* 🔹 Next.js Image с fill (работает как background) */}
              {player.photoUrl && (
                <Image
                  src={player.photoUrl}  // ✅ Payload уже отдаёт полный URL
                  alt={player.name}
                  fill  // ✅ Занимает весь родительский блок
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={styles.playerImage}  // ← Добавь в CSS object-fit: cover
                  priority={visiblePlayers.indexOf(player) < 4}  // Первые 4 грузим сразу
                  quality={75}  // Баланс качество/размер
                />
              )}
              
              {/* 🔹 Оверлей поверх изображения */}
              <div className={styles.overlay}>
                <div className={styles.clickHint}>Подробнее</div>
              </div>
              
            </div>
            
            <div className={styles.info}>
              <h3 className={styles.name}>{player.name}</h3>
              <p className={styles.role}>{player.role}</p>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        {initialPlayers.length > itemsPerRow && (
          <button 
            className={styles.showMoreBtn} 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Скрыть" : "Смотреть еще"}
          </button>
        )}
      </div>

      {/* Модальное окно */}
      {selectedPlayer && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>&times;</button>
            
            <div className={styles.modalBody}>
              {/* 🔹 Modal image с Next.js Image */}
              <div className={styles.modalImageWrapper}>
                {selectedPlayer.photoUrl && (
                  <Image
                    src={selectedPlayer.photoUrl}
                    alt={selectedPlayer.name}
                    fill
                    sizes="90vw"
                    className={styles.modalImage}
                    priority
                    quality={85}
                  />
                )}
              </div>
              
              <div className={styles.modalInfo}>
                <h3 className={styles.modalName}>{selectedPlayer.name}</h3>
                <p className={styles.modalRole}>{selectedPlayer.role}</p>
                <p className={styles.modalNumber}>№ {selectedPlayer.number}</p>
                
                <div className={styles.statsGrid}>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Дата рождения</span>
                    <span className={styles.statValue}>{selectedPlayer.birthDate}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Игры</span>
                    <span className={styles.statValue}>{selectedPlayer.stats?.games}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Голы</span>
                    <span className={styles.statValue}>{selectedPlayer.stats?.goals}</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statLabel}>Передачи</span>
                    <span className={styles.statValue}>{selectedPlayer.stats?.assists}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}