# 🔒 Безопасность и защита данных

## ⚠️ ВАЖНО! Чувствительные данные

### Что НИКОГДА не должно попасть в Git

#### 🔴 Критично важно
- ✅ `.env` и все `.env.*` файлы → **НЕ КОММИТИТЬ!**
- ✅ `DJANGO_SECRET_KEY` → **НЕ КОММИТИТЬ!**
- ✅ `VK_APP_SECRET` → **НЕ КОММИТИТЬ!**
- ✅ `db.sqlite3` (содержит данные) → **НЕ КОММИТИТЬ!**
- ✅ Любые файлы с паролями, токенами, API ключами → **НЕ КОММИТИТЬ!**

#### 🟡 Важно
- ⚠️ Логи (могут содержать чувствительные данные)
- ⚠️ Бэкапы БД
- ⚠️ SSL сертификаты и ключи
- ⚠️ Секретные конфиги

## ✅ Проверка перед коммитом

### Быстрая проверка

```bash
# Проверьте что .env НЕ будет закоммичен
git status

# Если видите .env в списке - СТОП!
# Добавьте в .gitignore и удалите из индекса:
git rm --cached .env
echo ".env" >> .gitignore
```

### Команды проверки

```bash
# Проверить что игнорируется
git check-ignore .env
# Должно вывести: .env

# Проверить все игнорируемые файлы
git status --ignored

# Поиск потенциально опасных файлов
git ls-files | grep -E '\.(env|key|pem|secret)$'
# Не должно ничего найти!
```

## 🔐 Генерация секретных ключей

### Django Secret Key

```bash
# Способ 1: Python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"

# Способ 2: OpenSSL
openssl rand -base64 50

# Способ 3: Online (НЕ РЕКОМЕНДУЕТСЯ для production!)
# https://djecrety.ir/
```

### Рекомендации для ключей
- ✅ Длина: минимум 50 символов
- ✅ Уникальность: разные для dev/staging/prod
- ✅ Ротация: меняйте раз в 3-6 месяцев
- ✅ Хранение: используйте secrets manager

## 🛡️ Настройки безопасности для Production

### Django settings.py

```python
# ОБЯЗАТЕЛЬНО для production!
DEBUG = False
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')  # Из .env
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(',')

# HTTPS
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

# HSTS
SECURE_HSTS_SECONDS = 31536000  # 1 год
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Другие заголовки безопасности
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'ALLOW-FROM https://vk.com'

# CSRF
CSRF_COOKIE_HTTPONLY = True
CSRF_TRUSTED_ORIGINS = [
    'https://your-domain.com',
    'https://vk.com',
]
```

### Nginx конфигурация

```nginx
# Security headers
add_header X-Frame-Options "ALLOW-FROM https://vk.com" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# CSP для VK Mini App
add_header Content-Security-Policy "frame-ancestors https://vk.com https://*.vk.com;" always;

# SSL
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers HIGH:!aNULL:!MD5;
```

## 🔍 VK Mini App специфика

### Проверка подписи launch params

**TODO: Реализовать проверку подписи!**

```python
# backend/app/vk_auth.py (нужно создать)
import hashlib
import hmac
from urllib.parse import parse_qs

def verify_launch_params(query_string, secret_key):
    """
    Проверка подписи параметров запуска VK Mini App
    """
    params = parse_qs(query_string)
    
    # Получаем sign из параметров
    vk_sign = params.pop('sign', [None])[0]
    if not vk_sign:
        return False
    
    # Сортируем параметры и создаём строку
    sorted_params = sorted(params.items())
    param_str = '&'.join([f"{k}={v[0]}" for k, v in sorted_params])
    
    # Вычисляем HMAC
    secret = secret_key.encode()
    message = param_str.encode()
    sign = hmac.new(secret, message, hashlib.sha256).hexdigest()
    
    return hmac.compare_digest(sign, vk_sign)

# Использование в views.py
from django.conf import settings
from .vk_auth import verify_launch_params

def config_view(request):
    query_string = request.META.get('QUERY_STRING', '')
    
    if not settings.DEBUG:
        if not verify_launch_params(query_string, settings.VK_APP_SECRET):
            return Response({'error': 'Invalid signature'}, status=403)
    
    # ... остальной код
```

### Валидация vk_user_id

```python
def offer_redirect_view(request, offer_id):
    vk_user_id = request.GET.get('vk_user_id')
    
    # Проверка что это число
    try:
        vk_user_id = int(vk_user_id)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid user_id'}, status=400)
    
    # Проверка что не отрицательное
    if vk_user_id < 0:
        return Response({'error': 'Invalid user_id'}, status=400)
    
    # ... остальной код
```

## 🚨 Защита от атак

### Rate Limiting

```bash
# Установка
pip install django-ratelimit
```

```python
# backend/app/views.py
from django_ratelimit.decorators import ratelimit

@ratelimit(key='ip', rate='100/h', method='GET')
@api_view(['GET'])
def offers_view(request):
    # ... код
    pass

@ratelimit(key='ip', rate='10/m', method='GET')
@api_view(['GET'])
def offer_redirect_view(request, offer_id):
    # ... код
    pass
```

### SQL Injection

✅ Django ORM автоматически защищает
⚠️ Избегайте raw SQL запросов

```python
# ❌ ПЛОХО
User.objects.raw(f"SELECT * FROM users WHERE id = {user_id}")

# ✅ ХОРОШО
User.objects.filter(id=user_id)
```

### XSS (Cross-Site Scripting)

✅ React автоматически экранирует
✅ DRF возвращает JSON (безопасно)

```typescript
// ❌ ПЛОХО
<div dangerouslySetInnerHTML={{__html: userInput}} />

// ✅ ХОРОШО
<div>{userInput}</div>
```

### CSRF

✅ Django автоматически защищает
✅ Настройте CSRF_TRUSTED_ORIGINS

## 📊 Мониторинг безопасности

### Sentry для отслеживания ошибок

```bash
pip install sentry-sdk
```

```python
# backend/config/settings.py
import sentry_sdk

if not DEBUG:
    sentry_sdk.init(
        dsn=os.getenv('SENTRY_DSN'),
        environment='production',
        traces_sample_rate=1.0,
    )
```

### Логирование подозрительной активности

```python
# backend/app/middleware.py
import logging

logger = logging.getLogger('security')

class SecurityMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Логируем подозрительные запросы
        if self.is_suspicious(request):
            logger.warning(f"Suspicious request from {request.META.get('REMOTE_ADDR')}")
        
        response = self.get_response(request)
        return response
    
    def is_suspicious(self, request):
        # Проверки на подозрительность
        # - Слишком много запросов
        # - Необычные user agents
        # - Попытки SQL injection в параметрах
        pass
```

## 🔄 Регулярные проверки

### Еженедельно
- [ ] Проверить логи на ошибки
- [ ] Проверить failed login attempts
- [ ] Проверить необычную активность

### Ежемесячно
- [ ] Обновить зависимости (npm audit, pip check)
- [ ] Проверить SSL сертификаты
- [ ] Ревью access logs

### Каждые 3-6 месяцев
- [ ] Ротация SECRET_KEY
- [ ] Ротация VK_APP_SECRET
- [ ] Ротация DB паролей
- [ ] Security audit кодовой базы

## 🛠️ Инструменты проверки

### Python/Django

```bash
# Проверка зависимостей
pip install safety
safety check

# Проверка кода
pip install bandit
bandit -r backend/

# Django security check
python manage.py check --deploy
```

### Node.js/Frontend

```bash
# Проверка зависимостей
npm audit
npm audit fix

# Обновление пакетов
npm outdated
npm update
```

### Docker

```bash
# Сканирование образов
docker scan vk_miniapp_backend
docker scan vk_miniapp_frontend
```

## 📝 Чеклист перед деплоем

### Backend
- [ ] `DEBUG = False`
- [ ] Уникальный `SECRET_KEY` генерирован
- [ ] `ALLOWED_HOSTS` настроен правильно
- [ ] HTTPS включён
- [ ] CSRF protection настроен
- [ ] Rate limiting добавлен
- [ ] Проверка VK подписи реализована
- [ ] Логирование настроено
- [ ] Sentry подключён

### Frontend
- [ ] API URL указывает на production
- [ ] Source maps отключены или защищены
- [ ] CSP заголовки настроены
- [ ] Analytics настроена

### Infrastructure
- [ ] SSL сертификаты установлены
- [ ] Firewall настроен
- [ ] Бэкапы БД настроены
- [ ] Мониторинг работает
- [ ] Alerts настроены

## 🆘 Что делать если секреты утекли

### Немедленные действия

1. **Ротируйте все ключи:**
   ```bash
   # Генерируйте новый SECRET_KEY
   python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
   
   # Обновите .env на сервере
   # Перезапустите приложение
   docker-compose restart
   ```

2. **Ревокните старые ключи:**
   - VK App Secret → пересоздайте в настройках VK
   - API ключи партнёров → обратитесь к партнёрам

3. **Проверьте логи:**
   - Поищите подозрительную активность
   - Проверьте unauthorized access

4. **Удалите из Git истории:**
   ```bash
   # Используйте BFG Repo-Cleaner
   bfg --delete-files .env
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

5. **Уведомите команду:**
   - Сообщите всем о произошедшем
   - Обновите документацию

## 📚 Дополнительные ресурсы

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Django Security](https://docs.djangoproject.com/en/4.2/topics/security/)
- [VK API Security](https://dev.vk.com/api/access-token/getting-started)
- [Mozilla Web Security](https://infosec.mozilla.org/guidelines/web_security)

---

**Помните: Безопасность - это процесс, а не состояние!**

Регулярно обновляйте и проверяйте защиту вашего приложения.

