// src/utilities/ui.ts (простая версия)
import clsx from 'clsx'
import type { ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}