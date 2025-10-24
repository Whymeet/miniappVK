# 📊 API Статистики

## Обзор

API статистики предоставляет детальную аналитику по кликам, офферам, подписчикам и конверсии.

## Endpoints

### 1. Дашборд (Общая сводка)

```
GET /api/statistics/dashboard/?days=30
```

**Параметры:**
- `days` (опционально, по умолчанию 30) - период в днях

**Ответ:**
```json
{
  "success": true,
  "data": {
    "period_days": 30,
    "total_clicks": 1523,
    "unique_users": 342,
    "active_offers": 15,
    "total_offers": 20,
    "subscribers": {
      "total": 500,
      "active": 450,
      "with_messages": 320,
      "by_brand": [...]
    },
    "top_offers": [...],
    "conversion": {
      "total_clicks": 1523,
      "unique_users": 342,
      "conversion_rate": 445.32,
      "avg_clicks_per_user": 4.45
    }
  }
}
```

### 2. Статистика по офферам

```
GET /api/statistics/offers/?days=30
```

**Параметры:**
- `days` (опционально, по умолчанию 30) - период в днях

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "offer__id": "offer-123",
      "offer__partner_name": "МКК Быстрозайм",
      "offer__logo_url": "https://...",
      "total_clicks": 234,
      "unique_users": 156
    },
    ...
  ]
}
```

### 3. Детальная статистика по офферу

```
GET /api/statistics/offers/<offer_id>/?days=30
```

**Параметры:**
- `offer_id` (обязательно) - ID оффера
- `days` (опционально, по умолчанию 30) - период в днях

**Ответ:**
```json
{
  "success": true,
  "data": {
    "total_clicks": 234,
    "unique_users": 156,
    "avg_clicks_per_user": 1.5,
    "daily": [
      {
        "date": "2025-10-20",
        "clicks": 45
      },
      ...
    ],
    "by_brand": [
      {
        "brand": "kokos",
        "clicks": 120
      },
      ...
    ]
  }
}
```

### 4. ТОП офферов

```
GET /api/statistics/top-offers/?limit=10&days=30
```

**Параметры:**
- `limit` (опционально, по умолчанию 10) - количество офферов
- `days` (опционально, по умолчанию 30) - период в днях

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "offer__id": "offer-123",
      "offer__partner_name": "МКК Быстрозайм",
      "offer__logo_url": "https://...",
      "offer__rate_text": "от 0%",
      "total_clicks": 234,
      "unique_users": 156
    },
    ...
  ]
}
```

### 5. Статистика по брендам

```
GET /api/statistics/brands/?days=30
```

**Параметры:**
- `days` (опционально, по умолчанию 30) - период в днях

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "brand": "kokos",
      "total_clicks": 523,
      "unique_users": 234
    },
    ...
  ]
}
```

### 6. Статистика по дням

```
GET /api/statistics/daily/?days=30
```

**Параметры:**
- `days` (опционально, по умолчанию 30) - период в днях

**Ответ:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-10-20",
      "total_clicks": 67,
      "unique_users": 45
    },
    ...
  ]
}
```

### 7. Конверсия

```
GET /api/statistics/conversion/?days=30
```

**Параметры:**
- `days` (опционально, по умолчанию 30) - период в днях

**Ответ:**
```json
{
  "success": true,
  "data": {
    "total_clicks": 1523,
    "unique_users": 342,
    "conversion_rate": 445.32,
    "avg_clicks_per_user": 4.45
  }
}
```

### 8. Статистика по подписчикам

```
GET /api/statistics/subscribers/
```

**Ответ:**
```json
{
  "success": true,
  "data": {
    "total": 500,
    "active": 450,
    "with_messages": 320,
    "by_brand": [
      {
        "brand": "kokos",
        "total": 250,
        "active": 230,
        "with_messages": 180
      },
      ...
    ]
  }
}
```

## Использование в админке

### Просмотр статистики оффера

1. Откройте админку Django: `http://localhost:8000/admin/`
2. Перейдите в раздел "Офферы"
3. В списке офферов найдите колонку "Статистика"
4. Нажмите на ссылку "📊 Статистика" для нужного оффера
5. Откроется JSON с детальной статистикой

### Экспорт данных

Вы можете использовать API endpoints для получения данных и их дальнейшего анализа:

```bash
# Получить дашборд за 7 дней
curl "http://localhost:8000/api/statistics/dashboard/?days=7"

# Получить ТОП-5 офферов
curl "http://localhost:8000/api/statistics/top-offers/?limit=5&days=30"

# Получить статистику конкретного оффера
curl "http://localhost:8000/api/statistics/offers/offer-123/?days=30"
```

## Метрики

### Основные показатели

- **total_clicks** - общее количество кликов
- **unique_users** - количество уникальных пользователей
- **conversion_rate** - конверсия (клики / уникальные пользователи * 100)
- **avg_clicks_per_user** - среднее количество кликов на пользователя

### Группировки

- **По офферам** - статистика по каждому офферу
- **По брендам** - статистика по брендам (если используется мультибрендинг)
- **По дням** - динамика кликов по дням
- **По часам** - детальная статистика по часам (для анализа пиковых времён)

## Примеры использования

### Python

```python
import requests

# Получить дашборд
response = requests.get('http://localhost:8000/api/statistics/dashboard/?days=30')
data = response.json()

print(f"Всего кликов: {data['data']['total_clicks']}")
print(f"Уникальных пользователей: {data['data']['unique_users']}")
print(f"Конверсия: {data['data']['conversion']['conversion_rate']}%")
```

### JavaScript

```javascript
// Получить ТОП офферов
fetch('/api/statistics/top-offers/?limit=5&days=7')
  .then(response => response.json())
  .then(data => {
    console.log('ТОП-5 офферов:', data.data);
    data.data.forEach(offer => {
      console.log(`${offer.offer__partner_name}: ${offer.total_clicks} кликов`);
    });
  });
```

## Оптимизация

Для больших объёмов данных рекомендуется:

1. Использовать кэширование (Redis)
2. Ограничивать период запроса (параметр `days`)
3. Использовать пагинацию для больших списков
4. Создать индексы в БД на поля `created_at`, `vk_user_id`, `offer_id`

## Будущие улучшения

- [ ] Экспорт в CSV/Excel
- [ ] Графики и визуализация
- [ ] Сравнение периодов
- [ ] Прогнозирование трендов
- [ ] Когортный анализ
- [ ] Воронка конверсии
- [ ] A/B тестирование офферов

