# Руководство по разработке

## Локальная разработка без Docker

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Backend будет доступен на `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend будет доступен на `http://localhost:5173`

## Разработка с Docker

```bash
# Запуск в dev режиме
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Пересборка после изменений
docker-compose up --build
```

## Добавление нового бренда

1. Откройте `backend/app/brands.py`
2. Добавьте конфиг в `BRAND_CONFIGS`:

```python
'newbrand': {
    'name': 'Новый Бренд',
    'palette': {
        'primary': '#FF0000',
        # ... остальные цвета
    },
    'logo_url': 'https://...',
    'copy': {
        'title': 'Новый Бренд',
        # ... остальные тексты
    },
    'features': {
        'default_sort': 'rate',
        # ... настройки
    },
}
```

3. Добавьте маппинг group_id (опционально):

```python
GROUP_TO_BRAND = {
    '123456789': 'newbrand',
}
```

## Добавление новых офферов

1. Откройте `backend/app/offers.py`
2. Добавьте оффер в `MOCK_OFFERS`:

```python
{
    'id': 'offer_6',
    'partner_name': 'Новый Партнёр',
    'logo_url': 'https://...',
    'sum_min': 1000,
    'sum_max': 50000,
    # ... остальные поля
}
```

В будущем моковые данные можно заменить на БД или внешний API.

## Работа с миграциями

```bash
cd backend

# Создание новой миграции
python manage.py makemigrations

# Применение миграций
python manage.py migrate

# Откат последней миграции
python manage.py migrate app zero
```

## Тестирование VK Bridge локально

VK Bridge работает только внутри VK. Для локального тестирования:

1. Используйте [VK Tunnel](https://github.com/VKCOM/vk-tunnel):
```bash
npx @vkontakte/vk-tunnel --insecure=1 --http-protocol=http --ws-protocol=ws --host=localhost --port=5173
```

2. Полученный URL используйте в настройках VK Mini App

3. Откройте приложение через VK

## Структура проекта

```
miniappVK/
├── frontend/              # React приложение
│   ├── src/
│   │   ├── api/          # API клиенты
│   │   ├── components/   # UI компоненты
│   │   ├── hooks/        # React hooks
│   │   ├── pages/        # Страницы
│   │   ├── types/        # TypeScript типы
│   │   └── utils/        # Утилиты
│   ├── Dockerfile
│   └── package.json
├── backend/              # Django API
│   ├── app/             # Основное приложение
│   │   ├── brands.py    # Конфиги брендов
│   │   ├── offers.py    # Логика офферов
│   │   ├── models.py    # Модели БД
│   │   └── views.py     # API views
│   ├── config/          # Настройки Django
│   ├── Dockerfile
│   └── requirements.txt
└── docker-compose.yml    # Оркестрация
```

## Полезные команды

### Django

```bash
# Создать суперпользователя
python manage.py createsuperuser

# Открыть Django shell
python manage.py shell

# Собрать статику
python manage.py collectstatic
```

### Docker

```bash
# Логи
docker-compose logs -f

# Рестарт сервиса
docker-compose restart backend

# Зайти в контейнер
docker-compose exec backend sh

# Удалить все контейнеры и volumes
docker-compose down -v
```

## Отладка

### Backend

Django Debug Toolbar уже настроен (если `DEBUG=True`).

### Frontend

React DevTools + браузерная консоль.

Для отладки VK Bridge событий:
```javascript
bridge.subscribe((e) => {
  console.log('VK Bridge event:', e);
});
```

