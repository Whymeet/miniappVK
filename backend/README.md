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

## Конфигурация брендов

Брендыы настраиваются в `app/brands.py`:
- `BRAND_CONFIGS` - конфигурации брендов
- `GROUP_TO_BRAND` - маппинг group_id -> brand

## Переменные окружения

См. `.env.example` в корне проекта.

