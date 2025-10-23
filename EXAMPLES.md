# Примеры использования

## Добавление нового бренда

### 1. Определите конфигурацию бренда

Откройте `backend/app/brands.py` и добавьте новый бренд:

```python
BRAND_CONFIGS = {
    # ... существующие бренды
    
    'turbo': {
        'name': 'Турбо Деньги',
        'palette': {
            'primary': '#FF4500',
            'secondary': '#FFA500',
            'background': '#FFFFFF',
            'surface': '#F5F5F5',
            'text': '#000000',
            'textSecondary': '#666666',
            'accent': '#FF4500',
            'error': '#E63946',
            'success': '#06D6A0',
        },
        'logo_url': 'https://your-cdn.com/turbo-logo.png',
        'copy': {
            'title': 'Турбо Деньги',
            'subtitle': 'Займы на скорости света',
            'cta': 'Получить турбозайм',
            'disclaimer': 'Сервис не является кредитором.',
            'policy_title': 'Политика конфиденциальности',
            'policy_text': 'Ваши данные защищены...',
        },
        'features': {
            'default_sort': 'sum',
            'show_filters': True,
            'show_disclaimer': True,
            'enable_messages': True,
        },
    },
}
```

### 2. Настройте маппинг VK группы

```python
GROUP_TO_BRAND = {
    '123456789': 'kokos',
    '987654321': 'kubyshka',
    '111222333': 'turbo',  # ← новый маппинг
}
```

### 3. Тестирование

```bash
# Через query параметр
http://localhost:5173/?brand=turbo

# Или через group_id
http://localhost:5173/?vk_group_id=111222333
```

## Добавление нового оффера

Откройте `backend/app/offers.py`:

```python
MOCK_OFFERS = [
    # ... существующие офферы
    
    {
        'id': 'offer_6',
        'partner_name': 'Супер Займ',
        'logo_url': 'https://via.placeholder.com/80x80/00FF00/FFFFFF?text=СЗ',
        'sum_min': 5000,
        'sum_max': 80000,
        'term_min': 14,
        'term_max': 120,
        'rate': 0.9,
        'rate_text': '0.9% в день',
        'approval_time': '15 минут',
        'approval_probability': 'высокая',
        'features': ['Без отказа', 'Быстро', 'Надёжно'],
        'redirect_url': 'https://partner.com/offer?sub_id={sub_id}',
    },
]
```

## Кастомизация компонентов

### Изменение карточки оффера

Отредактируйте `frontend/src/components/OfferCard.tsx`:

```tsx
// Добавьте новое поле, например, рейтинг
<div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
  <Text weight="2">Рейтинг:</Text>
  <Text>⭐ {offer.rating || 'N/A'}</Text>
</div>
```

### Добавление нового фильтра

В `frontend/src/components/OffersFilters.tsx`:

```tsx
<FormItem top="Рейтинг от">
  <Input
    type="number"
    min="1"
    max="5"
    value={filters.min_rating || ''}
    onChange={(e) => onChange({ 
      ...filters, 
      min_rating: parseInt(e.target.value) 
    })}
  />
</FormItem>
```

## API запросы

### Получение конфигурации

```javascript
// JavaScript
const response = await fetch(
  'http://localhost:8000/api/config/?group_id=123456789'
);
const data = await response.json();
console.log(data.data.brand); // 'kokos'
```

```bash
# cURL
curl "http://localhost:8000/api/config/?group_id=123456789"
```

```python
# Python
import requests

response = requests.get(
    'http://localhost:8000/api/config/',
    params={'group_id': '123456789'}
)
config = response.json()
print(config['data']['brand'])
```

### Получение офферов с фильтрами

```javascript
const params = new URLSearchParams({
  group_id: '123456789',
  sum_need: '15000',
  term_days: '30',
  sort: 'rate',
  page: '1'
});

const response = await fetch(
  `http://localhost:8000/api/offers/?${params}`
);
const data = await response.json();
console.log(data.data.results);
```

### Построение ссылки на оффер

```javascript
import { buildOfferRedirectUrl } from '@/api/offers';

const url = buildOfferRedirectUrl(
  'offer_1',              // offer_id
  '12345',                // vk_user_id
  '67890',                // group_id
  'kokos'                 // brand
);

// Результат:
// http://localhost:8000/api/go/offer_1/?vk_user_id=12345&group_id=67890&brand=kokos
```

## VK Bridge примеры

### Запрос разрешения на уведомления

```typescript
import bridge from '@vkontakte/vk-bridge';

async function requestMessagesPermission(groupId: number) {
  try {
    const result = await bridge.send('VKWebAppAllowMessagesFromGroup', {
      group_id: groupId,
    });
    
    if (result.result) {
      console.log('Разрешение получено');
    }
  } catch (error) {
    console.error('Пользователь отклонил', error);
  }
}
```

### Получение информации о пользователе

```typescript
async function getUserInfo() {
  try {
    const user = await bridge.send('VKWebAppGetUserInfo');
    console.log('Пользователь:', user);
    // { id, first_name, last_name, ... }
  } catch (error) {
    console.error('Ошибка получения данных', error);
  }
}
```

### Открытие внешней ссылки

```typescript
async function openLink(url: string) {
  try {
    await bridge.send('VKWebAppOpenCodeReader');
  } catch (error) {
    // Fallback
    window.open(url, '_blank');
  }
}
```

## Тестирование white-label локально

### Способ 1: Query параметр

```
http://localhost:5173/#/?brand=kokos
http://localhost:5173/#/?brand=kubyshka
```

### Способ 2: Мок launch params

В `frontend/src/hooks/useLaunchParams.ts`:

```typescript
export function useLaunchParams(): LaunchParams {
  // Для тестирования можно вернуть моковые данные
  if (import.meta.env.DEV) {
    return {
      groupId: '123456789',
      userId: '12345',
      brand: null,
    };
  }
  
  // ... остальная логика
}
```

### Способ 3: VK Tunnel

```bash
# Установка
npm install -g @vkontakte/vk-tunnel

# Запуск
vk-tunnel --insecure=1 --http-protocol=http --port=5173

# Полученный URL использовать в настройках VK Mini App
```

## Работа с темами

### Динамическое изменение темы

```typescript
import { applyTheme } from '@/utils/theme';

const customPalette = {
  primary: '#FF0000',
  secondary: '#00FF00',
  // ... остальные цвета
};

applyTheme(customPalette);
```

### Использование CSS переменных

```css
/* В ваших стилях */
.my-button {
  background-color: var(--color-primary);
  color: var(--color-background);
}

.my-text {
  color: var(--color-text-secondary);
}
```

## Интеграция с аналитикой

### Отслеживание кликов

```typescript
// В компоненте OfferCard
const handleApplyOffer = (offerId: string) => {
  // Аналитика
  if (window.ym) {
    window.ym(YANDEX_METRIKA_ID, 'reachGoal', 'offer_click', {
      offer_id: offerId,
      brand: config.brand,
    });
  }
  
  // VK Pixel
  if (window.vkPixel) {
    window.vkPixel('event', 'OfferClick', { offer_id: offerId });
  }
  
  // Редирект
  const url = buildOfferRedirectUrl(...);
  window.open(url, '_blank');
};
```

### Отслеживание загрузки страницы

```typescript
// В App.tsx
useEffect(() => {
  if (config?.data) {
    // Аналитика
    if (window.ym) {
      window.ym(YANDEX_METRIKA_ID, 'params', {
        brand: config.data.brand,
        group_id: launchParams.groupId,
      });
    }
  }
}, [config]);
```

## Миграция на PostgreSQL

### 1. Обновите docker-compose.yml

```yaml
services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: vk_miniapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    depends_on:
      - db
    environment:
      - DB_ENGINE=postgresql
      - DB_NAME=vk_miniapp
      - DB_USER=postgres
      - DB_PASSWORD=postgres
      - DB_HOST=db
      - DB_PORT=5432

volumes:
  postgres_data:
```

### 2. Обновите settings.py

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'vk_miniapp'),
        'USER': os.getenv('DB_USER', 'postgres'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'postgres'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}
```

### 3. Добавьте psycopg2 в requirements.txt

```
psycopg2-binary==2.9.9
```

---

## Работа с подписками и рассылкой

### Получение списка активных подписчиков

```python
from app.models import Subscriber

# Все подписчики, которым можно отправлять сообщения
active_subscribers = Subscriber.objects.filter(
    subscribed=True,
    allowed_from_group=True
)

# Фильтрация по бренду
kubyshka_subscribers = active_subscribers.filter(brand='kubyshka')

# Подписчики, которые кликали по офферам
active_clickers = active_subscribers.filter(clicks__isnull=False).distinct()

# Подписчики без кликов (для таргетинга)
inactive_subscribers = active_subscribers.filter(clicks__isnull=True)
```

### Отправка массовой рассылки

```python
from app.vk_api import send_message
from app.models import Subscriber
import time

def send_broadcast(brand, message_text):
    """Отправка рассылки подписчикам бренда"""
    subscribers = Subscriber.objects.filter(
        brand=brand,
        subscribed=True,
        allowed_from_group=True
    )
    
    success_count = 0
    error_count = 0
    
    for subscriber in subscribers:
        try:
            send_message(
                user_id=subscriber.vk_user_id,
                message=message_text
            )
            success_count += 1
            # Пауза для избежания лимитов VK API
            time.sleep(0.5)
        except Exception as e:
            print(f"Ошибка для {subscriber.vk_user_id}: {e}")
            error_count += 1
    
    print(f"✅ Отправлено: {success_count}")
    print(f"❌ Ошибок: {error_count}")

# Использование
send_broadcast('kubyshka', '🎉 Новое предложение: займ под 0% для новых клиентов!')
```

### Сегментированная рассылка

```python
from django.utils import timezone
from datetime import timedelta

# Подписчики последней недели
new_subscribers = Subscriber.objects.filter(
    subscribed=True,
    allowed_from_group=True,
    created_at__gte=timezone.now() - timedelta(days=7)
)

# Отправляем приветственное сообщение
for subscriber in new_subscribers:
    send_message(
        user_id=subscriber.vk_user_id,
        message=f"Добро пожаловать! Спасибо, что выбрали {subscriber.brand}!"
    )
```

### Экспорт подписчиков через Django Admin

1. Откройте админ-панель: `http://localhost:8000/admin/`
2. Перейдите в раздел "Subscribers"
3. Используйте фильтры для выбора нужных подписчиков:
   - По бренду
   - По статусу подписки
   - По дате создания
4. Выберите подписчиков (checkbox)
5. В меню "Действие" выберите "Экспорт выбранных в CSV"
6. Нажмите "Выполнить"

Полученный CSV содержит:
- VK User ID
- Group ID
- Brand
- Subscribed (Yes/No)
- Allowed From Group (Yes/No)
- Can Receive Messages (Yes/No)
- Даты создания, подписки, отписки
- Количество кликов

### Программный экспорт в CSV

```python
import csv
from app.models import Subscriber

def export_subscribers_csv(filename='subscribers.csv', brand=None):
    """Экспорт подписчиков в CSV файл"""
    queryset = Subscriber.objects.all()
    
    if brand:
        queryset = queryset.filter(brand=brand)
    
    with open(filename, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([
            'VK User ID', 'Brand', 'Subscribed', 'Allowed Messages',
            'Created At', 'Total Clicks'
        ])
        
        for sub in queryset:
            writer.writerow([
                sub.vk_user_id,
                sub.brand,
                'Yes' if sub.subscribed else 'No',
                'Yes' if sub.allowed_from_group else 'No',
                sub.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                sub.clicks.count(),
            ])
    
    print(f"✅ Экспортировано {queryset.count()} подписчиков в {filename}")

# Использование
export_subscribers_csv('kubyshka_subscribers.csv', brand='kubyshka')
```

### Анализ вовлеченности

```python
from django.db.models import Count
from app.models import Subscriber

# Статистика по брендам
brand_stats = Subscriber.objects.values('brand').annotate(
    total=Count('id'),
    subscribed=Count('id', filter=models.Q(subscribed=True)),
    allowed=Count('id', filter=models.Q(allowed_from_group=True)),
    active=Count('id', filter=models.Q(subscribed=True, allowed_from_group=True))
)

for stat in brand_stats:
    print(f"""
    Бренд: {stat['brand']}
    Всего: {stat['total']}
    Подписаны: {stat['subscribed']}
    Разрешили сообщения: {stat['allowed']}
    Активные: {stat['active']}
    Конверсия: {stat['active'] / stat['total'] * 100:.1f}%
    """)
```

### Настройка VK Callback API

#### 1. Получение Confirmation Code

При первом запросе VK отправит событие типа `confirmation`. Наш сервер вернет код подтверждения.

Проверьте логи Django:
```bash
docker-compose logs -f backend
```

#### 2. Тестирование Callback

Используйте инструмент тестирования VK:
- Настройки сообщества → Работа с API → Callback API
- Кнопка "Тестирование"
- Выберите событие `message_allow` или `message_deny`
- Отправьте тестовый запрос

Проверьте, что статус обновился в админке.

#### 3. Ручная проверка через curl

```bash
# Имитация события message_allow
curl -X POST http://localhost:8000/api/vk-callback/ \
  -H "Content-Type: application/json" \
  -d '{
    "type": "message_allow",
    "object": {
      "user_id": 12345,
      "key": "test"
    },
    "secret": "your-vk-callback-secret"
  }'
```

### Очистка неактивных подписчиков

```python
from django.utils import timezone
from datetime import timedelta
from app.models import Subscriber

# Подписчики без кликов более 30 дней
inactive_cutoff = timezone.now() - timedelta(days=30)

inactive = Subscriber.objects.filter(
    created_at__lt=inactive_cutoff,
    clicks__isnull=True
)

print(f"Найдено {inactive.count()} неактивных подписчиков")

# Опционально: отписать их
# inactive.update(subscribed=False, unsubscribed_at=timezone.now())
```

