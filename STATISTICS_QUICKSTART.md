# 🚀 Быстрый старт - Статистика

## За 2 минуты

### 1. Убедитесь, что бэкенд запущен

```bash
cd backend
python manage.py runserver
```

### 2. Откройте дашборд

Перейдите в браузере:
```
http://localhost:8000/api/statistics/
```

Войдите под учётной записью администратора.

### 3. Готово! 🎉

Вы увидите:
- 📊 Карточки с метриками
- 🏆 ТОП-10 офферов
- 👥 Статистику по подписчикам
- 📅 Переключение периодов

## Что дальше?

### Посмотреть статистику оффера

1. Откройте админку: `http://localhost:8000/admin/`
2. Перейдите в "Офферы"
3. Нажмите "📊 Статистика" для нужного оффера

### Использовать API

```bash
# Дашборд за 7 дней
curl "http://localhost:8000/api/statistics/dashboard/?days=7"

# ТОП-5 офферов
curl "http://localhost:8000/api/statistics/top-offers/?limit=5&days=30"
```

### Экспортировать данные

```bash
# Сохранить в файл
curl "http://localhost:8000/api/statistics/dashboard/?days=30" > stats.json
```

## Примеры запросов

### Python

```python
import requests

# Получить статистику
response = requests.get('http://localhost:8000/api/statistics/dashboard/?days=30')
data = response.json()

# Вывести метрики
print(f"Всего кликов: {data['data']['total_clicks']}")
print(f"Уникальных пользователей: {data['data']['unique_users']}")
print(f"Конверсия: {data['data']['conversion']['conversion_rate']}%")

# ТОП-3 оффера
print("\nТОП-3 оффера:")
for i, offer in enumerate(data['data']['top_offers'][:3], 1):
    print(f"{i}. {offer['offer__partner_name']}: {offer['total_clicks']} кликов")
```

### JavaScript

```javascript
// Получить ТОП офферов
async function getTopOffers() {
  const response = await fetch('/api/statistics/top-offers/?limit=5&days=7');
  const data = await response.json();
  
  console.log('ТОП-5 офферов за неделю:');
  data.data.forEach((offer, i) => {
    console.log(`${i+1}. ${offer.offer__partner_name}: ${offer.total_clicks} кликов`);
  });
}

getTopOffers();
```

## Доступные периоды

- `?days=7` - последняя неделя
- `?days=30` - последний месяц (по умолчанию)
- `?days=90` - последние 3 месяца

## Все API endpoints

```bash
# Дашборд
GET /api/statistics/dashboard/?days=30

# Статистика по офферам
GET /api/statistics/offers/?days=30

# ТОП офферов
GET /api/statistics/top-offers/?limit=10&days=30

# Детальная статистика оффера
GET /api/statistics/offers/<offer_id>/?days=30

# Статистика по дням
GET /api/statistics/daily/?days=30

# Конверсия
GET /api/statistics/conversion/?days=30

# Подписчики
GET /api/statistics/subscribers/
```

## Метрики

### Основные

- **total_clicks** - всего кликов
- **unique_users** - уникальных пользователей
- **conversion_rate** - конверсия (%)
- **avg_clicks_per_user** - среднее кликов на пользователя

### По офферам

- **total_clicks** - кликов по офферу
- **unique_users** - уникальных пользователей
- **avg_clicks_per_user** - среднее на пользователя

### По подписчикам

- **total** - всего подписчиков
- **active** - активных (не отписались)
- **with_messages** - разрешили сообщения

## Интерпретация

### Хорошие показатели ✅

- Конверсия > 300% (avg_clicks_per_user > 3)
- Много уникальных пользователей
- Равномерное распределение по офферам

### Требует внимания ⚠️

- Конверсия < 100% (avg_clicks_per_user < 1)
- Мало уникальных пользователей
- Один оффер забирает все клики

## Автоматизация

### Ежедневный отчёт

Создайте файл `daily_report.py`:

```python
import requests
import json
from datetime import datetime

# Получаем статистику
response = requests.get('http://localhost:8000/api/statistics/dashboard/?days=1')
data = response.json()

# Сохраняем
filename = f"report_{datetime.now().strftime('%Y-%m-%d')}.json"
with open(filename, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"✅ Отчёт сохранён: {filename}")
print(f"📊 Кликов за день: {data['data']['total_clicks']}")
```

Запускайте каждый день:
```bash
python daily_report.py
```

### Мониторинг аномалий

```python
import requests

response = requests.get('http://localhost:8000/api/statistics/conversion/?days=7')
data = response.json()

avg = data['data']['avg_clicks_per_user']

if avg < 1.0:
    print("⚠️ ВНИМАНИЕ: Низкая активность!")
elif avg > 10.0:
    print("🎉 Отлично: Очень высокая активность!")
else:
    print(f"✅ Нормально: {avg:.2f} кликов/пользователь")
```

## Проблемы?

### Ошибка 404

- Убедитесь, что бэкенд запущен
- Проверьте URL: `http://localhost:8000/api/statistics/`

### Ошибка 403

- Войдите как администратор
- Проверьте права доступа

### Пустые данные

- Проверьте, есть ли клики в БД
- Попробуйте увеличить период: `?days=90`

## Дополнительная информация

📖 **Полная документация:**
- [STATISTICS_GUIDE.md](STATISTICS_GUIDE.md) - подробное руководство
- [STATISTICS_API.md](STATISTICS_API.md) - описание API
- [STATISTICS_CHANGELOG.md](STATISTICS_CHANGELOG.md) - список изменений

## Поддержка

Если что-то не работает:
1. Проверьте логи бэкенда
2. Убедитесь, что все миграции применены
3. Проверьте, что в БД есть данные
4. Обратитесь к документации

---

**Готово!** Теперь у вас есть полноценная система статистики! 🚀

