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
    // 👤 Пользователи (для входа в админку)
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
        plural: 'Команда',  // ← В меню будет "Команда"
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
    { name: 'date', type: 'text', label: 'Дата (формат: ДД.ММ.ГГГГ)' }, // Или type: 'date'
    { name: 'readTime', type: 'text', label: 'Время чтения' },
    
    // 🔹 Изображение: можно загружать через Media ИЛИ вписывать путь текстом
    { 
      name: 'image', 
      type: 'upload', 
      relationTo: 'media', 
      label: 'Изображение новости' 
    },
    { 
      name: 'fullText', 
      type: 'textarea',  // Или 'richText' если нужно форматирование
      label: 'Полный текст статьи',
      required: true,
    },
    // Альтернатива: если хочешь просто вписывать пути как в JSON:
    // { name: 'imageUrl', type: 'text', label: 'Путь к изображению' },
    
    { name: 'isPublished', type: 'checkbox', defaultValue: true, label: 'Опубликован' },
  ],
},

    // 🎮 Игры
    {
  slug: 'games',
  labels: {
        singular: 'Матч',
        plural: 'Игры',  // ← В меню будет "Игры"
      },
  admin: { useAsTitle: 'opponent' },
  fields: [
    { name: 'opponent', type: 'text', required: true, label: 'Соперник' },
    { name: 'slug', type: 'text', required: true, unique: true, label: 'URL slug' },
    { name: 'date', type: 'text', label: 'Дата матча' }, // или type: 'date'
    { name: 'score', type: 'text', label: 'Счёт (напр. 2:1)' },
    
    // 🔹 Логотипы команд (upload или text для путей)
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
    
    // 🔹 Статистика матча (группа полей)
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
// {
//   slug: 'hero-settings',
//   label: 'Настройки Hero',
//   access: {
//     read: () => true, // Публичный доступ
//   },
//   fields: [
//     {
//       name: 'streamUrl',
//       type: 'text',
//       required: true,
//       label: 'Ссылка на трансляцию (iframe src)',
//       defaultValue: 'https://live.vkvideo.ru/app/embed/myp_',
//       admin: {
//         description: 'Вставь ссылку из iframe, например: https://live.vkvideo.ru/app/embed/myp_',
//       },
//     },
//   ],
// },

    // 🖼️ Медиа (для загрузки картинок)
    {
      slug: 'media',
      labels: {
        singular: 'Файл',
        plural: 'Медиа',
      },
      upload: true,
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
      slug: 'hero-settings',  // ← Должно совпадать с тем, что в коде!
      label: 'Трансляция',
      access: {
        read: () => true, // Публичный доступ
      },
      fields: [
        {
          name: 'streamUrl',
          type: 'text',
          required: true,
          label: 'Ссылка на трансляцию',
          defaultValue: 'https://live.vkvideo.ru/mex1kanec', // ← Теперь можно простой формат
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