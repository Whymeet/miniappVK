# Часто задаваемые вопросы (FAQ)

## 🚀 Запуск и установка

### Q: Какие требования для запуска проекта?

**A:** Минимальные требования:
- Docker и Docker Compose (рекомендуется)
- ИЛИ: Node.js 18+ и Python 3.11+ (для локальной разработки)

### Q: Как быстро запустить проект?

**A:** Три команды:
```bash
# Создайте .env файл
echo "DJANGO_SECRET_KEY=secret\nVITE_API_BASE=http://localhost:8000\nDEFAULT_BRAND=kokos" > .env

# Запустите
docker-compose up --build

# Откройте http://localhost:5173
```

См. [QUICKSTART.md](QUICKSTART.md) для подробностей.

### Q: Проект не запускается, что делать?

**A:** Проверьте:
1. Docker запущен: `docker --version`
2. Порты 5173 и 8000 свободны
3. Создан файл `.env`
4. Логи: `docker-compose logs -f`

---

## 🎨 White-Label

### Q: Как работает система white-label?

**A:** Система определяет бренд по цепочке:
1. Query параметр `?brand=kokos` (приоритет)
2. VK Group ID из launch params
3. Дефолтный бренд из ENV

Каждый бренд имеет свою конфигурацию (цвета, лого, тексты).

### Q: Как добавить новый бренд?

**A:** 
1. Откройте `backend/app/brands.py`
2. Добавьте конфиг в `BRAND_CONFIGS`:
```python
'newbrand': {
    'name': 'Новый Бренд',
    'palette': {...},
    'logo_url': '...',
    'copy': {...},
    'features': {...}
}
```
3. Опционально добавьте маппинг в `GROUP_TO_BRAND`
4. Перезапустите backend

См. [EXAMPLES.md](EXAMPLES.md#добавление-нового-бренда)

### Q: Можно ли изменить бренд без пересборки?

**A:** Да! Это основная фича white-label:
- Изменения в `brands.py` → просто перезапустите backend
- Никакой пересборки фронтенда не нужно
- Темы применяются динамически через CSS variables

### Q: Как тестировать разные бренды локально?

**A:** Используйте query параметр:
```
http://localhost:5173/#/?brand=kokos
http://localhost:5173/#/?brand=kubyshka
```

### Q: Сколько брендов можно создать?

**A:** Технически неограниченно. Каждый бренд - это просто объект в конфиге.

---

## 💳 Офферы

### Q: Где хранятся данные офферов?

**A:** Сейчас в `backend/app/offers.py` как моковые данные (`MOCK_OFFERS`).

В будущем можно:
- Хранить в БД (создать модель `Offer`)
- Подгружать из внешнего API
- Кэшировать в Redis

### Q: Как добавить новый оффер?

**A:** Добавьте в `MOCK_OFFERS`:
```python
{
    'id': 'offer_6',
    'partner_name': 'Новый Партнёр',
    'sum_min': 1000,
    'sum_max': 50000,
    # ... остальные поля
}
```

См. [EXAMPLES.md](EXAMPLES.md#добавление-нового-оффера)

### Q: Как работает фильтрация офферов?

**A:** Фильтры применяются в `backend/app/offers.py`:
- `sum_need` - проверяет, что сумма в диапазоне [sum_min, sum_max]
- `term_days` - проверяет срок
- `sort` - сортирует по rate/sum/term

### Q: Можно ли интегрировать с реальными партнёрскими API?

**A:** Да! Замените функцию `get_offers()` в `offers.py`:
```python
def get_offers(...):
    # Вместо MOCK_OFFERS
    response = requests.get('https://partner-api.com/offers')
    offers = response.json()
    # ... обработка
    return offers
```

---

## 🔌 API

### Q: Какие API endpoints доступны?

**A:**
- `GET /api/config/` - конфигурация бренда
- `GET /api/offers/` - список офферов
- `GET /api/go/:id/` - редирект на оффер
- `GET /api/health/` - health check

См. [backend/README.md](backend/README.md)

### Q: Как тестировать API?

**A:** Используйте curl:
```bash
curl "http://localhost:8000/api/config/?brand=kokos"
curl "http://localhost:8000/api/offers/"
```

Или Postman/Insomnia.

### Q: Есть ли аутентификация в API?

**A:** В MVP нет. Для продакшена рекомендуется:
- Проверка подписи VK launch params
- JWT токены
- Rate limiting

### Q: Как логируются клики?

**A:** При переходе на `/api/go/:id/` создаётся запись в БД (`ClickLog`):
- offer_id
- vk_user_id, group_id
- IP, user agent
- timestamp

---

## 🐳 Docker

### Q: Нужен ли Docker для разработки?

**A:** Необязательно, но рекомендуется:
- ✅ С Docker: всё работает из коробки
- ⚠️ Без Docker: нужно настраивать Python venv и Node.js

### Q: Как зайти в контейнер?

**A:**
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

### Q: Как посмотреть логи?

**A:**
```bash
docker-compose logs -f           # все
docker-compose logs -f backend   # только backend
docker-compose logs -f frontend  # только frontend
```

### Q: Как пересобрать после изменений?

**A:**
```bash
docker-compose up --build
# или
make build && make up
```

### Q: Как очистить все контейнеры и volumes?

**A:**
```bash
docker-compose down -v
docker system prune -f
```

---

## 🔧 Разработка

### Q: Как запустить в dev режиме?

**A:**
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
# или
make dev
```

### Q: Где хранятся миграции БД?

**A:** `backend/app/migrations/`

Создание миграций:
```bash
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### Q: Как создать суперпользователя?

**A:**
```bash
docker-compose exec backend python manage.py createsuperuser
```

Затем войдите в админку: http://localhost:8000/admin/

### Q: Используется ли TypeScript?

**A:** Да, весь фронтенд на TypeScript с строгой типизацией.

### Q: Какой линтер используется?

**A:**
- Frontend: ESLint
- Backend: можно добавить flake8/black

Запуск линтера:
```bash
cd frontend && npm run lint
```

---

## 🚀 VK Mini App

### Q: Как протестировать в VK?

**A:**
1. Создайте VK Mini App
2. Используйте VK Tunnel для локального тестирования:
```bash
npx @vkontakte/vk-tunnel --insecure=1 --port=5173
```
3. Полученный URL укажите в настройках приложения

### Q: Как получить vk_group_id?

**A:** VK передаёт его в launch params автоматически при запуске из группы.

Для тестирования можно мокировать в `useLaunchParams.ts`.

### Q: Работает ли VK Bridge локально?

**A:** VK Bridge работает только внутри VK. Локально можно тестировать через VK Tunnel.

### Q: Как запросить разрешение на уведомления?

**A:** Используется `VKWebAppAllowMessagesFromGroup`:
```typescript
bridge.send('VKWebAppAllowMessagesFromGroup', {
  group_id: parseInt(groupId)
});
```

См. `frontend/src/components/AllowMessagesButton.tsx`

### Q: Что такое launch params и зачем они нужны?

**A:** Launch params - это параметры, которые VK передаёт при запуске:
- `vk_user_id` - ID пользователя
- `vk_group_id` - ID группы
- `vk_platform` - платформа (mobile/desktop)
- и другие

Используются для определения бренда и персонализации.

---

## 📱 UI/UX

### Q: Почему используется VKUI?

**A:** VKUI - официальная UI библиотека VK:
- Нативный вид в VK
- Адаптивность
- Темизация (light/dark)
- Accessibility

### Q: Как изменить дизайн карточек?

**A:** Редактируйте `frontend/src/components/OfferCard.tsx`.

Можно менять:
- Расположение элементов
- Стили
- Добавлять новые поля

### Q: Как работает темизация (light/dark)?

**A:** VKUI автоматически поддерживает темы VK через `ConfigProvider`:
```tsx
<ConfigProvider appearance={scheme}>
  ...
</ConfigProvider>
```

scheme приходит из VK Bridge events.

### Q: Можно ли добавить анимации?

**A:** Да, используйте:
- CSS transitions
- Framer Motion (нужно установить)
- VKUI встроенные анимации

---

## 🗄️ База данных

### Q: Какая БД используется?

**A:** По умолчанию SQLite (для dev).

Для продакшена рекомендуется PostgreSQL.

### Q: Как мигрировать на PostgreSQL?

**A:** См. [EXAMPLES.md](EXAMPLES.md#миграция-на-postgresql)

Кратко:
1. Добавьте сервис `db` в docker-compose
2. Обновите `settings.py`
3. Установите `psycopg2`

### Q: Где хранятся данные SQLite?

**A:** `backend/db.sqlite3`

### Q: Нужна ли миграция при изменении моделей?

**A:** Да:
```bash
python manage.py makemigrations
python manage.py migrate
```

---

## 📊 Аналитика

### Q: Как отслеживать клики по офферам?

**A:** Автоматически логируются в модель `ClickLog` при переходе через `/api/go/:id/`.

Данные включают:
- offer_id
- vk_user_id
- timestamp
- IP, user agent

### Q: Как добавить Яндекс.Метрику / Google Analytics?

**A:** Добавьте счётчик в `frontend/index.html` или используйте React компонент.

Пример отправки событий в `OffersPage.tsx`:
```typescript
if (window.ym) {
  window.ym(COUNTER_ID, 'reachGoal', 'offer_click');
}
```

См. [EXAMPLES.md](EXAMPLES.md#интеграция-с-аналитикой)

---

## 🚢 Деплой

### Q: Как задеплоить на продакшен?

**A:** См. [DEPLOY.md](DEPLOY.md)

Варианты:
1. VK Hosting (frontend) + VPS (backend)
2. Docker на VPS (оба сервиса)
3. Kubernetes (для масштабирования)

### Q: Как настроить SSL?

**A:** Используйте:
- Let's Encrypt + certbot
- Cloudflare (прокси + SSL)
- Nginx с SSL конфигом

### Q: Нужен ли CI/CD?

**A:** Рекомендуется для продакшена:
- GitHub Actions
- GitLab CI
- Jenkins

Можно автоматизировать тесты, линтинг, деплой.

### Q: Как обновить проект на продакшене?

**A:**
```bash
git pull
docker-compose down
docker-compose up -d --build
```

Или используйте CI/CD pipeline.

---

## 🔒 Безопасность

### Q: Как защитить API от злоупотреблений?

**A:**
1. Проверка подписи VK launch params
2. Rate limiting (django-ratelimit)
3. CORS настройки
4. Валидация входных данных

### Q: Безопасно ли хранить SECRET_KEY в .env?

**A:** Для dev - да. Для продакшена:
- Используйте secrets management (Vault, AWS Secrets)
- Не коммитьте .env в Git
- Генерируйте уникальный ключ

### Q: Нужна ли HTTPS?

**A:** Обязательно для продакшена! VK требует HTTPS для Mini Apps.

---

## 🐛 Отладка

### Q: CORS ошибки при запросах к API

**A:** Проверьте:
1. `VITE_API_BASE` в .env
2. `CORS_ALLOW_ALL_ORIGINS` в settings.py
3. Backend запущен и доступен

### Q: Frontend не загружает конфиг

**A:** Проверьте:
1. Backend API работает: `curl http://localhost:8000/api/config/`
2. Нет ошибок в консоли браузера
3. React Query не кэширует старые данные (перезагрузите)

### Q: Офферы не фильтруются

**A:** Проверьте:
1. Параметры передаются в URL
2. Логика фильтрации в `offers.py`
3. Типы данных (число, а не строка)

### Q: Docker контейнер не стартует

**A:** Смотрите логи:
```bash
docker-compose logs backend
docker-compose logs frontend
```

Частые причины:
- Порт занят
- Ошибка в коде
- Отсутствует .env

---

## 💡 Расширения

### Q: Можно ли добавить регистрацию пользователей?

**A:** Да! Создайте модель `User` и реализуйте:
- VK OAuth аутентификацию
- JWT токены
- Профиль пользователя

### Q: Как добавить корзину/избранное?

**A:**
1. Создайте модель `Favorite`
2. API для добавления/удаления
3. Храните в LocalStorage или БД

### Q: Можно ли добавить VK Бота?

**A:** Да! Используйте:
- VK Bots API
- Уведомления через VKWebAppAllowMessagesFromGroup
- Webhook для обработки сообщений

### Q: Как интегрировать оплату?

**A:** VK поддерживает:
- VK Pay
- VK Coin (для виртуальной валюты)

Используйте VK Bridge методы для оплаты.

---

## 📞 Поддержка

### Q: Где получить помощь?

**A:**
1. Читайте документацию в проекте
2. Проверьте [FAQ.md](FAQ.md) (этот файл)
3. Issues в GitHub
4. VK Mini Apps сообщество

### Q: Как сообщить об ошибке?

**A:** Создайте issue в репозитории с:
- Описанием проблемы
- Шагами воспроизведения
- Логами
- Версией проекта

### Q: Можно ли использовать коммерчески?

**A:** Да, проект под MIT лицензией.

---

**Не нашли ответ?** Создайте issue в репозитории!

