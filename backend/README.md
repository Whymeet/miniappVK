# Backend - Django + DRF

## Установка

```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Запуск

```bash
# Создание миграций
python manage.py makemigrations

# Применение миграций
python manage.py migrate

# Создание суперпользователя
python manage.py createsuperuser

# Запуск dev сервера
python manage.py runserver
```

## API Endpoints

### GET /api/config/
Получить конфигурацию бренда.

**Query параметры:**
- `group_id` - ID группы VK
- `brand` - название бренда (оверрайд)

**Пример:**
```bash
curl "http://localhost:8000/api/config/?group_id=123456789"
```

### GET /api/offers/
Получить список офферов с фильтрацией.

**Query параметры:**
- `group_id` - ID группы VK
- `sum_need` - нужная сумма
- `term_days` - срок в днях
- `sort` - сортировка (rate|sum|term)
- `page` - номер страницы

**Пример:**
```bash
curl "http://localhost:8000/api/offers/?sum_need=10000&term_days=30&sort=rate"
```

### GET /api/go/:offer_id/
Редирект на партнёрскую ссылку с логированием клика.

**Query параметры:**
- `vk_user_id` - ID пользователя VK
- `group_id` - ID группы VK
- `brand` - бренд

**Пример:**
```bash
curl "http://localhost:8000/api/go/offer_1/?vk_user_id=12345&group_id=67890"
```

### POST /api/subscribe/
Подписка пользователя при входе в приложение.

**Body:**
```json
{
  "vk_user_id": "12345",
  "group_id": "67890",
  "brand": "kubyshka"
}
```

**Пример:**
```bash
curl -X POST "http://localhost:8000/api/subscribe/" \
  -H "Content-Type: application/json" \
  -d '{"vk_user_id":"12345","group_id":"67890","brand":"kubyshka"}'
```

### POST /api/subscribe/allow-messages/
Обновление статуса после разрешения уведомлений.

**Body:**
```json
{
  "vk_user_id": "12345",
  "group_id": "67890"
}
```

**Пример:**
```bash
curl -X POST "http://localhost:8000/api/subscribe/allow-messages/" \
  -H "Content-Type: application/json" \
  -d '{"vk_user_id":"12345","group_id":"67890"}'
```

### POST /api/unsubscribe/
Отписка от рассылки.

**Body:**
```json
{
  "vk_user_id": "12345"
}
```

**Пример:**
```bash
curl -X POST "http://localhost:8000/api/unsubscribe/" \
  -H "Content-Type: application/json" \
  -d '{"vk_user_id":"12345"}'
```

### GET /api/subscription/status/
Получение статуса подписки пользователя.

**Query параметры:**
- `vk_user_id` - ID пользователя VK

**Пример:**
```bash
curl "http://localhost:8000/api/subscription/status/?vk_user_id=12345"
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "vk_user_id": "12345",
    "subscribed": true,
    "allowed_from_group": true,
    "can_receive_messages": true,
    "created_at": "2024-01-01T12:00:00Z",
    "subscribed_at": "2024-01-01T12:05:00Z",
    "brand": "kubyshka"
  }
}
```

### POST /api/vk-callback/
VK Callback API для автоматического обновления статусов.

**Настройка:**
1. Получите `VK_CONFIRMATION_CODE` при настройке Callback API в сообществе VK
2. Установите секретный ключ `VK_CALLBACK_SECRET` в настройках сообщества
3. Укажите URL: `https://your-domain.com/api/vk-callback/`
4. Выберите события: `message_allow`, `message_deny`

**События:**
- `confirmation` - подтверждение сервера (первый запрос)
- `message_allow` - пользователь разрешил сообщения
- `message_deny` - пользователь запретил сообщения

## Конфигурация брендов

Брендыы настраиваются в `app/brands.py`:
- `BRAND_CONFIGS` - конфигурации брендов
- `GROUP_TO_BRAND` - маппинг group_id -> brand

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
# Django
DJANGO_SECRET_KEY=your-secret-key-here
DJANGO_DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# VK App
VK_APP_SECRET=your-vk-app-secret
VK_GROUP_ACCESS_TOKEN=your-vk-group-access-token
VK_CALLBACK_SECRET=your-vk-callback-secret
VK_CONFIRMATION_CODE=your-vk-confirmation-code

# Branding
DEFAULT_BRAND=kubyshka

# API
VITE_API_BASE=http://localhost:8000
```

**Где получить токены:**

1. **VK_GROUP_ACCESS_TOKEN** - токен сообщества с правами на отправку сообщений:
   - Настройки сообщества → Работа с API → Создать ключ
   - Включите разрешения: "Сообщения сообщества"

2. **VK_CALLBACK_SECRET** и **VK_CONFIRMATION_CODE**:
   - Настройки сообщества → Работа с API → Callback API
   - Секретный ключ: любая строка для проверки подлинности запросов
   - Строка подтверждения: получите при первом запросе от VK

## Модели базы данных

### Subscriber
Подписчики на рассылку.

**Поля:**
- `vk_user_id` - ID пользователя VK (уникальный)
- `group_id` - ID группы VK
- `brand` - название бренда
- `subscribed` - подписан ли на рассылку
- `allowed_from_group` - разрешил ли сообщения от сообщества
- `created_at` - дата создания
- `subscribed_at` - дата подписки
- `unsubscribed_at` - дата отписки

**Свойства:**
- `can_receive_messages` - может ли получать сообщения (subscribed AND allowed_from_group)

### ClickLog
Логи кликов по офферам.

**Поля:**
- `offer_id` - ID оффера
- `vk_user_id` - ID пользователя VK
- `subscriber` - связь с подписчиком (опционально)
- `group_id` - ID группы VK
- `brand` - бренд
- `created_at` - дата клика
- `ip_address` - IP адрес
- `user_agent` - User Agent

## Django Admin

Админ-панель доступна по адресу `/admin/`.

**Возможности:**

1. **Управление подписчиками:**
   - Просмотр списка с фильтрацией по бренду, статусу, датам
   - Экспорт в CSV
   - Просмотр истории кликов каждого подписчика

2. **Логи кликов:**
   - Просмотр всех кликов
   - Фильтрация по бренду и дате
   - Связь с подписчиком

**Создание суперпользователя:**
```bash
python manage.py createsuperuser
```

