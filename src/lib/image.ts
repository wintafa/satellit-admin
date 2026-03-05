// src/lib/image.ts
import config from '@payload-config'

// Получаем базовый URL сайта (из env или дефолт)
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

/**
 * Превращает данные изображения из Payload в чистый URL для Next.js Image
 */
export function getImageUrl(image: any): string | undefined {
  if (!image) return undefined
  
  // Если уже строка — возвращаем как есть
  if (typeof image === 'string') return image
  
  // Если объект с url
  if (typeof image === 'object' && image.url) {
    let url = image.url
    
    // Убираем домен, если он есть (Next.js Image хочет только путь)
    if (url.startsWith('http')) {
      try {
        const parsed = new URL(url)
        // Если домен совпадает с нашим сайтом — оставляем только pathname
        if (parsed.origin === SITE_URL) {
          return parsed.pathname
        }
        // Если внешний домен — возвращаем полный URL (Next.js обработает через remotePatterns)
        return url
      } catch {
        return url
      }
    }
    
    return url
  }
  
  return undefined
}

/**
 * Пропсы для next/image с безопасными fallback'ами
 */
export function getImageProps(image: any, fallbackSrc?: string) {
  const src = getImageUrl(image) || fallbackSrc || '/placeholder.png'
  
  return {
    src,
    alt: typeof image === 'object' ? image.alt || '' : '',
    width: typeof image === 'object' ? image.width : undefined,
    height: typeof image === 'object' ? image.height : undefined,
  }
}