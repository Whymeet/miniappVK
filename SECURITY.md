# 🔒 Руководство по безопасности VK Mini App

## Обзор

Этот проект реализует многоуровневую систему безопасности для защиты от несанкционированного доступа и злоупотреблений.

## 🛡️ Уровни защиты

### 1. Проверка VK подписи (VK Launch Params Signature)

**Что это:** VK передает параметры запуска (vk_user_id, vk_app_id и др.) вместе с HMAC-SHA256 подписью, которая гарантирует, что данные не были подделаны.

**Как работает:**
- Фронтенд получает параметры через `VKWebAppGetLaunchParams` от VK Bridge
- Параметры включают `sign` - HMAC-SHA256 подпись
- Backend проверяет подпись используя `VK_APP_SECRET`
- Только запросы с валидной подписью обрабатываются

**Защищенные эндпоинты:**
- `/api/subscribe/` - подписка пользователя
- `/api/subscribe/allow-messages/` - разрешение уведомлений
- `/api/unsubscribe/` - отписка
- `/api/subscription/status/` - статус подписки

**Реализация:**
- **Backend:** `backend/app/vk_security.py` - функции проверки подписи
- **Backend:** `backend/config/vk_middleware.py` - автоматическая проверка для защищенных эндпоинтов
- **Frontend:** `frontend/src/hooks/useLaunchParams.ts` - получение параметров с подписью

### 2. Rate Limiting (Ограничение частоты запросов)

**Что это:** Ограничение количества запросов с одного IP адреса для защиты от DDoS и спама.

**Лимиты:**
- `/api/config/` - 60 запросов/минуту
- `/api/offers/` - 100 запросов/минуту
- `/api/subscribe/` - 20 запросов/минуту
- `/api/subscribe/allow-messages/` - 20 запросов/минуту
- `/api/unsubscribe/` - 10 запросов/минуту
- `/api/subscription/status/` - 30 запросов/минуту

**Реализация:** Используется `django-ratelimit` с ключом по IP адресу

### 3. CORS (Cross-Origin Resource Sharing)

**Что это:** Ограничение доменов, которые могут делать запросы к API.

**Production конфигурация:**
```python
CORS_ALLOWED_ORIGINS = [
    'https://vk.com',
]
CORS_ALLOW_CREDENTIALS = True
```

Только запросы из VK принимаются на production.

### 4. HTTPS с SSL

**Что это:** Шифрование всего трафика между клиентом и сервером.

**Production конфигурация:**
- Nginx настроен на HTTPS (порт 443)
- HTTP запросы редиректятся на HTTPS
- SSL сертификаты (рекомендуется Let's Encrypt)

### 5. Security Headers

**Django security settings (production):**
```python
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000
```

### 6. Логирование подозрительной активности

**Что логируется:**
- Неудачные попытки проверки подписи
- IP адреса злоумышленников
- Временные метки атак

**Где посмотреть логи:**
```bash
docker-compose -f docker-compose.prod.yml logs backend | grep "VK signature"
```

## 📋 Конфигурация

### Переменные окружения (production.env)

**Критически важные:**
```env
# Секретный ключ VK приложения (для проверки подписи)
VK_APP_SECRET=your-vk-app-secret-key

# Секретный ключ Django
DJANGO_SECRET_KEY=your-very-secure-secret-key-CHANGE-THIS

# Пароль PostgreSQL
POSTGRES_PASSWORD=change-this-secure-password
```

⚠️ **НИКОГДА не коммитьте production.env в git!**

### Настройка на VPS

1. **Firewall (UFW):**
```bash
sudo ufw allow 443/tcp
sudo ufw allow 80/tcp
sudo ufw enable
```

2. **Fail2Ban (опционально, для дополнительной защиты):**
```bash
sudo apt install fail2ban
sudo systemctl enable fail2ban
```

3. **SSL сертификаты (Let's Encrypt):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 🔍 Проверка безопасности

### Проверка VK подписи

**Тест локально:**
```python
# backend/app/vk_security.py
from app.vk_security import verify_vk_launch_params

params = {
    'vk_user_id': '12345',
    'vk_app_id': '51888888',
    'vk_platform': 'mobile_web',
    'sign': 'calculated_sign_here'
}

is_valid = verify_vk_launch_params(params)
print(f"Signature valid: {is_valid}")
```

### Проверка rate limiting

```bash
# Отправить 30 запросов за секунду (должно блокироваться)
for i in {1..30}; do
  curl https://your-domain.com/api/config/ &
done
```

### Проверка CORS

```bash
# Запрос с неразрешенного домена (должен блокироваться)
curl -H "Origin: https://evil.com" \
     https://your-domain.com/api/config/
```

## 🚨 Что делать при атаке

### 1. DDoS атака

**Признаки:**
- Большое количество запросов
- Сервер не отвечает
- High CPU/Memory usage

**Действия:**
```bash
# Посмотреть топ IP адресов
docker-compose -f docker-compose.prod.yml logs nginx | \
  awk '{print $1}' | sort | uniq -c | sort -rn | head -20

# Заблокировать IP в nginx
# Добавить в nginx/prod.conf:
# deny 123.456.789.0;
```

### 2. Попытки подделки VK подписи

**Признаки:**
```bash
# Логи показывают failed signature
docker-compose -f docker-compose.prod.yml logs backend | \
  grep "VK signature validation failed"
```

**Действия:**
- Проверьте, что `VK_APP_SECRET` корректный
- Заблокируйте атакующие IP через firewall

### 3. Брутфорс админки

**Действия:**
```bash
# Установить fail2ban фильтр для Django admin
# или использовать django-axes для блокировки
```

## ✅ Чек-лист безопасности Production

- [ ] `VK_APP_SECRET` установлен корректно
- [ ] `DJANGO_SECRET_KEY` - уникальный случайный ключ
- [ ] `POSTGRES_PASSWORD` - сложный пароль
- [ ] `DEBUG=False` в production
- [ ] HTTPS настроен с валидным SSL сертификатом
- [ ] Firewall (UFW) настроен
- [ ] Rate limiting работает
- [ ] CORS настроен только для VK
- [ ] `production.env` НЕ в git (в .gitignore)
- [ ] Логирование настроено
- [ ] Регулярные бэкапы базы данных
- [ ] Мониторинг работает (uptime, errors)

## 📚 Дополнительные ресурсы

- [VK Mini Apps Security](https://dev.vk.com/ru/mini-apps/development/launch-params)
- [Django Security](https://docs.djangoproject.com/en/4.2/topics/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)

## 🐛 Сообщить о уязвимости

Если вы нашли уязвимость в безопасности, пожалуйста, **НЕ создавайте публичный issue**. 

Свяжитесь с разработчиками напрямую.

