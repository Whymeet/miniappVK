# Changelog

Все значимые изменения в проекте будут документироваться в этом файле.

## [Unreleased]

### Планируется
- Проверка подписи VK launch params
- Аутентификация через VK OAuth
- Интеграция с реальными партнёрскими API
- Админ панель для управления офферами
- CI/CD pipeline
- Unit и integration тесты
- Миграция на PostgreSQL

## [0.1.0] - 2024-10-23

### Добавлено
- Базовая структура проекта (monorepo: frontend + backend)
- Frontend: React + TypeScript + Vite + VKUI
- Backend: Django + DRF
- White-label система с поддержкой множественных брендов
- API endpoints: /api/config, /api/offers, /api/go/:id
- VK Bridge интеграция
- Docker конфигурация (docker-compose)
- Компоненты: OfferCard, OffersFilters, LoadingScreen, ErrorScreen
- Страницы: OffersPage, PolicyPage
- Логирование кликов (модель ClickLog)
- Фильтрация и сортировка офферов
- Пагинация
- Разрешение уведомлений через VKWebAppAllowMessagesFromGroup
- Документация: README, ARCHITECTURE, DEPLOY, DEVELOPMENT
- Примеры брендов: Кокос Займ, Кубышка Займ
- Моковые данные офферов (5 партнёров)

### Технологии
- React 18.2.0
- TypeScript 5.3.3
- Vite 5.0.12
- VKUI 6.0.0
- VK Bridge 2.11.2
- React Query 5.17.9
- Django 4.2.7
- DRF 3.14.0
- Gunicorn 21.2.0
- Nginx (Alpine)

### Структура
```
miniappVK/
├── frontend/     # React приложение
├── backend/      # Django API
├── docker-compose.yml
└── README.md
```

