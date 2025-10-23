# Настройка системы подписки - Инструкция

Эта инструкция поможет вам настроить и запустить систему подписки VK ID для рассылки.

## 🚀 Быстрый старт

### 1. Обновите переменные окружения

Скопируйте `env.example` в `.env` и заполните необходимые параметры:

```bash
cp env.example .env
```

Обязательно укажите:
- `VK_GROUP_ACCESS_TOKEN` - токен сообщества для отправки сообщений
- `VK_CALLBACK_SECRET` - секретный ключ для Callback API (любая строка)
- `VK_CONFIRMATION_CODE` - код подтверждения (получите от VK)

### 2. Создайте и примените миграции

```bash
# Создание миграций
docker-compose exec backend python manage.py makemigrations

# Применение миграций
docker-compose exec backend python manage.py migrate
```

Или если контейнеры еще не запущены:

```bash
# Запустите контейнеры
docker-compose up -d

# Затем выполните миграции
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### 3. Создайте суперпользователя для админки

```bash
docker-compose exec backend python manage.py createsuperuser
```

Следуйте инструкциям и создайте учетную запись администратора.

### 4. Проверьте админ-панель

Откройте `http://localhost:8000/admin/` и войдите с созданными учетными данными.

Вы должны увидеть разделы:
- **Subscribers** - управление подписчиками
- **Click Logs** - история кликов

## 📝 Получение токенов VK

### VK_GROUP_ACCESS_TOKEN

1. Откройте настройки вашего сообщества VK
2. Перейдите в **Работа с API** → **Ключи доступа**
3. Нажмите **Создать ключ**
4. Выберите разрешения:
   - ✅ **Сообщения сообщества** (обязательно)
5. Нажмите **Создать** и скопируйте токен
6. Добавьте в `.env`: `VK_GROUP_ACCESS_TOKEN=ваш_токен`

### VK_CALLBACK_SECRET

Это любая строка, которую вы придумаете сами для проверки подлинности запросов от VK.

Рекомендации:
- Минимум 16 символов
- Используйте буквы, цифры и спецсимволы
- Пример: `MySecretKey_2024_!@#$`

Добавьте в `.env`: `VK_CALLBACK_SECRET=ваш_секретный_ключ`

### VK_CONFIRMATION_CODE

Этот код получается автоматически при первой настройке Callback API.

**Порядок действий:**

1. Убедитесь, что приложение запущено и доступно по URL
2. Откройте настройки сообщества VK
3. Перейдите в **Работа с API** → **Callback API**
4. Укажите **Адрес сервера**: `https://your-domain.com/api/vk-callback/`
5. Укажите **Секретный ключ**: тот же, что в `VK_CALLBACK_SECRET`
6. VK отправит запрос на ваш сервер
7. Проверьте логи Django: `docker-compose logs backend`
8. Найдите код подтверждения в логах или получите его в интерфейсе VK
9. Добавьте в `.env`: `VK_CONFIRMATION_CODE=полученный_код`
10. Перезапустите контейнер: `docker-compose restart backend`
11. Вернитесь в настройки VK и нажмите **Подтвердить**

### Настройка событий Callback API

После подтверждения сервера включите следующие типы событий:

- ✅ **message_allow** - пользователь разрешил отправку сообщений
- ✅ **message_deny** - пользователь запретил отправку сообщений

## ✅ Проверка работоспособности

### 1. Проверьте API endpoints

```bash
# Проверка здоровья
curl http://localhost:8000/api/health/

# Подписка тестового пользователя
curl -X POST http://localhost:8000/api/subscribe/ \
  -H "Content-Type: application/json" \
  -d '{"vk_user_id":"12345","group_id":"67890","brand":"kubyshka"}'

# Проверка статуса
curl http://localhost:8000/api/subscription/status/?vk_user_id=12345
```

### 2. Проверьте админ-панель

1. Откройте `http://localhost:8000/admin/app/subscriber/`
2. Должны появиться тестовые подписчики
3. Попробуйте экспортировать в CSV

### 3. Протестируйте фронтенд

1. Откройте приложение: `http://localhost:5173`
2. Проверьте, что при входе создается подписчик в базе
3. Нажмите "Разрешить уведомления"
4. Проверьте, что статус обновился в админке

## 🔧 Решение проблем

### Ошибка: "VK_GROUP_ACCESS_TOKEN not configured"

- Убедитесь, что токен добавлен в `.env`
- Перезапустите контейнер: `docker-compose restart backend`

### Callback API не работает

1. Проверьте, что URL доступен извне (не localhost)
2. Проверьте секретный ключ в `.env` и настройках VK
3. Проверьте логи: `docker-compose logs -f backend`
4. Убедитесь, что события `message_allow` и `message_deny` включены

### Миграции не применяются

```bash
# Удалите старые миграции (если нужно)
docker-compose exec backend find . -path "*/migrations/*.py" -not -name "__init__.py" -delete
docker-compose exec backend find . -path "*/migrations/*.pyc" -delete

# Создайте заново
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
```

### База данных не содержит таблиц

```bash
# Проверьте статус миграций
docker-compose exec backend python manage.py showmigrations

# Примените все миграции
docker-compose exec backend python manage.py migrate
```

## 📊 Использование

### Просмотр подписчиков

Админ-панель: `http://localhost:8000/admin/app/subscriber/`

Фильтры:
- По бренду
- По статусу подписки
- По разрешению сообщений
- По дате создания

### Экспорт подписчиков

1. Выберите нужных подписчиков (checkbox)
2. В меню "Действие" выберите "Экспорт выбранных в CSV"
3. Нажмите "Выполнить"

CSV файл будет скачан автоматически.

### Отправка сообщений

Создайте скрипт для массовой рассылки:

```python
# backend/send_broadcast.py
from app.vk_api import send_message
from app.models import Subscriber
import time

def send_broadcast():
    subscribers = Subscriber.objects.filter(
        subscribed=True,
        allowed_from_group=True,
        brand='kubyshka'
    )
    
    for subscriber in subscribers:
        try:
            send_message(
                user_id=subscriber.vk_user_id,
                message="🎉 Новое предложение!"
            )
            time.sleep(0.5)  # Пауза между сообщениями
        except Exception as e:
            print(f"Error: {e}")

if __name__ == '__main__':
    send_broadcast()
```

Запуск:

```bash
docker-compose exec backend python send_broadcast.py
```

## 📚 Дополнительные ресурсы

- [backend/README.md](backend/README.md) - полная документация бэкенда
- [EXAMPLES.md](EXAMPLES.md) - примеры использования
- [README.md](README.md) - общая документация проекта

## 🆘 Поддержка

Если у вас возникли вопросы:
1. Изучите документацию в [EXAMPLES.md](EXAMPLES.md)
2. Проверьте логи: `docker-compose logs -f backend`
3. Откройте issue в репозитории

