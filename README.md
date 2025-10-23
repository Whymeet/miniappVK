# 🚀 VK Mini App - White-Label Агрегатор Микрозаймов

> White-label шаблон для VK Mini App с поддержкой множественных брендов без пересборки

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white)](https://www.docker.com/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/django-%23092E20.svg?style=flat&logo=django&logoColor=white)](https://www.djangoproject.com/)

## 📋 Содержание

- [Описание](#-описание)
- [Быстрый старт](#-быстрый-старт)
- [Технологии](#-технологии)
- [Документация](#-документация)
- [White-Label система](#-white-label-система)
- [Структура проекта](#-структура-проекта)
- [API](#-api)
- [Система подписки и рассылки](#-система-подписки-и-рассылки)
- [Скриншоты](#-скриншоты)
- [Лицензия](#-лицензия)

## 🎯 Описание

Готовый к использованию шаблон VK Mini App для создания агрегатора микрозаймов с поддержкой **white-label** (мультибрендинг).

**Особенности:**
- ✅ Один код → множество брендов
- ✅ Переключение без пересборки
- ✅ Настройка через конфиг (цвета, лого, тексты)
- ✅ Система подписки и рассылки VK ID
- ✅ VK Callback API интеграция
- ✅ Django Admin с экспортом подписчиков
- ✅ Docker ready
- ✅ Production ready
- ✅ Полная документация

## 🔒 Безопасность (ВАЖНО!)

> ⚠️ **ПЕРЕД НАЧАЛОМ РАБОТЫ:** Прочитайте [GIT_SAFETY.md](GIT_SAFETY.md) чтобы не закоммитить секреты!

**Никогда не коммитьте:**
- ❌ `.env` файлы
- ❌ `DJANGO_SECRET_KEY` и `VK_APP_SECRET`
- ❌ Базу данных `db.sqlite3`

**Файл `.gitignore` уже настроен и защищает эти файлы!**

📖 Подробнее: [SECURITY.md](SECURITY.md) | [GIT_SAFETY.md](GIT_SAFETY.md) | [SECURITY_CHECKLIST.md](SECURITY_CHECKLIST.md)

## ⚡ Быстрый старт

```bash
# 1. Создайте .env файл
cat > .env << EOF
DJANGO_SECRET_KEY=my-secret-key
DJANGO_DEBUG=True
VITE_API_BASE=http://localhost:8000
DEFAULT_BRAND=kokos
EOF

# 2. Запустите проект
docker-compose up --build

# 3. Откройте в браузере
# Frontend: http://localhost:5173
# Backend:  http://localhost:8000/api/config/
```

📖 **Подробнее:** [QUICKSTART.md](QUICKSTART.md)

## 🛠 Технологии

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - быстрая сборка
- **VKUI** - компоненты VK
- **VK Bridge** - интеграция с VK
- **React Query** - управление состоянием
- **React Router** - маршрутизация

### Backend
- **Django 4.2** - web framework
- **Django REST Framework** - REST API
- **Gunicorn** - WSGI server
- **SQLite** → PostgreSQL ready

### DevOps
- **Docker & Docker Compose**
- **Nginx** - статика и reverse proxy

## 📚 Документация

| Документ | Описание |
|----------|----------|
| [QUICKSTART.md](QUICKSTART.md) | Быстрый старт за 5 минут |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Архитектура и дизайн системы |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Руководство по разработке |
| [DEPLOY.md](DEPLOY.md) | Инструкции по деплою |
| [EXAMPLES.md](EXAMPLES.md) | Примеры использования |
| [frontend/README.md](frontend/README.md) | Frontend документация |
| [backend/README.md](backend/README.md) | Backend документация |
| [FAQ.md](FAQ.md) | Частые вопросы и ответы |
| [SECURITY.md](SECURITY.md) | ⚠️ **Безопасность и защита данных** |
| [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) | Полная структура файлов |
| [CHANGELOG.md](CHANGELOG.md) | История изменений |

## 🎨 White-Label система

### Принцип работы

```
VK Launch → vk_group_id → Маппинг → Brand Config → Применение темы
```

1. **Источник бренда:**
   - `vk_group_id` из launch-params
   - Query параметр `?brand=...` (оверрайд)
   - Дефолтный `DEFAULT_BRAND` из ENV

2. **BrandConfig содержит:**
   ```typescript
   {
     palette: { primary, secondary, ... },  // Цветовая схема
     logo_url: "...",                       // Логотип
     copy: { title, cta, ... },             // Тексты
     features: { default_sort, ... }        // Настройки
   }
   ```

3. **Применение:**
   - Frontend получает конфиг через `/api/config`
   - Применяет тему через CSS variables
   - Все тексты и логотип из конфига

### Примеры брендов

| Бренд | URL для теста |
|-------|---------------|
| 🥥 Кокос Займ | `http://localhost:5173/#/?brand=kokos` |
| 💰 Кубышка Займ | `http://localhost:5173/#/?brand=kubyshka` |

📖 **Подробнее:** [EXAMPLES.md](EXAMPLES.md#добавление-нового-бренда)

## 📁 Структура проекта

```
miniappVK/
├── frontend/                    # React приложение
│   ├── src/
│   │   ├── api/                # API клиенты
│   │   ├── components/         # UI компоненты
│   │   ├── hooks/              # React hooks
│   │   ├── pages/              # Страницы (Offers, Policy)
│   │   ├── types/              # TypeScript типы
│   │   ├── utils/              # Утилиты (theme, format)
│   │   └── App.tsx             # Главный компонент
│   ├── Dockerfile
│   ├── nginx.conf              # Nginx конфиг
│   └── package.json
│
├── backend/                     # Django API
│   ├── app/
│   │   ├── brands.py           # 🎨 Конфигурации брендов
│   │   ├── offers.py           # 💳 Логика офферов
│   │   ├── views.py            # API endpoints
│   │   └── models.py           # БД модели
│   ├── config/                 # Django settings
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml           # Оркестрация
├── Makefile                     # Утилиты для разработки
└── README.md                    # Этот файл
```

## 🔌 API

### Endpoints

| Метод | Endpoint | Описание |
|-------|----------|----------|
| GET | `/api/config/` | Получить конфигурацию бренда |
| GET | `/api/offers/` | Список офферов с фильтрами |
| GET | `/api/go/:offer_id/` | Редирект с логированием |
| GET | `/api/health/` | Health check |

### Примеры запросов

```bash
# Конфигурация бренда
curl "http://localhost:8000/api/config/?brand=kokos"

# Офферы с фильтрами
curl "http://localhost:8000/api/offers/?sum_need=10000&term_days=30&sort=rate"

# Редирект на оффер
curl -L "http://localhost:8000/api/go/offer_1/?vk_user_id=12345"
```

📖 **Подробнее:** [backend/README.md](backend/README.md)

## 📩 Система подписки и рассылки

### Как это работает

1. **Автоматическая подписка:**
   - При входе в приложение пользователь автоматически добавляется в базу подписчиков
   - Сохраняется: VK User ID, Group ID, бренд, дата

2. **Разрешение уведомлений:**
   - Пользователь нажимает "Разрешить уведомления"
   - VK показывает системное окно подтверждения
   - После подтверждения статус обновляется в базе данных
   - Проверяется через VK API `messages.isMessagesFromGroupAllowed`

3. **Отписка:**
   - Пользователь может отписаться через кнопку в разделе "Политика конфиденциальности"
   - Подтверждающий диалог для предотвращения случайной отписки
   - Статус обновляется в базе данных

4. **VK Callback API:**
   - Автоматически обновляет статусы при событиях `message_allow` / `message_deny`
   - Работает в режиме реального времени

### Subscription API

| Метод | Endpoint | Описание |
|-------|----------|----------|
| POST | `/api/subscribe/` | Подписка пользователя |
| POST | `/api/subscribe/allow-messages/` | Разрешение уведомлений |
| POST | `/api/unsubscribe/` | Отписка от рассылки |
| GET | `/api/subscription/status/` | Статус подписки |
| POST | `/api/vk-callback/` | VK Callback API |

### Django Admin

Удобная админ-панель для управления подписчиками:

- 📊 **Фильтрация:** по бренду, статусу, дате создания
- 🔍 **Поиск:** по VK User ID
- 📥 **Экспорт в CSV:** выгрузка списка подписчиков
- 📈 **Статистика:** количество кликов на каждого пользователя
- 🔗 **История:** просмотр всех кликов подписчика

**Доступ:** `http://localhost:8000/admin/`

### Настройка VK сообщества

1. **Получите токен доступа:**
   - Настройки → Работа с API → Создать ключ
   - Разрешения: "Сообщения сообщества"
   - Сохраните в `.env` как `VK_GROUP_ACCESS_TOKEN`

2. **Настройте Callback API:**
   - Настройки → Работа с API → Callback API
   - URL: `https://your-domain.com/api/vk-callback/`
   - Секретный ключ → сохраните в `.env` как `VK_CALLBACK_SECRET`
   - Строка подтверждения → сохраните в `.env` как `VK_CONFIRMATION_CODE`
   - События: `message_allow`, `message_deny`

### Отправка сообщений

Пример отправки сообщения подписчику через VK API:

```python
from app.vk_api import send_message
from app.models import Subscriber

# Получаем всех активных подписчиков
subscribers = Subscriber.objects.filter(
    subscribed=True,
    allowed_from_group=True,
    brand='kubyshka'
)

# Отправляем сообщение каждому
for subscriber in subscribers:
    try:
        send_message(
            user_id=subscriber.vk_user_id,
            message="🎉 Новое выгодное предложение!"
        )
    except Exception as e:
        print(f"Ошибка отправки для {subscriber.vk_user_id}: {e}")
```

## 🖼 Скриншоты

### Бренд "Кокос Займ"
- Оранжевая цветовая схема
- Карточки офферов с фильтрами
- Адаптивный дизайн VKUI

### Бренд "Кубышка Займ"
- Синяя цветовая схема
- Те же компоненты, другой стиль
- Смена логотипа и текстов

> 💡 **Совет:** Откройте оба бренда в разных вкладках и сравните!

## 🚀 Деплой

### Docker Production

```bash
# 1. Настройте .env для продакшена
DJANGO_DEBUG=False
ALLOWED_HOSTS=your-domain.com
VITE_API_BASE=https://api.your-domain.com

# 2. Запустите
docker-compose up -d --build
```

### VK Hosting

```bash
cd frontend
npm run build
# Загрузите dist/ в VK Mini Apps UI
```

📖 **Подробнее:** [DEPLOY.md](DEPLOY.md)

## 🛠 Разработка

### Локально без Docker

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### С Docker

```bash
make dev  # или docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

📖 **Подробнее:** [DEVELOPMENT.md](DEVELOPMENT.md)

## 📝 Лицензия

MIT License - см. [LICENSE](LICENSE)

## 🤝 Contributing

Pull requests приветствуются! Для крупных изменений сначала откройте issue.

## 💬 Поддержка

Если у вас возникли вопросы:
1. Изучите [документацию](#-документация)
2. Проверьте [примеры](EXAMPLES.md)
3. Откройте issue в репозитории

---

**Сделано с ❤️ для VK Mini Apps**

