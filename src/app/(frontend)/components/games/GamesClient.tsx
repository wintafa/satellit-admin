// src/components/games/GamesClient.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Games.module.scss";

interface GameStats {
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

interface Game {
  id: string;
  opponent: string;
  slug: string;
  date: string;
  score: string;
  team1: string;
  team2: string;
  stats: GameStats;
}

interface GamesClientProps {
  initialGames: Game[];
}

export default function GamesClient({ initialGames }: GamesClientProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [itemsPerRow, setItemsPerRow] = useState(3);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  // Адаптивная сетка
  useEffect(() => {
    const updateRows = () => {
      if (window.innerWidth <= 768) setItemsPerRow(1);
      else if (window.innerWidth <= 1024) setItemsPerRow(2);
      else setItemsPerRow(3);
    };
    updateRows();
    window.addEventListener("resize", updateRows);
    return () => window.removeEventListener("resize", updateRows);
  }, []);

  const visibleGames = isExpanded ? initialGames : initialGames.slice(0, itemsPerRow);
  const closeModal = () => setSelectedGame(null);

  if (initialGames.length === 0) {
    return (
      <section className={styles.gamesSection}>
        <h2 className={styles.title}>ИГРЫ</h2>
        <p>Расписание матчей скоро появится</p>
      </section>
    );
  }

  return (
    <section className={styles.gamesSection} id="games">
      <h2 className={styles.title}>ИГРЫ</h2>
      
      {/* 🔹 Твоя структура — без изменений! */}
      <div className={styles.grid}>
        {visibleGames.map((game) => (
          <div 
            key={game.id} 
            className={styles.card}
            onClick={() => setSelectedGame(game)}
          >
            <div className={styles.matchInfo}>
              <Image 
                src={game.team1} 
                alt="Сателлит" 
                width={80} 
                height={80} 
                className={styles.teamLogo}
                unoptimized={game.team1.endsWith('.svg')} // 🔹 Для SVG
              />
              <span className={styles.score}>{game.score}</span>
              <Image 
                src={game.team2} 
                alt={game.opponent} 
                width={80} 
                height={80} 
                className={styles.teamLogo}
                unoptimized={game.team2.endsWith('.svg')} // 🔹 Для SVG
              />
            </div>
            <div className={styles.cardFooter}>
              <span className={styles.opponentName}>{game.opponent}</span>
              <button className={styles.detailsBtn}>Подробнее об игре</button>
            </div>
          </div>
        ))}
      </div>

      {/* Кнопка "Показать ещё" */}
      <div className={styles.actions}>
        {initialGames.length > itemsPerRow && (
          <button 
            className={styles.showMoreBtn} 
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "Скрыть" : "Смотреть еще"}
          </button>
        )}
      </div>

      {/* 🔹 Модальное окно — твоя структура */}
      {selectedGame && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={closeModal}>
              &times;
            </button>
            
            <div className={styles.modalHeader}>
              <div className={styles.modalTeams}>
                <Image 
                  src={selectedGame.team1} 
                  alt="Мы" 
                  width={60} 
                  height={60}
                  unoptimized={selectedGame.team1.endsWith('.svg')}
                />
                <span className={styles.modalScore}>{selectedGame.score}</span>
                <Image 
                  src={selectedGame.team2} 
                  alt={selectedGame.opponent} 
                  width={60} 
                  height={60}
                  unoptimized={selectedGame.team2.endsWith('.svg')}
                />
              </div>
              <div className={styles.modalMeta}>
                <h3 className={styles.modalOpponent}>{selectedGame.opponent}</h3>
                <p className={styles.modalDate}>{selectedGame.date}</p>
              </div>
            </div>
            
            <div className={styles.modalStats}>
              <div className={styles.statBox}>
                <span className={styles.statIcon}>⚽</span>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{selectedGame.stats.goals}</span>
                  <span className={styles.statLabel}>Голы</span>
                </div>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statIcon}>🎯</span>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{selectedGame.stats.assists}</span>
                  <span className={styles.statLabel}>Передачи</span>
                </div>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statIcon}>🟨</span>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{selectedGame.stats.yellowCards}</span>
                  <span className={styles.statLabel}>Желтые</span>
                </div>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statIcon}>🟥</span>
                <div className={styles.statInfo}>
                  <span className={styles.statValue}>{selectedGame.stats.redCards}</span>
                  <span className={styles.statLabel}>Красные</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}