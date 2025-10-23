# Полная структура проекта

```
miniappVK/
│
├── 📄 README.md                      # Главная документация
├── 📄 QUICKSTART.md                  # Быстрый старт за 5 минут
├── 📄 ARCHITECTURE.md                # Архитектура системы
├── 📄 DEVELOPMENT.md                 # Руководство разработчика
├── 📄 DEPLOY.md                      # Инструкции по деплою
├── 📄 EXAMPLES.md                    # Примеры использования
├── 📄 CHANGELOG.md                   # История изменений
├── 📄 LICENSE                        # MIT лицензия
├── 📄 Makefile                       # Утилиты команд
├── 📄 .gitignore                     # Git ignore правила
├── 📄 .editorconfig                  # Настройки редактора
├── 📄 docker-compose.yml             # Production оркестрация
├── 📄 docker-compose.dev.yml         # Development override
│
├── 📁 frontend/                      # React приложение
│   │
│   ├── 📁 src/                       # Исходники
│   │   │
│   │   ├── 📁 api/                   # API клиенты
│   │   │   ├── config.ts             # Запросы конфигурации
│   │   │   └── offers.ts             # Запросы офферов
│   │   │
│   │   ├── 📁 components/            # UI компоненты
│   │   │   ├── LoadingScreen.tsx    # Экран загрузки
│   │   │   ├── ErrorScreen.tsx      # Экран ошибки
│   │   │   ├── OfferCard.tsx        # Карточка оффера
│   │   │   ├── OffersFilters.tsx    # Фильтры офферов
│   │   │   └── AllowMessagesButton.tsx # Кнопка разрешения уведомлений
│   │   │
│   │   ├── 📁 hooks/                 # Custom React hooks
│   │   │   ├── useLaunchParams.ts   # Hook для launch params
│   │   │   ├── useConfig.ts         # Hook для конфига
│   │   │   └── useOffers.ts         # Hook для офферов
│   │   │
│   │   ├── 📁 pages/                 # Страницы приложения
│   │   │   ├── OffersPage.tsx       # Страница офферов
│   │   │   └── PolicyPage.tsx       # Политика конфиденциальности
│   │   │
│   │   ├── 📁 types/                 # TypeScript типы
│   │   │   └── index.ts             # Общие типы
│   │   │
│   │   ├── 📁 utils/                 # Утилиты
│   │   │   ├── theme.ts             # Применение темы
│   │   │   └── format.ts            # Форматирование (деньги, даты)
│   │   │
│   │   ├── App.tsx                   # Главный компонент
│   │   ├── main.tsx                  # Entry point
│   │   ├── index.css                 # Глобальные стили
│   │   └── vite-env.d.ts            # Vite типы
│   │
│   ├── 📁 public/                    # Статические файлы
│   │   └── vk-hosting-config.json   # Конфиг для VK Hosting
│   │
│   ├── 📄 index.html                 # HTML шаблон
│   ├── 📄 package.json               # NPM зависимости
│   ├── 📄 tsconfig.json              # TypeScript конфиг
│   ├── 📄 tsconfig.node.json         # TypeScript для Node
│   ├── 📄 vite.config.ts             # Vite конфиг
│   ├── 📄 .eslintrc.cjs              # ESLint правила
│   ├── 📄 Dockerfile                 # Docker образ
│   ├── 📄 .dockerignore              # Docker ignore
│   ├── 📄 nginx.conf                 # Nginx конфигурация
│   └── 📄 README.md                  # Frontend документация
│
├── 📁 backend/                       # Django приложение
│   │
│   ├── 📁 config/                    # Настройки Django
│   │   ├── __init__.py
│   │   ├── settings.py               # Основные настройки
│   │   ├── urls.py                   # URL роуты
│   │   ├── wsgi.py                   # WSGI конфигурация
│   │   └── asgi.py                   # ASGI конфигурация
│   │
│   ├── 📁 app/                       # Главное приложение
│   │   ├── 📁 migrations/            # Миграции БД
│   │   │   └── __init__.py
│   │   │
│   │   ├── __init__.py
│   │   ├── apps.py                   # Конфигурация приложения
│   │   ├── admin.py                  # Django Admin
│   │   ├── models.py                 # 🗄️ Модели БД (ClickLog)
│   │   ├── views.py                  # 🔌 API endpoints
│   │   ├── urls.py                   # URL роуты приложения
│   │   ├── brands.py                 # 🎨 White-Label конфиги
│   │   └── offers.py                 # 💳 Логика офферов
│   │
│   ├── 📄 manage.py                  # Django CLI
│   ├── 📄 requirements.txt           # Python зависимости
│   ├── 📄 Dockerfile                 # Docker образ
│   ├── 📄 .dockerignore              # Docker ignore
│   └── 📄 README.md                  # Backend документация
│
└── 📁 docs/                          # (опционально) Дополнительная документация
    └── ...

```

## Описание ключевых файлов

### 📄 Корневые конфигурационные файлы

| Файл | Назначение |
|------|-----------|
| `docker-compose.yml` | Оркестрация контейнеров (production) |
| `docker-compose.dev.yml` | Development override |
| `Makefile` | Утилиты для разработки (make dev, make build, etc) |
| `.gitignore` | Исключения для Git |
| `.editorconfig` | Настройки форматирования кода |

### 📚 Документация

| Файл | Назначение |
|------|-----------|
| `README.md` | Главная страница проекта |
| `QUICKSTART.md` | Быстрый старт за 5 минут |
| `ARCHITECTURE.md` | Архитектура и дизайн |
| `DEVELOPMENT.md` | Гайд для разработчиков |
| `DEPLOY.md` | Инструкции по деплою |
| `EXAMPLES.md` | Примеры кода и использования |
| `CHANGELOG.md` | История версий |
| `LICENSE` | MIT лицензия |

### 🎨 Frontend - Ключевые файлы

| Файл | Назначение |
|------|-----------|
| `src/App.tsx` | Главный компонент, VK Bridge инициализация |
| `src/main.tsx` | Entry point, React Query setup |
| `src/api/config.ts` | Запросы к `/api/config` |
| `src/api/offers.ts` | Запросы к `/api/offers` |
| `src/hooks/useConfig.ts` | React Query hook для конфига |
| `src/hooks/useLaunchParams.ts` | Парсинг VK launch params |
| `src/utils/theme.ts` | Применение CSS variables |
| `src/types/index.ts` | TypeScript интерфейсы |
| `src/pages/OffersPage.tsx` | Главная страница с офферами |
| `src/components/OfferCard.tsx` | Компонент карточки оффера |

### 🔧 Backend - Ключевые файлы

| Файл | Назначение |
|------|-----------|
| `config/settings.py` | Django настройки, CORS, REST Framework |
| `app/brands.py` | **White-label конфигурации** |
| `app/offers.py` | Логика офферов (пока моки) |
| `app/views.py` | API endpoints (config, offers, redirect) |
| `app/models.py` | Модель ClickLog для аналитики |
| `app/urls.py` | Роуты API |

### 🐳 Docker файлы

| Файл | Назначение |
|------|-----------|
| `frontend/Dockerfile` | Multi-stage: build (Node) + serve (Nginx) |
| `frontend/nginx.conf` | Nginx конфиг с CSP для VK |
| `backend/Dockerfile` | Python + Gunicorn |

## Метрики проекта

```
📊 Статистика (примерная):

Frontend:
  - TypeScript файлов: ~20
  - React компонентов: ~10
  - Строк кода: ~1500
  - Зависимостей: ~15

Backend:
  - Python файлов: ~12
  - API endpoints: 4
  - Строк кода: ~800
  - Зависимостей: 6

Документация:
  - Markdown файлов: 10+
  - Строк документации: ~2000

Docker:
  - Контейнеров: 2 (frontend, backend)
  - Образов: 2
  - Volumes: 1
```

## Навигация по функциям

### 🎨 White-Label система
- **Конфиги:** `backend/app/brands.py`
- **API:** `backend/app/views.py` → `config_view()`
- **Применение темы:** `frontend/src/utils/theme.ts`
- **Hook:** `frontend/src/hooks/useConfig.ts`

### 💳 Офферы
- **Данные:** `backend/app/offers.py`
- **API:** `backend/app/views.py` → `offers_view()`
- **Компонент:** `frontend/src/components/OfferCard.tsx`
- **Страница:** `frontend/src/pages/OffersPage.tsx`

### 🔗 Редиректы
- **API:** `backend/app/views.py` → `offer_redirect_view()`
- **Логирование:** `backend/app/models.py` → `ClickLog`
- **Клиент:** `frontend/src/api/offers.ts` → `buildOfferRedirectUrl()`

### 🚀 VK Bridge
- **Инициализация:** `frontend/src/App.tsx`
- **Launch params:** `frontend/src/hooks/useLaunchParams.ts`
- **Разрешения:** `frontend/src/components/AllowMessagesButton.tsx`

## Точки расширения

### Добавить новый бренд
1. `backend/app/brands.py` → `BRAND_CONFIGS`
2. `backend/app/brands.py` → `GROUP_TO_BRAND`

### Добавить новый оффер
1. `backend/app/offers.py` → `MOCK_OFFERS`

### Добавить новую страницу
1. Создать `frontend/src/pages/NewPage.tsx`
2. Добавить route в `frontend/src/App.tsx`

### Добавить новый API endpoint
1. `backend/app/views.py` → создать view
2. `backend/app/urls.py` → добавить path
3. `frontend/src/api/` → создать клиент

### Добавить новую модель БД
1. `backend/app/models.py` → создать модель
2. `python manage.py makemigrations`
3. `python manage.py migrate`

## Зависимости между модулями

```
Frontend App
    ↓
VK Bridge → Launch Params
    ↓
API Client (config, offers)
    ↓
Backend Views
    ↓
Brands Config / Offers Data
    ↓
Database (ClickLog)
```

## Переменные окружения

### Frontend
- `VITE_API_BASE` - URL бэкенда

### Backend
- `DJANGO_SECRET_KEY` - секретный ключ Django
- `DJANGO_DEBUG` - режим отладки
- `ALLOWED_HOSTS` - разрешённые хосты
- `DEFAULT_BRAND` - бренд по умолчанию
- `VK_APP_SECRET` - секрет VK приложения

См. также: файл `.env` (создать на основе `.env.example`)

