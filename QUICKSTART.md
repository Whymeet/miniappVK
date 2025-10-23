# Быстрый старт за 5 минут

## 🚀 Запуск через Docker (рекомендуется)

### 1. Клонируйте репозиторий (или используйте текущую директорию)

```bash
cd miniappVK
```

### 2. Создайте файл с переменными окружения

Создайте файл `.env` в корне проекта:

```env
# Backend
DJANGO_SECRET_KEY=my-secret-key-12345
DJANGO_DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1,backend
DEFAULT_BRAND=kokos

# Frontend
VITE_API_BASE=http://localhost:8000

# VK App (опционально)
VK_APP_SECRET=
```

### 3. Запустите проект

```bash
# Сборка и запуск
docker-compose up --build

# Или используйте Makefile
make build
make up
```

### 4. Откройте в браузере

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api/config/
- Admin панель: http://localhost:8000/admin/

### 5. Создайте суперпользователя (опционально)

```bash
docker-compose exec backend python manage.py createsuperuser
```

---

## 💻 Локальный запуск без Docker

### Backend

```bash
cd backend

# Создание виртуального окружения
python -m venv venv

# Активация (Windows)
venv\Scripts\activate

# Активация (Linux/Mac)
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt

# Миграции
python manage.py migrate

# Запуск
python manage.py runserver
```

Backend доступен на http://localhost:8000

### Frontend

```bash
cd frontend

# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev
```

Frontend доступен на http://localhost:5173

---

## ✅ Проверка работы

### 1. Тестирование API

```bash
# Конфигурация бренда Кокос
curl "http://localhost:8000/api/config/?brand=kokos"

# Конфигурация бренда Кубышка
curl "http://localhost:8000/api/config/?brand=kubyshka"

# Список офферов
curl "http://localhost:8000/api/offers/?sum_need=10000&term_days=30"
```

### 2. Тестирование white-label

Откройте в браузере:

- Бренд Кокос: http://localhost:5173/#/?brand=kokos
- Бренд Кубышка: http://localhost:5173/#/?brand=kubyshka

Обратите внимание на изменение:
- Цветовой схемы
- Логотипа
- Текстов

---

## 🎨 Добавление своего бренда

### 1. Откройте `backend/app/brands.py`

### 2. Добавьте конфигурацию

```python
BRAND_CONFIGS = {
    'mybrand': {
        'name': 'Мой Бренд',
        'palette': {
            'primary': '#FF0000',      # основной цвет
            'secondary': '#00FF00',    # дополнительный
            'background': '#FFFFFF',   # фон
            'surface': '#F5F5F5',      # поверхность карточек
            'text': '#000000',         # основной текст
            'textSecondary': '#666',   # вторичный текст
            'accent': '#FF0000',       # акцент
            'error': '#E63946',        # ошибки
            'success': '#06D6A0',      # успех
        },
        'logo_url': 'YOUR_LOGO_URL',
        'copy': {
            'title': 'Мой Бренд',
            'subtitle': 'Слоган',
            'cta': 'Получить займ',
            'disclaimer': 'Дисклеймер...',
            'policy_title': 'Политика',
            'policy_text': 'Текст политики...',
        },
        'features': {
            'default_sort': 'rate',
            'show_filters': True,
            'show_disclaimer': True,
            'enable_messages': True,
        },
    },
}
```

### 3. Перезапустите backend

```bash
docker-compose restart backend
# или
python manage.py runserver
```

### 4. Откройте в браузере

http://localhost:5173/#/?brand=mybrand

---

## 🔧 Частые проблемы

### CORS ошибки

Убедитесь, что `VITE_API_BASE` указывает на правильный URL бэкенда.

**В .env:**
```
VITE_API_BASE=http://localhost:8000
```

### Frontend не подключается к Backend

1. Проверьте, что backend запущен: http://localhost:8000/api/config/
2. Проверьте CORS в `backend/config/settings.py`
3. Убедитесь, что оба сервиса запущены

### Docker build ошибки

```bash
# Очистка и пересборка
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

---

## 📚 Следующие шаги

1. **Изучите документацию:**
   - [README.md](README.md) - общий обзор
   - [ARCHITECTURE.md](ARCHITECTURE.md) - архитектура
   - [DEVELOPMENT.md](DEVELOPMENT.md) - разработка
   - [EXAMPLES.md](EXAMPLES.md) - примеры

2. **Настройте VK приложение:**
   - Создайте VK Mini App
   - Добавьте URL фронтенда
   - Настройте trusted domains

3. **Кастомизируйте проект:**
   - Добавьте свои бренды
   - Настройте офферы
   - Интегрируйте с партнёрскими API

4. **Подготовьте к продакшену:**
   - Настройте PostgreSQL
   - Добавьте SSL
   - Настройте мониторинг
   - Добавьте аналитику

---

## 🆘 Помощь

Если что-то не работает:

1. Проверьте логи:
```bash
docker-compose logs -f
```

2. Проверьте переменные окружения в `.env`

3. Убедитесь, что все порты свободны (5173, 8000)

4. Попробуйте перезапустить:
```bash
docker-compose restart
```

---

**Готово! 🎉** 

Теперь у вас есть рабочий white-label VK Mini App для агрегатора микрозаймов.

Переходите к настройке своих брендов и офферов!

