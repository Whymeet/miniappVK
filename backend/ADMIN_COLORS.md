# Настройка цветов админки Django

## 📍 Расположение файлов

- **CSS стили**: `backend/app/static/admin/css/custom_admin.css`
- **Шаблон**: `backend/app/templates/admin/base_site.html`

## 🎨 Основные переменные цветов

В начале файла `custom_admin.css` находятся CSS-переменные, которые можно легко изменить:

```css
:root {
    --primary-color: #417690;      /* Основной цвет кнопок */
    --secondary-color: #447e9b;    /* Цвет при наведении */
    --accent-color: #79aec8;       /* Акцентный цвет */
    --link-color: #447e9b;         /* Цвет ссылок */
    --link-hover-color: #036;      /* Цвет ссылок при наведении */
}
```

## 🔧 Как изменить цвета

### Вариант 1: Быстрая настройка (только основные цвета)

Измените значения в блоке `:root` в файле `custom_admin.css`:

```css
:root {
    --primary-color: #FF6B35;      /* Оранжевый - ваш цвет */
    --secondary-color: #E55A2B;    /* Темнее на 10% для hover */
    --accent-color: #79aec8;       
    --link-color: #FF6B35;         /* Тот же что primary */
    --link-hover-color: #E55A2B;   
}
```

### Вариант 2: Детальная настройка (все элементы)

Если нужно изменить конкретные элементы, найдите нужный селектор в CSS:

#### Кнопка "Сохранить"
```css
.submit-row input[type="submit"] {
    background: #YOUR_COLOR !important;
}
```

#### Шапка админки
```css
#header {
    background: #YOUR_COLOR !important;
}
```

#### Кнопка "Добавить еще"
```css
.add-row a {
    background: #YOUR_COLOR !important;
}
```

## 🚀 Применение изменений

### Для Development (режим DEBUG=True)

1. Отредактируйте файл `backend/app/static/admin/css/custom_admin.css`
2. Перезапустите Django сервер:
   ```bash
   # Если используете Docker
   docker-compose restart backend
   
   # Если используете локальный сервер
   python manage.py runserver
   ```
3. **Очистите кэш браузера** (Ctrl+Shift+R или Cmd+Shift+R)

### Для Production (режим DEBUG=False)

1. Отредактируйте файл `backend/app/static/admin/css/custom_admin.css`
2. Соберите статические файлы:
   ```bash
   python manage.py collectstatic --noinput
   ```
3. Перезапустите сервер
4. Очистите кэш браузера

## 🎯 Примеры цветовых схем

### Зеленая схема (Экология)
```css
:root {
    --primary-color: #4CAF50;
    --secondary-color: #45a049;
    --accent-color: #81C784;
    --link-color: #4CAF50;
    --link-hover-color: #2E7D32;
}
```

### Синяя схема (Корпоративная)
```css
:root {
    --primary-color: #2196F3;
    --secondary-color: #1976D2;
    --accent-color: #64B5F6;
    --link-color: #2196F3;
    --link-hover-color: #0D47A1;
}
```

### Фиолетовая схема (Креативная)
```css
:root {
    --primary-color: #9C27B0;
    --secondary-color: #7B1FA2;
    --accent-color: #BA68C8;
    --link-color: #9C27B0;
    --link-hover-color: #4A148C;
}
```

### Оранжевая схема (Энергичная)
```css
:root {
    --primary-color: #FF9800;
    --secondary-color: #F57C00;
    --accent-color: #FFB74D;
    --link-color: #FF9800;
    --link-hover-color: #E65100;
}
```

## ❗ Важно

1. **Всегда используйте `!important`** для переопределения встроенных стилей Django
2. **Очищайте кэш браузера** после изменений (это самая частая причина, почему цвета не меняются!)
3. **Проверяйте консоль браузера** (F12 → Console) на наличие ошибок загрузки CSS
4. **Проверяйте, загружается ли CSS**: откройте DevTools → Network → отфильтруйте CSS → обновите страницу

## 🐛 Устранение проблем

### Цвета не меняются

1. **Очистите кэш браузера**: Ctrl+Shift+Delete → Очистить кэш
2. **Жесткое обновление**: Ctrl+Shift+R (Windows) или Cmd+Shift+R (Mac)
3. **Проверьте загрузку CSS**: 
   - Откройте DevTools (F12)
   - Вкладка Network
   - Обновите страницу
   - Найдите `custom_admin.css`
   - Убедитесь, что статус 200 OK
4. **Проверьте путь к файлу**: убедитесь, что файл находится в `backend/app/static/admin/css/custom_admin.css`
5. **Перезапустите сервер Django**

### CSS файл не загружается (404)

1. Убедитесь, что `django.contrib.staticfiles` в `INSTALLED_APPS`
2. Проверьте `STATIC_URL` в settings.py
3. Проверьте, что файл `base_site.html` находится в `backend/app/templates/admin/`
4. Если DEBUG=False, выполните `python manage.py collectstatic`

### Изменения видны только после Ctrl+F5

Это нормально! Браузер кэширует CSS файлы. Всегда делайте жесткое обновление после изменения стилей.

## 🔍 Проверка применения стилей

Откройте админку в браузере и:

1. Нажмите F12 (DevTools)
2. Вкладка Elements
3. Найдите любую кнопку (например, "Сохранить")
4. Посмотрите на computed styles справа
5. Должен быть применен ваш цвет из `custom_admin.css`
6. Если видите стили из `base.css` или `forms.css`, значит ваш CSS не загрузился или нужно добавить `!important`

## 📝 Дополнительные настройки

### Изменение цветов полей ввода
```css
input[type="text"],
input[type="number"],
textarea,
select {
    border: 1px solid #YOUR_COLOR !important;
}

input[type="text"]:focus,
input[type="number"]:focus,
textarea:focus,
select:focus {
    border-color: #YOUR_FOCUS_COLOR !important;
    box-shadow: 0 0 5px rgba(YOUR_RGB, 0.5) !important;
}
```

### Изменение цвета заголовков таблиц
```css
.module h2,
.module caption {
    background: #YOUR_COLOR !important;
    color: white !important;
}
```

### Изменение цвета активных элементов
```css
.selected,
.selected a {
    background: #YOUR_COLOR !important;
    color: white !important;
}
```

## 💡 Советы

1. **Используйте инструменты разработчика** (F12) для экспериментов с цветами в реальном времени
2. **Сохраняйте контрастность** для читаемости текста
3. **Тестируйте на разных экранах** (светлый/темный режим монитора)
4. **Используйте онлайн-инструменты** для подбора цветов:
   - https://coolors.co/
   - https://colorhunt.co/
   - https://materialui.co/colors/

## 📚 Структура файлов

```
backend/
├── app/
│   ├── static/
│   │   └── admin/
│   │       └── css/
│   │           └── custom_admin.css  ← Стили здесь
│   └── templates/
│       └── admin/
│           └── base_site.html         ← Подключение CSS здесь
└── config/
    └── settings.py                     ← Настройки Django
```

