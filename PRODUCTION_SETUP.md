# 🚀 Быстрая настройка Production

## 📋 Что было добавлено

### ✅ Многоуровневая система безопасности:

1. **✅ VK Launch Params Signature Verification** - проверка подписи VK для защиты от подделки данных
2. **✅ Rate Limiting** - защита от DDoS атак (10-100 запросов/минуту)
3. **✅ Middleware** - автоматическая проверка на защищенных эндпоинтах
4. **✅ Logging** - логирование подозрительных запросов
5. **✅ CORS** - ограничение доступа только для VK
6. **✅ Security Headers** - HSTS, SSL Redirect, Secure Cookies

## 🔧 Что нужно настроить перед деплоем

### 1. Скопируйте и заполните production.env

```bash
cp production.env.example production.env
```
z
z

z
z

**Обязательно измените:**
```env
# ⚠️ КРИТИЧЕСКИ ВАЖНО!
VK_APP_SECRET=your-vk-app-secret-key-HERE  # Из настроек VK Mini App
DJANGO_SECRET_KEY=generate-random-50-chars-HERE
POSTGRES_PASSWORD=create-strong-password-HERE

# Ваш домен
ALLOWED_HOSTS=api.yourapp.com,yourapp.com
DOMAIN=api.yourapp.com

# VK App данные
VK_APP_ID=51888888
VK_GROUP_ACCESS_TOKEN=vk1.a...
```

### 2. Получите VK App Secret

1. Зайдите в [VK Apps](https://vk.com/apps?act=manage)
2. Выберите ваше приложение
3. **Настройки → Безопасность**
4. Скопируйте **"Секретный ключ"** → `VK_APP_SECRET`

### 3. Настройте домен и DNS

```
A запись: api.yourapp.com → IP_ВАШЕГО_VPS
```

### 4. Установите на VPS

```bash
# Подключитесь к VPS
ssh root@your-vps-ip

# Клонируйте репозиторий
git clone https://github.com/your-repo/miniappVK.git
cd miniappVK

# Скопируйте production.env (создайте на VPS)
nano production.env
# Вставьте ваши данные

# Установите Docker и Docker Compose (если еще нет)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установите SSL сертификаты (Let's Encrypt)
sudo apt install certbot
sudo certbot certonly --standalone -d api.yourapp.com

# Скопируйте сертификаты для nginx
sudo cp /etc/letsencrypt/live/api.yourapp.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/api.yourapp.com/privkey.pem nginx/ssl/

# Обновите домен в nginx конфигурации
nano nginx/prod.conf
# Замените "your-domain.com" на "api.yourapp.com"

# Запустите production
docker-compose -f docker-compose.prod.yml up -d

# Проверьте логи
docker-compose -f docker-compose.prod.yml logs -f
```

### 5. Создайте суперпользователя Django

```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

### 6. Настройте Firewall

```bash
# Разрешите только HTTPS, HTTP и SSH
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP (redirect to HTTPS)
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

## 🎨 Деплой фронтенда на VK Hosting

### 1. Соберите фронтенд

```bash
cd frontend

# Обновите API URL в .env
echo "VITE_API_BASE=https://api.yourapp.com" > .env

# Установите зависимости и соберите
npm install
npm run build

# Проверьте что папка dist создана
ls -la dist/
```

### 2. Обновите vk-hosting-config.json

```bash
nano public/vk-hosting-config.json
```

```json
{
  "static_path": "dist",
  "app_id": 51888888,  // ВАШ VK_APP_ID
  "endpoints": {
    "mobile": "index.html",
    "mvk": "index.html", 
    "web": "index.html"
  }
}
```

### 3. Загрузите на VK Hosting

**Через VK Mini Apps IDE:**
1. Откройте [VK Mini Apps](https://vk.com/vkapps)
2. Выберите ваше приложение
3. **Настройки → Хостинг**
4. Загрузите папку `dist/`

**Или через CLI:**
```bash
# Установите VK Mini Apps Deploy
npm install -g @vkontakte/vk-miniapps-deploy

# Деплой
vk-miniapps-deploy --app-id=51888888 --token=YOUR_TOKEN
```

## ✅ Проверка работы

### 1. Проверьте backend API

```bash
# Health check
curl https://api.yourapp.com/api/health/

# Config (должен вернуть JSON)
curl https://api.yourapp.com/api/config/
```

### 2. Проверьте VK Mini App

1. Откройте ваше приложение в VK
2. Проверьте в Console (F12) что нет ошибок
3. Проверьте что офферы загружаются

### 3. Проверьте безопасность

```bash
# Проверка логов VK signature
docker-compose -f docker-compose.prod.yml logs backend | grep "VK signature"

# Должны видеть: "VK signature verified for user..."
```

## 🔍 Мониторинг

### Логи

```bash
# Все логи
docker-compose -f docker-compose.prod.yml logs -f

# Только backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Только nginx
docker-compose -f docker-compose.prod.yml logs -f nginx

# Только база данных
docker-compose -f docker-compose.prod.yml logs -f db
```

### Статус контейнеров

```bash
docker-compose -f docker-compose.prod.yml ps
```

### Перезапуск

```bash
# Перезапуск всех сервисов
docker-compose -f docker-compose.prod.yml restart

# Перезапуск только backend
docker-compose -f docker-compose.prod.yml restart backend
```

## 🐛 Troubleshooting

### Backend возвращает 403 (Invalid signature)

**Причина:** Неверный `VK_APP_SECRET`

**Решение:**
1. Проверьте `VK_APP_SECRET` в `production.env`
2. Перезапустите: `docker-compose -f docker-compose.prod.yml restart backend`

### Фронтенд не загружается

**Причина:** CORS или неверный API URL

**Решение:**
1. Проверьте `CORS_ALLOWED_ORIGINS` в `production.env`
2. Проверьте `VITE_API_BASE` при сборке фронтенда
3. Проверьте в браузере Console (F12)

### Rate Limit ошибки

**Причина:** Слишком много запросов

**Решение:**
- Подождите 1 минуту
- Или увеличьте лимиты в `backend/app/views.py`

### SSL сертификат истек

**Решение:**
```bash
# Обновить сертификаты (автоматически каждые 90 дней)
sudo certbot renew

# Скопировать новые сертификаты
sudo cp /etc/letsencrypt/live/api.yourapp.com/*.pem nginx/ssl/

# Перезапустить nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

## 📚 Дополнительно

- **Полное руководство по безопасности:** `SECURITY.md`
- **Документация API:** `backend/README.md`
- **Документация фронтенда:** `frontend/README.md`

## 🎉 Готово!

Ваше приложение защищено и готово к production! 🚀

**Не забудьте:**
- ✅ Регулярные бэкапы базы данных
- ✅ Мониторинг логов
- ✅ Обновление SSL сертификатов каждые 90 дней

