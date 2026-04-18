// payload.config.ts
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: '- Satellite CMS',
    },
  },

  collections: [
    // 👤 Пользователи
    {
      slug: 'users',
      labels: {
        singular: 'Пользователь',
        plural: 'Пользователи',
      },
      auth: true,
      fields: [
        { name: 'name', type: 'text', required: true },
      ],
    },

    // 👥 Команда (игроки)
    {
      slug: 'team',
      labels: {
        singular: 'Игрок',
        plural: 'Команда',
      },
      admin: { useAsTitle: 'name' },
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Имя' },
        { name: 'slug', type: 'text', required: true, unique: true, label: 'URL slug' },
        { name: 'role', type: 'text', required: true, label: 'Позиция' },
        { name: 'number', type: 'text', label: 'Номер' },
        { 
          name: 'photo', 
          type: 'upload', 
          relationTo: 'media', 
          required: true, 
          label: 'Фото' 
        },
        { name: 'birthDate', type: 'text', label: 'Дата рождения' },
        {
          name: 'stats',
          type: 'group',
          label: 'Статистика',
          fields: [
            { name: 'games', type: 'number', label: 'Игры' },
            { name: 'goals', type: 'number', label: 'Голы' },
            { name: 'assists', type: 'number', label: 'Передачи' },
          ],
        },
        { name: 'isPublished', type: 'checkbox', defaultValue: true, label: 'Опубликован' },
      ],
    },

    // 📰 Новости
    {
      slug: 'news',
      labels: {
        singular: 'Новость',
        plural: 'Новости',
      },
      admin: { useAsTitle: 'title' },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Заголовок' },
        { name: 'slug', type: 'text', required: true, unique: true, label: 'URL slug' },
        { name: 'description', type: 'textarea', label: 'Описание (для слайдера)' },
        { name: 'category', type: 'text', label: 'Категория' },
        { name: 'date', type: 'text', label: 'Дата (формат: ДД.ММ.ГГГГ)' },
        { name: 'readTime', type: 'text', label: 'Время чтения' },
        { 
          name: 'image', 
          type: 'upload', 
          relationTo: 'media', 
          label: 'Изображение новости' 
        },
        { 
          name: 'fullText', 
          type: 'textarea',
          label: 'Полный текст статьи',
          required: true,
        },
        { name: 'isPublished', type: 'checkbox', defaultValue: true, label: 'Опубликован' },
      ],
    },

    // 🎮 Игры
    {
      slug: 'games',
      labels: {
        singular: 'Матч',
        plural: 'Игры',
      },
      admin: { useAsTitle: 'opponent' },
      fields: [
        { name: 'opponent', type: 'text', required: true, label: 'Соперник' },
        { name: 'slug', type: 'text', required: true, unique: true, label: 'URL slug' },
        { name: 'date', type: 'text', label: 'Дата матча' },
        { name: 'score', type: 'text', label: 'Счёт (напр. 2:1)' },
        { 
          name: 'team1Logo', 
          type: 'upload', 
          relationTo: 'media', 
          label: 'Логотип Сателлита' 
        },
        { 
          name: 'team2Logo', 
          type: 'upload', 
          relationTo: 'media', 
          label: 'Логотип соперника' 
        },
        {
          name: 'stats',
          type: 'group',
          label: 'Статистика',
          fields: [
            { name: 'goals', type: 'number', label: 'Голы' },
            { name: 'assists', type: 'number', label: 'Передачи' },
            { name: 'yellowCards', type: 'number', label: 'Жёлтые карточки' },
            { name: 'redCards', type: 'number', label: 'Красные карточки' },
          ],
        },
        { name: 'isPublished', type: 'checkbox', defaultValue: true, label: 'Опубликован' },
      ],
    },

    // 🖼️ Медиа (для загрузки картинок) — ✅ ВОТ СЮДА НУЖНО ДОБАВИТЬ НАСТРОЙКИ UPLOAD
    {
      slug: 'media',
      labels: {
        singular: 'Файл',
        plural: 'Медиа',
      },
      // 🔹 Заменяем `upload: true` на объект с настройками:
      upload: {
        staticDir: './media',  // Папка для сохранения файлов
        limits: {
        fileSize: 2 * 1024 * 1024 * 1024, // 2GB limit
        }

        mimeTypes: ['image/*'],  // Разрешаем только изображения
        // Опционально: генерация превью
        imageSizes: [
          {
            name: 'thumbnail',
            width: 400,
            height: 300,
            position: 'centre',
          },
          {
            name: 'medium',
            width: 800,
            height: 600,
            position: 'centre',
          },
        ],
      },
      access: {
        read: () => true,  // ✅ Публичный доступ
      },
      fields: [
        { name: 'alt', type: 'text', label: 'Alt текст' },
      ],
    },
  ],

  globals: [
    {
      slug: 'hero-settings',
      label: 'Трансляция',
      access: {
        read: () => true,
      },
      fields: [
        {
          name: 'streamUrl',
          type: 'text',
          required: true,
          label: 'Ссылка на трансляцию',
          defaultValue: 'https://live.vkvideo.ru/mex1kanec',
          admin: {
            description: 'Вставь ссылку из кнопки "Поделиться" в ВК. Примеры:\n• https://live.vkvideo.ru/mex1kanec\n• https://vkvideo.ru/video-12345_45678\nСайт сам превратит её в правильный формат.',
          },
        },
      ],
    },
  ],

  editor: lexicalEditor(),

  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./payload.db',
    },
  }),

  secret: process.env.PAYLOAD_SECRET || '',

  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})