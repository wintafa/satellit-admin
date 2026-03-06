export function parseVkStreamUrl(input: string): string {
  if (!input) return 'https://live.vkvideo.ru/app/embed/mex1kanec'
  
  // Убираем пробелы по краям
  const url = input.trim()
  
  // Если уже правильный embed-формат — возвращаем как есть
  if (url.includes('/app/embed/')) {
    return url
  }
  
  try {
    // Парсим URL
    const parsed = new URL(url)
    const pathname = parsed.pathname
    
    // Извлекаем последний сегмент пути (канал/стрим)
    // Пример: /mex1kanec → mex1kanec
    // Пример: /video-12345_45678 → video-12345_45678
    const segments = pathname.split('/').filter(Boolean)
    const lastSegment = segments[segments.length - 1]
    
    if (lastSegment) {
      return `https://live.vkvideo.ru/app/embed/${lastSegment}`
    }
  } catch {
    // Если не удалось распарсить — пробуем взять последнее слово после слэша
    const match = url.match(/\/([^\/\?#]+)$/);
    if (match?.[1]) {
      return `https://live.vkvideo.ru/app/embed/${match[1]}`
    }
  }
  
  // Фоллбэк: возвращаем дефолт или исходную ссылку
  return 'https://live.vkvideo.ru/app/embed/mex1kanec'
}