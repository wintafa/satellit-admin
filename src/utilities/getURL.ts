// src/utilities/getURL.ts

/**
 * Возвращает текущий URL сайта (клиентская сторона)
 */
export function getClientSideURL(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}