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

