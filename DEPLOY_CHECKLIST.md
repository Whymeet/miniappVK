
# ✅ Чеклист развертывания для kybyshka-dev.ru

## 📋 Статус подготовки

### ✅ Готово автоматически:

- ✅ `production.env` - обновлен с доменом `kybyshka-dev.ru` и IP `45.129.2.158`
- ✅ `nginx/prod.conf` - обновлен с доменом `kybyshka-dev.ru`
- ✅ `frontend/public/vk-hosting-config.json` - VK App ID: `54267293`
- ✅ VK App Secret заполнен
- ✅ VK Group Access Token заполнен

### ⚠️ Нужно сделать вручную:

#### 1. Создайте `frontend/.env`:
```bash
cd frontend
```

Создайте файл `.env` с содержимым:
```env
VITE_API_BASE=https://kybyshka-dev.ru
```

#### 2. Заполните секреты в `production.env`:

```env
# Строка 4 - Сгенерируйте на https://djecrety.ir/
DJANGO_SECRET_KEY=ваш-случайный-50-символов

# Строка 20 - Придумайте сложный пароль
POSTGRES_PASSWORD=ваш-надежный-пароль-для-БД
```

---

## 🚀 Шаги для деплоя

### Шаг 1: Соберите фронтенд

```bash
cd frontend
npm install
npm run build
```

Проверьте что создалась папка `dist/`:
```bash
ls -la dist/
```

---

### Шаг 2: Подготовьте VPS

**Подключитесь к VPS:**
```bash
ssh root@45.129.2.158
```

**Установите Docker (если еще нет):**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
```

**Клонируйте/загрузите проект:**
```bash
# Если есть git репозиторий:
git clone https://github.com/ваш-репо/miniappVK.git
cd miniappVK

# ИЛИ скопируйте с локального:
# На локальном компьютере:
scp -r E:\dev\miniappVK root@45.129.2.158:/root/
```

---

### Шаг 3: Настройте SSL сертификаты

**Установите Certbot:**
```bash
apt update
apt install certbot -y
```

**Получите SSL сертификаты:**
```bash
# Остановите временно докер если запущен
docker-compose -f docker-compose.prod.yml down

# Получите сертификаты
certbot certonly --standalone -d kybyshka-dev.ru
```

**Скопируйте сертификаты для nginx:**
```bash
mkdir -p nginx/ssl
cp /etc/letsencrypt/live/kybyshka-dev.ru/fullchain.pem nginx/ssl/
cp /etc/letsencrypt/live/kybyshka-dev.ru/privkey.pem nginx/ssl/
```

---

### Шаг 4: Запустите на VPS

```bash
# Запустите production
        docker-compose -f docker-compose.prod.yml up -d --build

# Проверьте статус
docker-compose -f docker-compose.prod.yml ps

# Смотрите логи
docker-compose -f docker-compose.prod.yml logs -f
```

**Создайте суперпользователя:**
```bash
docker-compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

---

### Шаг 5: Настройте Firewall

```bash
# Разрешите только необходимые порты
ufw allow 22/tcp   # SSH
ufw allow 80/tcp   # HTTP (redirect to HTTPS)
ufw allow 443/tcp  # HTTPS
ufw enable
```

---

### Шаг 6: Загрузите фронтенд на VK Hosting

**Способ 1: Через веб-интерфейс**
1. Откройте https://vk.com/apps?act=manage
2. Выберите приложение ID: `54267293`
3. Настройки → Хостинг
4. Загрузите папку `frontend/dist/`

**Способ 2: Через CLI**
```bash
cd frontend
npm install -g @vkontakte/vk-miniapps-deploy
vk-miniapps-deploy
```


---

## ✅ Проверка работы

### 1. Проверьте backend API:

```bash
# Health check
curl https://kybyshka-dev.ru/api/health/

# Должно вернуть:
{"status":"ok","service":"vk-miniapp-backend"}

# Config
curl https://kybyshka-dev.ru/api/config/
```

### 2. Проверьте VK Mini App:

1. Откройте https://vk.com/app54267293
2. Нажмите F12 (DevTools) → Console
3. Проверьте что нет ошибок
4. Проверьте Network → запросы к API должны быть 200 OK

### 3. Проверьте безопасность:

```bash
# На VPS проверьте логи VK signature
docker-compose -f docker-compose.prod.yml logs backend | grep "VK signature"

# Должны видеть: "VK signature verified for user..."
```

---

## 🐛 Troubleshooting

### Ошибка SSL сертификата:
```bash
# Обновите сертификаты
certbot renew

# Скопируйте новые
cp /etc/letsencrypt/live/kybyshka-dev.ru/*.pem nginx/ssl/

# Перезапустите nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### Backend возвращает 403:
```bash
# Проверьте VK_APP_SECRET в production.env
# Перезапустите backend
docker-compose -f docker-compose.prod.yml restart backend
```

### CORS ошибки:
```bash
# Проверьте что фронтенд загружен на VK Hosting
# Проверьте CORS_ALLOWED_ORIGINS в production.env
```

---

## 📊 Полезные команды

```bash
# Посмотреть логи всех сервисов
docker-compose -f docker-compose.prod.yml logs -f

# Посмотреть только backend
docker-compose -f docker-compose.prod.yml logs -f backend

# Перезапустить все
docker-compose -f docker-compose.prod.yml restart

# Остановить все
docker-compose -f docker-compose.prod.yml down

# Полная очистка (осторожно! удалит БД)
docker-compose -f docker-compose.prod.yml down -v
```

---

## 🎯 Адреса после деплоя

- **API:** https://kybyshka-dev.ru
- **API Health:** https://kybyshka-dev.ru/api/health/
- **API Config:** https://kybyshka-dev.ru/api/config/
- **Admin:** https://kybyshka-dev.ru/admin/
- **VK Mini App:** https://vk.com/app54267293

---

## ✅ Финальный чеклист

- [ ] `frontend/.env` создан
- [ ] `DJANGO_SECRET_KEY` заполнен в `production.env`
- [ ] `POSTGRES_PASSWORD` заполнен в `production.env`
- [ ] Фронтенд собран (`npm run build`)
- [ ] VPS настроен (Docker установлен)
- [ ] SSL сертификаты получены и скопированы
- [ ] Backend запущен на VPS
- [ ] Суперпользователь создан
- [ ] Firewall настроен
- [ ] Фронтенд загружен на VK Hosting
- [ ] API отвечает (health check)
- [ ] VK Mini App открывается без ошибок
- [ ] VK signature проверяется в логах

---

🎉 **Готово к production!**

