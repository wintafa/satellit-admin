// src/migrate.ts
import payload from 'payload'
import config from './payload.config'
import path from 'path'
import dotenv from 'dotenv'

// Загружаем переменные окружения из .env файла
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

const migrate = async () => {
  console.log('Запускаем скрипт миграции базы данных...')

  try {
    // Инициализируем Payload
    // Это автоматически проверит базу данных и создаст таблицы, если их нет
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || '',
      config,
      // Локальный API не нужен для миграции, отключаем для скорости
      local: true, 
    })

    console.log('✅ Миграция успешно завершена.')
    process.exit(0)
  } catch (err) {
    console.error('❌ Ошибка во время миграции:', err)
    process.exit(1)
  }
}

// Запускаем функцию
migrate()
