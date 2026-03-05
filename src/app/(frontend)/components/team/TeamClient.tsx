// src/components/team/TeamClient.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Team.module.scss";

// Типы для TypeScript (опционально, но удобно)
interface Player {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;  // ← Чистый URL из Payload
  number: string;
  birthDate?: string;
//   games: number;
//   goals: number;
//   assists: number;
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

  // Адаптивная сетка: количество игроков в ряду в зависимости от ширины экрана
 useEffect(() => {
  const updateRows = () => {
    if (window.innerWidth <= 768) {
      setItemsPerRow(1); // 📱 Телефоны
    } else if (window.innerWidth <= 1024) {
      setItemsPerRow(2); // 📟 Планшеты
    } else if (window.innerWidth <= 1450) {
      setItemsPerRow(3); // 💻 Ноутбуки
    } else {
      setItemsPerRow(4); // 🖥️ ПК (большие экраны)
    }
  };

  updateRows();
  window.addEventListener("resize", updateRows);
  return () => window.removeEventListener("resize", updateRows);
}, []);

  // Показываем всех игроков или только первые N в зависимости от isExpanded
  const visiblePlayers = isExpanded ? initialPlayers : initialPlayers.slice(0, itemsPerRow);
  
  const closeModal = () => setSelectedPlayer(null);

  // Если игроков нет — показываем заглушку
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
            {/* 🔹 Фон только на imageWrapper — через inline-style */}
            <div 
            
                className={styles.imageWrapper}
                style={player.photoUrl ? { 
                backgroundImage: `url(${player.photoUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                } : undefined}
            >
                {/* 🔹 Убираем <Image>, оставляем только overlay и hint */}
                <div className={styles.clickHint}>Подробнее</div>
            </div>
            
            <div className={styles.info}>
                <h3 className={styles.name}>{player.name}</h3>
                <p className={styles.role}>{player.role}</p>
            </div>
            </div>
        ))}
        </div>

      {/* Кнопка "Показать ещё", если игроков больше, чем видно */}
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

      {/* Модальное окно с детальной информацией */}
      {selectedPlayer && (
  <div className={styles.modalOverlay} onClick={closeModal}>
    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
      <button className={styles.modalClose} onClick={closeModal}>
        &times;
      </button>
      
      <div className={styles.modalBody}>
        {/* 🔹 modalImage с фоном через inline-style */}
        <div 
          className={styles.modalImage}
          style={selectedPlayer.photoUrl ? { 
            backgroundImage: `url(${selectedPlayer.photoUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          } : undefined}
        >
          {/* 🔹 Убираем <Image>, если используешь backgroundImage */}
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
              <span className={styles.statValue}>{selectedPlayer.games}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Голы</span>
              <span className={styles.statValue}>{selectedPlayer.goals}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Передачи</span>
              <span className={styles.statValue}>{selectedPlayer.assists}</span>
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