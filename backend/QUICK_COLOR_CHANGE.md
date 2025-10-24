# 🎨 Быстрая смена цветов админки

## ⚡ Самый простой способ

### Шаг 1: Откройте файл для редактирования

Файл: `backend/app/static/admin/css/color-config.css`

### Шаг 2: Найдите этот блок в начале файла:

```css
:root {
    /* 🎨 ГЛАВНЫЙ ЦВЕТ - используется для всех кнопок и заголовков */
    --main-color: #417690;
    
    /* 🎨 ТЕМНЕЕ НА 10% - для эффекта при наведении */
    --main-color-hover: #3a6a82;
    
    /* 🎨 ЦВЕТ ССЫЛОК */
    --link-color: #447e9b;
    
    /* 🎨 АКЦЕНТНЫЙ ЦВЕТ - для выделений */
    --accent-color: #79aec8;
}
```

### Шаг 3: Измените цвета на свои

Например, для оранжевой темы:

```css
:root {
    --main-color: #FF9800;
    --main-color-hover: #F57C00;
    --link-color: #FF9800;
    --accent-color: #FFB74D;
}
```

### Шаг 4: Сохраните файл

### Шаг 5: Перезапустите сервер

#### Если используете Docker:
```bash
docker-compose restart backend
# или
docker-compose -f docker-compose.dev.yml restart backend
```

#### Если используете локальный сервер:
```bash
# Остановите сервер (Ctrl+C) и запустите снова:
cd backend
python manage.py runserver
```

### Шаг 6: Обновите браузер

**ВАЖНО!** Используйте жесткое обновление:
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

Или очистите кэш браузера (Ctrl+Shift+Delete)

---

## 🎯 Готовые цветовые схемы

В том же файле `color-config.css` есть готовые схемы. Просто раскомментируйте нужную!

### Как раскомментировать?

Найдите нужную схему и уберите `/*` в начале и `*/` в конце:

**ДО:**
```css
/* ЗЕЛЕНАЯ СХЕМА */
/*
:root {
    --main-color: #4CAF50;
    --main-color-hover: #45a049;
    --link-color: #4CAF50;
    --accent-color: #81C784;
}
*/
```

**ПОСЛЕ:**
```css
/* ЗЕЛЕНАЯ СХЕМА */
:root {
    --main-color: #4CAF50;
    --main-color-hover: #45a049;
    --link-color: #4CAF50;
    --accent-color: #81C784;
}
```

---

## ❗ Если цвета всё равно не меняются

### Проблема 1: Кэш браузера
**Решение:** Нажмите `Ctrl+Shift+R` (Windows) или `Cmd+Shift+R` (Mac)

### Проблема 2: Сервер не перезапущен
**Решение:** Перезапустите Django сервер

### Проблема 3: CSS файл не найден
**Решение:** Проверьте, что файлы находятся здесь:
- `backend/app/static/admin/css/custom_admin.css`
- `backend/app/static/admin/css/color-config.css`
- `backend/app/templates/admin/base_site.html`

### Проблема 4: Режим production (DEBUG=False)
**Решение:** Выполните:
```bash
cd backend
python manage.py collectstatic --noinput
```

---

## 🔍 Как проверить, что CSS загружается

1. Откройте админку в браузере
2. Нажмите F12 (откроется DevTools)
3. Перейдите на вкладку **Network**
4. Обновите страницу (F5)
5. В списке файлов найдите `color-config.css`
6. Статус должен быть **200 OK**
7. Если статус **404** - файл не найден, проверьте путь

---

## 🎨 Рекомендуемые инструменты для подбора цветов

- **Coolors**: https://coolors.co/ (генератор палитр)
- **Color Hunt**: https://colorhunt.co/ (готовые палитры)
- **Material Colors**: https://materialui.co/colors/ (цвета Material Design)
- **Adobe Color**: https://color.adobe.com/ (продвинутый подбор)

### Как подобрать цвет hover?

Возьмите основной цвет и сделайте его темнее на 10-15%:
- Используйте онлайн калькулятор: https://pinetools.com/darken-color
- Или в Photoshop/GIMP уменьшите яркость (Brightness) на 10%

---

## 📝 Примеры для разных брендов

### Банк / Финансы
```css
:root {
    --main-color: #2C3E50;    /* Темно-синий */
    --main-color-hover: #1A252F;
    --link-color: #2C3E50;
    --accent-color: #3498DB;
}
```

### Природа / Экология
```css
:root {
    --main-color: #27AE60;    /* Зеленый */
    --main-color-hover: #229954;
    --link-color: #27AE60;
    --accent-color: #82E0AA;
}
```

### Технологии / IT
```css
:root {
    --main-color: #3498DB;    /* Синий */
    --main-color-hover: #2E86C1;
    --link-color: #3498DB;
    --accent-color: #85C1E9;
}
```

### Красота / Мода
```css
:root {
    --main-color: #E91E63;    /* Розовый */
    --main-color-hover: #C2185B;
    --link-color: #E91E63;
    --accent-color: #F8BBD0;
}
```

### Еда / Рестораны
```css
:root {
    --main-color: #E67E22;    /* Оранжевый */
    --main-color-hover: #D35400;
    --link-color: #E67E22;
    --accent-color: #F39C12;
}
```

---

## 💡 Совет

Сохраните резервную копию оригинальных цветов в комментарии:

```css
/* Оригинальные цвета (резерв)
:root {
    --main-color: #417690;
    --main-color-hover: #3a6a82;
    --link-color: #447e9b;
    --accent-color: #79aec8;
}
*/

/* Мои новые цвета */
:root {
    --main-color: #FF9800;
    --main-color-hover: #F57C00;
    --link-color: #FF9800;
    --accent-color: #FFB74D;
}
```

