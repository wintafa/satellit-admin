// src/app/(frontend)/news/[slug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import styles from "./newsSlug.module.scss";

// 🔹 Импорт функций из Payload
import { 
  getNewsBySlug, 
  getRelatedNews, 
  getAllNewsSlugs,
  serializePayloadData 
} from '@/lib/get-payload'

// 🔹 Компонент карточки похожей новости (без изменений)
function RelatedNewsCard({ post }: { post: any }) {
  return (
    <Link href={`/news/${post.slug}`} className={styles.relatedCard}>
      <div className={styles.relatedImage}>
        <Image
          src={post.imageUrl}
          alt={post.title}
          width={400}
          height={250}
          className={styles.relatedImg}
          unoptimized={post.imageUrl?.endsWith('.svg')}
        />
      </div>
      <div className={styles.relatedContent}>
        <span className={styles.relatedCategory}>{post.category}</span>
        <h4 className={styles.relatedTitle}>{post.title}</h4>
        <span className={styles.relatedDate}>📅 {post.date}</span>
      </div>
    </Link>
  );
}

// 🔹 Генерация статических путей из Payload (вместо JSON)
export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs()
  return slugs
}

// 🔹 Основная страница — серверный компонент
export default async function NewsSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 🔹 Запрашиваем новость из Payload
  const article = await getNewsBySlug(slug);
  
  if (!article) {
    notFound();
  }
  
  // 🔹 Сериализуем для безопасной передачи в клиентские компоненты (если нужны)
  const serializedArticle = serializePayloadData(article);
  
  // 🔹 Получаем похожие новости
  const relatedPosts = await getRelatedNews(serializedArticle.category, serializedArticle.slug, 3);
  const serializedRelated = serializePayloadData(relatedPosts);

  return (
    <section className={styles.newsSlugSection}>
      <article className={styles.article}>
        {/* Хлебные крошки */}
        <nav className={styles.breadcrumbs}>
          <Link href="/" className={styles.breadcrumbLink}>Главная</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <Link href="/news" className={styles.breadcrumbLink}>Новости</Link>
          <span className={styles.breadcrumbSeparator}>/</span>
          <span className={styles.breadcrumbCurrent}>{serializedArticle.title}</span>
        </nav>

        <div className={styles.articleHeader}>
          <div className={styles.meta}>
            <span className={styles.category}>{serializedArticle.category}</span>
            <span className={styles.date}>
              📅 <time>{serializedArticle.date}</time>
            </span>
            <span className={styles.readTime}>⏱️ {serializedArticle.readTime}</span>
          </div>

          <h1 className={styles.title}>{serializedArticle.title}</h1>
          <p className={styles.excerpt}>{serializedArticle.description}</p>

          <div className={styles.author}>
            <div className={styles.avatar}></div>
            <span>Пресс-служба клуба</span>
          </div>
        </div>

        {/* 🔹 Главное изображение */}
        <div className={styles.featuredImage}>
          <Image
            src={serializedArticle.imageUrl}
            alt={serializedArticle.title}
            width={1200}
            height={600}
            className={styles.featuredImg}
            priority
            unoptimized={serializedArticle.imageUrl?.endsWith('.svg')}
          />
        </div>

        {/* 🔹 Контент статьи */}
        <div className={styles.articleContent}>
          {typeof serializedArticle.fullText === "string"
            ? serializedArticle.fullText
                .split("\n\n")  // Разбиваем по абзацам
                .map((para: string, idx: number) => {
                  // Проверяем на заголовки
                  if (para.startsWith("## ")) {
                    return (
                      <h2 key={idx} className={styles.contentHeading}>
                        {para.replace(/^##\s*/, "")}
                      </h2>
                    );
                  }
                  if (para.startsWith("### ")) {
                    return (
                      <h3 key={idx} className={styles.contentSubheading}>
                        {para.replace(/^###\s*/, "")}
                      </h3>
                    );
                  }
                  // Обычный абзац
                  return <p key={idx}>{para}</p>;
                })
            : null}
        </div>
      </article>

      {/* 🔹 Похожие новости */}
      {serializedRelated.length > 0 && (
        <div className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Читайте также</h2>
          <div className={styles.relatedGrid}>
            {serializedRelated.map((post: any) => (
              <RelatedNewsCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      )}

      {/* 🔹 Кнопка назад */}
      <div className={styles.backSection}>
        <Link href="/news" className={styles.backBtn}>
          ← Все новости
        </Link>
      </div>
    </section>
  );
}