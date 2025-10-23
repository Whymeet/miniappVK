# Frontend - React + TypeScript + Vite + VKUI

## Установка

```bash
npm install
```

## Запуск

```bash
# Development сервер
npm run dev

# Production сборка
npm run build

# Предпросмотр production сборки
npm run preview

# Линтинг
npm run lint
```

## Структура

```
src/
├── api/              # API клиенты
├── components/       # React компоненты
├── hooks/           # Custom hooks
├── pages/           # Страницы приложения
├── types/           # TypeScript типы
├── utils/           # Утилиты
├── App.tsx          # Главный компонент
└── main.tsx         # Entry point
```

## White-Label система

### Получение конфигурации
Конфигурация бренда загружается через `useConfig` hook при инициализации.

### Применение темы
Тема применяется через CSS переменные в `utils/theme.ts`.

### Поддерживаемые параметры
- `palette` - цветовая схема
- `logo_url` - логотип
- `copy` - тексты интерфейса
- `features` - настройки функций

## VK Bridge

Используется `@vkontakte/vk-bridge` для:
- Инициализации приложения (`VKWebAppInit`)
- Парсинга launch параметров
- Запроса разрешений (`VKWebAppAllowMessagesFromGroup`)
- Отслеживания изменения темы

## Переменные окружения

- `VITE_API_BASE` - URL бэкенда (по умолчанию: http://localhost:8000)

Настраивается в `.env.local` или через Docker build args.

