// src/migrate.ts
import payload from 'payload'
import config from './payload.config'

const migrate = async () => {
  console.log('--- Запуск скрипта миграции (v2) ---');
  try {
    console.log('Инициализация Payload для создания таблиц...');
    
    // Инициализируем Payload, передавая всю конфигурацию
    // Он сам возьмет из нее секрет и настройки базы
    await payload.init({ config })

    console.log('✅ Миграция успешно завершена.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Ошибка во время миграции:', err);
    process.exit(1);
  }
}

// Запускаем функцию
migrate()

