# Деплой VK Mini App

## Docker Production

### 1. Настройка переменных окружения

Скопируйте `.env.example` в `.env` и заполните:

```bash
DJANGO_SECRET_KEY=your-production-secret-key
DJANGO_DEBUG=False
ALLOWED_HOSTS=your-domain.com,api.your-domain.com
DEFAULT_BRAND=kokos
VK_APP_SECRET=your-vk-app-secret
VITE_API_BASE=https://api.your-domain.com
```

### 2. Запуск

```bash
docker-compose up -d --build
```

Frontend будет доступен на порту 5173 (или 80 в nginx).
Backend API на порту 8000.

### 3. Настройка nginx (опционально)

Если используете внешний nginx, пример конфига:

```nginx
# Backend
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Frontend
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
    }
}
```

## VK Hosting

Для деплоя на VK Hosting:

### 1. Сборка фронтенда

```bash
cd frontend
npm install
VITE_API_BASE=https://your-api.com npm run build
```

### 2. Настройка vk-hosting-config.json

Файл уже создан в `frontend/public/vk-hosting-config.json`.
Обновите `app_id` на свой.

### 3. Загрузка через VK Mini Apps UI

1. Зайдите в настройки приложения
2. Перейдите в раздел "Хостинг"
3. Загрузите содержимое `frontend/dist/`

## Backend на VPS/Cloud

### Подготовка

```bash
# Клонирование репо
git clone <your-repo>
cd miniappVK/backend

# Создание venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Настройка БД
python manage.py migrate

# Сбор статики
python manage.py collectstatic

# Создание суперюзера
python manage.py createsuperuser
```

### Запуск через Gunicorn + Systemd

Создайте `/etc/systemd/system/vk-miniapp.service`:

```ini
[Unit]
Description=VK Mini App Backend
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/vk-miniapp/backend
Environment="PATH=/var/www/vk-miniapp/backend/venv/bin"
ExecStart=/var/www/vk-miniapp/backend/venv/bin/gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3

[Install]
WantedBy=multi-user.target
```

Запуск:
```bash
sudo systemctl enable vk-miniapp
sudo systemctl start vk-miniapp
```

## Настройка VK Mini App

1. Создайте приложение в настройках VK
2. Тип: Mini App (VK Mini Apps)
3. URL приложения: ваш фронтенд URL
4. Trusted domain: домен бэкенда
5. В настройках группы добавьте приложение

## Тестирование white-label

Для тестирования разных брендов используйте параметр `?brand=`:

- `?brand=kokos` - бренд Кокос
- `?brand=kubyshka` - бренд Кубышка

Или настройте разные group_id в `backend/app/brands.py`.

