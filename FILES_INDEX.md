# Индекс всех файлов проекта

## 📄 Корневые файлы

| Файл | Тип | Назначение |
|------|-----|-----------|
| `README.md` | 📚 Docs | Главная страница проекта |
| `QUICKSTART.md` | 📚 Docs | Быстрый старт за 5 минут |
| `ARCHITECTURE.md` | 📚 Docs | Подробная архитектура системы |
| `DEVELOPMENT.md` | 📚 Docs | Руководство по разработке |
| `DEPLOY.md` | 📚 Docs | Инструкции по деплою |
| `EXAMPLES.md` | 📚 Docs | Примеры кода и использования |
| `FAQ.md` | 📚 Docs | Частые вопросы и ответы |
| `PROJECT_STRUCTURE.md` | 📚 Docs | Полная структура проекта |
| `SUMMARY.md` | 📚 Docs | Итоги и следующие шаги |
| `FILES_INDEX.md` | 📚 Docs | Этот файл - индекс всех файлов |
| `CHANGELOG.md` | 📚 Docs | История изменений |
| `LICENSE` | 📄 Legal | MIT лицензия |
| `Makefile` | 🛠️ Tools | Утилиты команд для разработки |
| `.gitignore` | ⚙️ Config | Правила игнорирования для Git |
| `.editorconfig` | ⚙️ Config | Настройки редактора кода |
| `docker-compose.yml` | 🐳 Docker | Production оркестрация контейнеров |
| `docker-compose.dev.yml` | 🐳 Docker | Development override конфигурация |

**Итого:** 17 файлов

---

## 📁 Frontend файлы (frontend/)

### Корневые конфигурационные файлы

| Файл | Назначение |
|------|-----------|
| `package.json` | NPM зависимости и скрипты |
| `tsconfig.json` | Настройки TypeScript |
| `tsconfig.node.json` | TypeScript для Node.js окружения |
| `vite.config.ts` | Конфигурация Vite сборщика |
| `.eslintrc.cjs` | Правила ESLint линтера |
| `index.html` | HTML шаблон приложения |
| `Dockerfile` | Docker образ (multi-stage build) |
| `.dockerignore` | Исключения для Docker |
| `nginx.conf` | Nginx конфигурация с CSP |
| `README.md` | Frontend документация |

### src/ - Исходный код

#### src/api/ - API клиенты
| Файл | Назначение |
|------|-----------|
| `config.ts` | HTTP клиент для `/api/config` |
| `offers.ts` | HTTP клиент для `/api/offers` и редиректов |

#### src/components/ - UI компоненты
| Файл | Назначение |
|------|-----------|
| `LoadingScreen.tsx` | Экран загрузки с spinner |
| `ErrorScreen.tsx` | Экран ошибки |
| `OfferCard.tsx` | Карточка оффера с кнопкой CTA |
| `OffersFilters.tsx` | Фильтры (сумма, срок, сортировка) |
| `AllowMessagesButton.tsx` | Кнопка разрешения уведомлений VK |

#### src/hooks/ - React hooks
| Файл | Назначение |
|------|-----------|
| `useLaunchParams.ts` | Парсинг VK launch params |
| `useConfig.ts` | React Query hook для конфига |
| `useOffers.ts` | React Query hook для офферов |

#### src/pages/ - Страницы
| Файл | Назначение |
|------|-----------|
| `OffersPage.tsx` | Главная страница со списком офферов |
| `PolicyPage.tsx` | Страница политики конфиденциальности |

#### src/types/ - TypeScript типы
| Файл | Назначение |
|------|-----------|
| `index.ts` | Все TypeScript интерфейсы и типы |

#### src/utils/ - Утилиты
| Файл | Назначение |
|------|-----------|
| `theme.ts` | Применение CSS variables для темизации |
| `format.ts` | Форматирование (деньги, даты, плюрализация) |

#### Главные файлы
| Файл | Назначение |
|------|-----------|
| `main.tsx` | Entry point приложения |
| `App.tsx` | Корневой компонент, VK Bridge setup |
| `index.css` | Глобальные стили и CSS переменные |
| `vite-env.d.ts` | TypeScript определения для Vite |

### public/ - Статика
| Файл | Назначение |
|------|-----------|
| `vk-hosting-config.json` | Конфигурация для VK Hosting |

**Итого Frontend:** ~30 файлов

---

## 📁 Backend файлы (backend/)

### Корневые файлы

| Файл | Назначение |
|------|-----------|
| `manage.py` | Django CLI утилита |
| `requirements.txt` | Python зависимости |
| `Dockerfile` | Docker образ (Python + Gunicorn) |
| `.dockerignore` | Исключения для Docker |
| `README.md` | Backend документация |

### config/ - Django конфигурация

| Файл | Назначение |
|------|-----------|
| `__init__.py` | Python пакет |
| `settings.py` | ⚙️ Основные настройки Django |
| `urls.py` | Главные URL роуты |
| `wsgi.py` | WSGI конфигурация |
| `asgi.py` | ASGI конфигурация |

### app/ - Главное приложение

| Файл | Назначение |
|------|-----------|
| `__init__.py` | Python пакет |
| `apps.py` | Конфигурация Django приложения |
| `admin.py` | Настройки Django Admin |
| `models.py` | 🗄️ Модели БД (ClickLog) |
| `views.py` | 🔌 API endpoints (DRF views) |
| `urls.py` | URL роуты приложения |
| `brands.py` | 🎨 **White-label конфигурации** |
| `offers.py` | 💳 Логика офферов (моки + фильтрация) |

### app/migrations/ - Миграции БД

| Файл | Назначение |
|------|-----------|
| `__init__.py` | Python пакет |

**Итого Backend:** ~18 файлов

---

## 📊 Общая статистика

### По категориям

| Категория | Количество файлов |
|-----------|-------------------|
| 📚 Документация | 11 |
| ⚙️ Конфигурация | 15 |
| 🐳 Docker | 4 |
| 🎨 Frontend код | 30 |
| 🔧 Backend код | 18 |
| **ВСЕГО** | **~78 файлов** |

### По типам

| Тип файла | Количество |
|-----------|------------|
| `.md` (Markdown) | 11 |
| `.ts/.tsx` (TypeScript) | 21 |
| `.py` (Python) | 13 |
| `.json` | 3 |
| `.yml` | 2 |
| `.conf` | 1 |
| Другие (Makefile, Dockerfile, etc) | ~27 |

### Строки кода (примерно)

| Компонент | Строк кода |
|-----------|------------|
| Frontend TypeScript | ~1,500 |
| Backend Python | ~800 |
| Документация | ~2,500 |
| Конфигурация | ~500 |
| **ИТОГО** | **~5,300 строк** |

---

## 🎯 Ключевые файлы для кастомизации

Если вы хотите быстро начать работу, фокусируйтесь на этих файлах:

### 🎨 White-Label настройки
```
backend/app/brands.py         ← Добавить новый бренд
```

### 💳 Офферы
```
backend/app/offers.py         ← Добавить офферы/интегрировать API
```

### 🔌 API
```
backend/app/views.py          ← Добавить новые endpoints
backend/app/urls.py           ← Маршруты API
```

### 🎨 UI компоненты
```
frontend/src/components/OfferCard.tsx       ← Дизайн карточки
frontend/src/components/OffersFilters.tsx   ← Фильтры
```

### 📄 Страницы
```
frontend/src/pages/OffersPage.tsx    ← Главная страница
frontend/src/pages/PolicyPage.tsx    ← Политика
```

### ⚙️ Конфигурация
```
docker-compose.yml           ← Docker setup
frontend/vite.config.ts      ← Frontend сборка
backend/config/settings.py   ← Backend настройки
```

---

## 🔍 Поиск файлов

### Хочу изменить цвета бренда
→ `backend/app/brands.py` → `palette`

### Хочу добавить новый фильтр
→ `frontend/src/components/OffersFilters.tsx`
→ `backend/app/offers.py` → функция `get_offers()`

### Хочу изменить логику редиректа
→ `backend/app/views.py` → `offer_redirect_view()`

### Хочу добавить новую страницу
→ Создать `frontend/src/pages/NewPage.tsx`
→ Добавить роут в `frontend/src/App.tsx`

### Хочу изменить API endpoint
→ `backend/app/views.py` → создать view
→ `backend/app/urls.py` → добавить path

### Хочу настроить Docker
→ `docker-compose.yml`
→ `frontend/Dockerfile` или `backend/Dockerfile`

### Хочу узнать как что-то сделать
→ `FAQ.md` - частые вопросы
→ `EXAMPLES.md` - примеры кода
→ `DEVELOPMENT.md` - руководство разработчика

---

## 📦 Готовые модули

Все эти модули **готовы к использованию** out-of-the-box:

- ✅ VK Bridge интеграция
- ✅ White-label система
- ✅ API endpoints
- ✅ Docker setup
- ✅ TypeScript типизация
- ✅ React Query кэширование
- ✅ Фильтрация и сортировка
- ✅ Пагинация
- ✅ Click tracking
- ✅ CORS настройки
- ✅ CSP для VK
- ✅ Responsive дизайн

---

**Навигация:**
- 🏠 [README.md](README.md) - вернуться на главную
- 🚀 [QUICKSTART.md](QUICKSTART.md) - начать работу
- 📋 [SUMMARY.md](SUMMARY.md) - итоги проекта
- ❓ [FAQ.md](FAQ.md) - вопросы и ответы

