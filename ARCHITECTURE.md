# Архитектура проекта

## Общая схема

```
┌─────────────────────────────────────────────────────────┐
│                    VK Platform                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │           VK Mini App (iframe)                   │   │
│  │  ┌────────────────────────────────────────────┐  │   │
│  │  │         Frontend (React + VKUI)            │  │   │
│  │  │  • launch params parsing                   │  │   │
│  │  │  • VK Bridge integration                   │  │   │
│  │  │  • white-label theming                     │  │   │
│  │  └────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTP/REST API
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Backend (Django + DRF)                     │
│  ┌────────────────────────────────────────────────┐     │
│  │  /api/config/   - brand configuration          │     │
│  │  /api/offers/   - filtered offers list         │     │
│  │  /api/go/:id/   - click tracking + redirect    │     │
│  └────────────────────────────────────────────────┘     │
│  ┌────────────────────────────────────────────────┐     │
│  │  White-Label Engine                            │     │
│  │  • GROUP_TO_BRAND mapping                      │     │
│  │  • BRAND_CONFIGS store                         │     │
│  │  • brand resolution logic                      │     │
│  └────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────┘
                          │
                          │ Partner Links
                          ▼
┌─────────────────────────────────────────────────────────┐
│            Partner Lending Services                     │
└─────────────────────────────────────────────────────────┘
```

## Компоненты системы

### Frontend (React + TypeScript + Vite)

**Технологии:**
- React 18 - UI framework
- TypeScript - типизация
- Vite - сборщик
- VKUI - UI компоненты VK
- VK Bridge - интеграция с VK
- React Query - управление состоянием и кэширование API
- React Router - маршрутизация (Hash mode для VK)

**Основные модули:**
- `App.tsx` - корневой компонент, инициализация VK Bridge
- `pages/` - страницы приложения (Offers, Policy)
- `components/` - переиспользуемые компоненты
- `hooks/` - custom hooks (useConfig, useOffers, useLaunchParams)
- `api/` - HTTP клиенты для API
- `utils/theme.ts` - динамическое применение тем через CSS variables

**Поток данных:**
1. Парсинг launch params (`vk_group_id`, `vk_user_id`)
2. Запрос конфигурации бренда (`/api/config`)
3. Применение темы (CSS variables)
4. Загрузка офферов (`/api/offers`)
5. Клик на оффер → редирект через `/api/go/:id`

### Backend (Django + DRF)

**Технологии:**
- Django 4.2 - web framework
- Django REST Framework - REST API
- CORS Headers - разрешение cross-origin
- Gunicorn - WSGI сервер

**Основные модули:**
- `app/brands.py` - white-label конфигурации
- `app/offers.py` - логика офферов (пока моки)
- `app/views.py` - API endpoints
- `app/models.py` - модели БД (ClickLog)

**API Endpoints:**

1. **GET /api/config/**
   - Возвращает конфигурацию бренда
   - Приоритет: `?brand=` → group_id mapping → DEFAULT_BRAND
   
2. **GET /api/offers/**
   - Фильтрация: sum_need, term_days
   - Сортировка: rate, sum, term
   - Пагинация: page, page_size
   
3. **GET /api/go/:offer_id/**
   - Логирование клика в БД
   - Формирование sub_id
   - Редирект 302 на партнёрскую ссылку

### White-Label система

**Механизм:**
1. Клиент передаёт `vk_group_id` в launch params
2. Бэк маппит group_id → brand через `GROUP_TO_BRAND`
3. Возвращается конфиг из `BRAND_CONFIGS[brand]`
4. Фронт применяет тему через CSS variables

**Конфигурация бренда содержит:**
```python
{
  'brand': 'kokos',
  'name': 'Кубышка Займ',
  'palette': {...},      # цветовая схема
  'logo_url': '...',     # логотип
  'copy': {...},         # тексты (title, cta, etc)
  'features': {...}      # настройки (сортировка, фильтры)
}
```

**Преимущества:**
- Один код для множества брендов
- Быстрое переключение без пересборки
- Централизованное управление
- A/B тестирование через query параметры

### База данных

**SQLite (dev) → PostgreSQL (prod recommended)**

**Модели:**
- `ClickLog` - логирование кликов по офферам
  - offer_id
  - vk_user_id, group_id
  - brand
  - created_at
  - ip_address, user_agent

В будущем можно добавить:
- `Offer` - хранение офферов в БД
- `Brand` - динамическое управление брендами
- `User` - профили пользователей
- `Analytics` - агрегированная аналитика

## Безопасность

### VK Integration
- Проверка подписи launch params (TODO: реализовать)
- Валидация vk_user_id и vk_group_id

### CORS
- Разрешены только домены VK
- В продакшене строгий CORS

### CSP (Content Security Policy)
```
frame-ancestors https://vk.com https://*.vk.com
```
Разрешает фрейминг только с VK доменов.

### XSS Protection
- React автоматически экранирует
- DRF JSON responses

## Масштабирование

### Горизонтальное
- Frontend: статика на CDN (nginx)
- Backend: множество Gunicorn workers
- Load balancer перед backend

### Вертикальное
- Увеличение workers в Gunicorn
- Настройка кэширования (Redis)

### Кэширование
- Frontend: React Query (staleTime)
- Backend: Django cache framework
- CDN для статики

## Мониторинг

**Рекомендуется добавить:**
- Sentry - отслеживание ошибок
- Google Analytics / VK Pixel - аналитика
- Prometheus + Grafana - метрики
- ELK Stack - логирование

## Deployment

### Docker
Два контейнера:
- `frontend` - Nginx с статикой
- `backend` - Gunicorn + Django

### VK Hosting (frontend only)
- Статика размещается на VK CDN
- Backend на отдельном VPS

### CI/CD
GitHub Actions workflow (TODO):
1. Тесты (pytest, vitest)
2. Линтинг (eslint, flake8)
3. Сборка Docker images
4. Деплой на production

## Расширения (Roadmap)

1. **Аутентификация VK**
   - Проверка подписи launch params
   - OAuth токены для API запросов

2. **Персонализация**
   - История заявок пользователя
   - Рекомендации на основе профиля

3. **Реальные офферы**
   - Интеграция с партнёрскими API
   - Кэширование офферов
   - Регулярное обновление

4. **Аналитика**
   - Конверсия кликов
   - A/B тесты брендов
   - Воронка пользователей

5. **Уведомления**
   - VK Бот для уведомлений
   - Статусы заявок

6. **Админ панель**
   - Управление офферами
   - Настройка брендов
   - Статистика

