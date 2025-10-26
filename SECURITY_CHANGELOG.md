# 🔒 Changelog безопасности

## [2025-01-25] - Добавлена многоуровневая система защиты

### ✅ Добавлено

#### Backend (Django)

1. **Модуль проверки VK подписи** (`backend/app/vk_security.py`)
   - `verify_vk_launch_params()` - проверка HMAC-SHA256 подписи
   - `extract_vk_user_id()` - безопасное извлечение user ID
   - `get_launch_params_from_request()` - парсинг параметров из запроса
   - `@require_vk_signature` - декоратор для защиты view функций

2. **Middleware автоматической проверки** (`backend/config/vk_middleware.py`)
   - `VKSignatureMiddleware` - автоматическая проверка на защищенных эндпоинтах
   - Защищенные пути: `/api/subscribe/`, `/api/unsubscribe/`, `/api/subscription/status/`
   - Публичные пути (без проверки): `/api/config/`, `/api/offers/`, `/admin/`
   - Логирование всех попыток доступа

3. **Rate Limiting** (обновлен `backend/app/views.py`)
   - `@ratelimit` декоратор на всех view функциях
   - Лимиты:
     - `/api/config/` - 60 req/min
     - `/api/offers/` - 100 req/min
     - `/api/subscribe/` - 20 req/min
     - `/api/subscribe/allow-messages/` - 20 req/min
     - `/api/unsubscribe/` - 10 req/min
     - `/api/subscription/status/` - 30 req/min

4. **Обновленные view функции**
   - Использование проверенных данных из middleware
   - Удален прямой прием `vk_user_id` из request body
   - Добавлена проверка `request.vk_user_id` из middleware

5. **Зависимости** (обновлен `backend/requirements.txt`)
   - Добавлен `django-ratelimit==4.1.0`
   - Удалены дубликаты

6. **Settings** (обновлен `backend/config/settings.py`)
   - Добавлен `VKSignatureMiddleware` в MIDDLEWARE

#### Frontend (React + TypeScript)

1. **Обновленный хук параметров запуска** (`frontend/src/hooks/useLaunchParams.ts`)
   - Использование `VKWebAppGetLaunchParams` через VK Bridge
   - Получение параметров С подписью от VK
   - Сохранение `rawParams` для отправки на backend
   - Fallback для разработки (URL параметры)

2. **Обновленные API функции** (`frontend/src/api/subscription.ts`)
   - `subscribe()` - принимает `launchParams` вместо отдельных параметров
   - `allowMessages()` - принимает `launchParams`
   - `unsubscribe()` - принимает `launchParams`
   - `getSubscriptionStatus()` - передает параметры через query string

3. **Обновленные хуки** (`frontend/src/hooks/useSubscription.ts`)
   - `useSubscriptionStatus()` - принимает `launchParams`
   - `useSubscribe()` - принимает `launchParams` и `brand`
   - `useAllowMessages()` - принимает `launchParams` и `groupId`
   - `useUnsubscribe()` - принимает `launchParams` и `vkUserId`

4. **Обновленные компоненты**
   - `AllowMessagesButton` - принимает `launchParams` prop
   - `UnsubscribeButton` - принимает `launchParams` prop
   - `OffersPage` - передает `rawParams` в компоненты
   - `App.tsx` - использует `rawParams` при подписке

#### Документация

1. **SECURITY.md** - Полное руководство по безопасности
   - Описание всех уровней защиты
   - Конфигурация и настройка
   - Проверка безопасности
   - Действия при атаке
   - Чек-лист production

2. **PRODUCTION_SETUP.md** - Быстрая настройка production
   - Пошаговая инструкция деплоя
   - Настройка VK App
   - Настройка VPS
   - Деплой фронтенда на VK Hosting
   - Troubleshooting

3. **SECURITY_CHANGELOG.md** (этот файл) - История изменений безопасности

### 🛡️ Уровни защиты

| Уровень | Описание | Статус |
|---------|----------|--------|
| 1 | VK Launch Params Signature Verification | ✅ |
| 2 | Rate Limiting (DDoS protection) | ✅ |
| 3 | CORS (только VK) | ✅ |
| 4 | HTTPS + SSL | ✅ |
| 5 | Security Headers (HSTS, Secure Cookies) | ✅ |
| 6 | Logging подозрительных запросов | ✅ |

### 🔧 Что изменилось для разработчиков

#### Backend

**До:**
```python
@api_view(['POST'])
def subscribe_view(request):
    vk_user_id = request.data.get('vk_user_id')  # Небезопасно!
    # ...
```

**После:**
```python
@ratelimit(key='ip', rate='20/m', method='POST')
@api_view(['POST'])
def subscribe_view(request):
    vk_user_id = getattr(request, 'vk_user_id', None)  # Проверено middleware!
    # ...
```

#### Frontend

**До:**
```typescript
subscribe(userId, groupId, brand)  // Небезопасно!
```

**После:**
```typescript
const launchParams = await bridge.send('VKWebAppGetLaunchParams');
subscribe(launchParams, brand)  // Безопасно с подписью!
```

### ⚠️ Breaking Changes

1. **API теперь требует launch_params с подписью** для защищенных эндпоинтов
2. **Старые запросы без подписи вернут 403 Forbidden**
3. **Фронтенд ОБЯЗАН использовать VK Bridge для получения параметров**

### 📦 Файлы изменены

**Backend:**
- ✅ `backend/app/vk_security.py` (новый)
- ✅ `backend/config/vk_middleware.py` (новый)
- ✅ `backend/app/views.py` (обновлен)
- ✅ `backend/config/settings.py` (обновлен)
- ✅ `backend/requirements.txt` (обновлен)

**Frontend:**
- ✅ `frontend/src/hooks/useLaunchParams.ts` (обновлен)
- ✅ `frontend/src/api/subscription.ts` (обновлен)
- ✅ `frontend/src/hooks/useSubscription.ts` (обновлен)
- ✅ `frontend/src/components/AllowMessagesButton.tsx` (обновлен)
- ✅ `frontend/src/components/UnsubscribeButton.tsx` (обновлен)
- ✅ `frontend/src/pages/OffersPage.tsx` (обновлен)
- ✅ `frontend/src/App.tsx` (обновлен)

**Документация:**
- ✅ `SECURITY.md` (новый)
- ✅ `PRODUCTION_SETUP.md` (новый)
- ✅ `SECURITY_CHANGELOG.md` (новый)

### 🎯 Что дальше?

1. **Тестирование:**
   - [ ] Протестировать проверку подписи локально
   - [ ] Протестировать rate limiting
   - [ ] Протестировать на production

2. **Мониторинг:**
   - [ ] Настроить алерты на подозрительную активность
   - [ ] Настроить дашборд метрик
   - [ ] Настроить автоматические бэкапы

3. **Дополнительная защита:**
   - [ ] Fail2Ban для блокировки IP
   - [ ] WAF (Web Application Firewall)
   - [ ] DDoS protection (Cloudflare)

### 📝 Примечания

- Все изменения обратно совместимы для локальной разработки (fallback)
- Production требует правильной настройки `VK_APP_SECRET`
- Фронтенд на VK Hosting работает автоматически (VK Bridge доступен)
- Для локальной разработки используйте `docker-compose.yml` (dev окружение)

---

**Версия:** 1.0.0  
**Дата:** 25 января 2025  
**Автор:** Security Update

