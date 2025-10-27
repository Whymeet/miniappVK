<!-- b1fcebc9-bca6-4fa7-81a9-74e2c89658a5 0a133c2d-0613-4f7e-9b6a-7b61e41f4d95 -->
# План разделения фронтенда на десктоп и мобильную версии

## Архитектура

- **Десктоп**: https://kybyshka-dev.ru (корневой путь `/`)
- **Мобильные**: https://kybyshka-dev.ru/mob (путь `/mob`)
- **Backend API**: `/api/` (общий для обеих версий)

## Этап 1: Подготовка структуры проекта

### 1.1 Создать конфигурацию для платформ

Файл: `frontend/.env.desktop`

```env
VITE_API_BASE=https://kybyshka-dev.ru/api
VITE_PLATFORM=desktop
```

Файл: `frontend/.env.mobile`

```env
VITE_API_BASE=https://kybyshka-dev.ru/api
VITE_PLATFORM=mobile
```

### 1.2 Обновить frontend/src/api/config.ts

Добавить определение платформы:

```typescript
export const platform = import.meta.env.VITE_PLATFORM || 'desktop';
export const API_BASE = import.meta.env.VITE_API_BASE || 'https://kybyshka-dev.ru/api';
```

## Этап 2: Создать отдельные Dockerfile

### 2.1 Dockerfile для десктопа

Файл: `frontend/Dockerfile.desktop`

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE
ARG VITE_PLATFORM=desktop
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_PLATFORM=$VITE_PLATFORM
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2.2 Dockerfile для мобильных

Файл: `frontend/Dockerfile.mobile`

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_API_BASE
ARG VITE_PLATFORM=mobile
ENV VITE_API_BASE=$VITE_API_BASE
ENV VITE_PLATFORM=$VITE_PLATFORM
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Этап 3: Обновить docker-compose.prod.yml

Добавить оба фронтенд сервиса:

```yaml
services:
  # Десктопный фронтенд
  frontend-desktop:
    build:
      context: ./frontend
      dockerfile: Dockerfile.desktop
      args:
        - VITE_API_BASE=https://kybyshka-dev.ru/api
        - VITE_PLATFORM=desktop
    container_name: vk_miniapp_frontend_desktop
    volumes:
      - frontend_desktop_static:/usr/share/nginx/html
    restart: always
    networks:
      - vk_miniapp_network

  # Мобильный фронтенд
  frontend-mobile:
    build:
      context: ./frontend
      dockerfile: Dockerfile.mobile
      args:
        - VITE_API_BASE=https://kybyshka-dev.ru/api
        - VITE_PLATFORM=mobile
    container_name: vk_miniapp_frontend_mobile
    volumes:
      - frontend_mobile_static:/usr/share/nginx/html
    restart: always
    networks:
      - vk_miniapp_network

volumes:
  frontend_desktop_static:
  frontend_mobile_static:
```

## Этап 4: Обновить Nginx конфигурацию

Файл: `nginx/prod.conf`

Добавить location блоки для обеих версий:

```nginx
# Десктопная версия (корневой путь)
location / {
    root /var/www/frontend-desktop;
    index index.html;
    try_files $uri $uri/ /index.html;
    
    # Security для VK iframe
    add_header X-Frame-Options "ALLOW-FROM https://vk.com" always;
    add_header Content-Security-Policy "frame-ancestors https://vk.com https://*.vk.com https://*.vk.ru;" always;
}

# Cache для десктопной статики
location ~* ^/(?!mob).*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    root /var/www/frontend-desktop;
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Мобильная версия (путь /mob)
location /mob {
    alias /var/www/frontend-mobile;
    index index.html;
    try_files $uri $uri/index.html /mob/index.html =404;
    
    # Security для VK iframe
    add_header X-Frame-Options "ALLOW-FROM https://vk.com" always;
    add_header Content-Security-Policy "frame-ancestors https://vk.com https://*.vk.com https://*.vk.ru;" always;
}

# Cache для мобильной статики
location ~* ^/mob/.*\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    alias /var/www/frontend-mobile;
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# API остается общим
location /api/ {
    proxy_pass http://backend:8000/;
    # ... существующие CORS настройки ...
}
```

Обновить volumes в nginx сервисе:

```yaml
volumes:
  - ./nginx/prod.conf:/etc/nginx/conf.d/default.conf
  - ./nginx/ssl:/etc/nginx/ssl
  - frontend_desktop_static:/var/www/frontend-desktop
  - frontend_mobile_static:/var/www/frontend-mobile
  - backend_static:/var/www/static
  - backend_media:/var/www/media
```

## Этап 5: Добавить платформо-зависимые стили

Файл: `frontend/src/index.css`

Добавить в конец файла:

```css
/* ===== ПЛАТФОРМО-ЗАВИСИМЫЕ СТИЛИ ===== */

/* Десктопные стили */
body[data-platform="desktop"] .segmented {
  display: grid !important;
  grid-template-columns: repeat(3, 1fr) !important;
  gap: 4px !important;
  background: #F3F4F6 !important;
  border-radius: var(--radius-pill) !important;
  padding: 4px !important;
}

body[data-platform="desktop"] .grid-offers {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)) !important;
}

/* Мобильные стили */
body[data-platform="mobile"] .segmented {
  display: flex !important;
  flex-direction: column !important;
  gap: var(--space-sm) !important;
  background: transparent !important;
  padding: 0 !important;
}

body[data-platform="mobile"] .segmented .vkuiButton {
  width: 100% !important;
  height: 48px !important;
  border-radius: var(--radius-sm) !important;
  background: var(--surface) !important;
  border: 1px solid #E5E7EB !important;
}

body[data-platform="mobile"] .grid-offers {
  grid-template-columns: 1fr !important;
}
```

## Этап 6: Обновить App.tsx для определения платформы

Файл: `frontend/src/App.tsx`

Добавить в начале компонента:

```typescript
import { platform } from '@/api/config';

function App() {
  // Установить data-platform атрибут на body
  useEffect(() => {
    document.body.setAttribute('data-platform', platform);
  }, []);
  
  // ... остальной код ...
}
```

## Этап 7: Деплой на VPS

На VPS выполнить команды:

```bash
cd /srv/kybyshka-dev/miniappVK
git pull origin frontonvps
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
```

## Этап 8: Проверка работоспособности

1. **Десктоп**: https://kybyshka-dev.ru
2. **Мобильные**: https://kybyshka-dev.ru/mob
3. **API**: https://kybyshka-dev.ru/api/config/

Проверить логи:

```bash
docker compose -f docker-compose.prod.yml logs frontend-desktop
docker compose -f docker-compose.prod.yml logs frontend-mobile
```

## Этап 9: Обновить VK Mini Apps

В админке VK Mini Apps (https://vk.com/editapp?id=54267293):

- **Мобильное приложение**: `https://kybyshka-dev.ru/mob`
- **Десктопная версия**: `https://kybyshka-dev.ru`
- **Мобильная версия сайта**: `https://kybyshka-dev.ru/mob`

## Файлы для изменения

- `frontend/.env.desktop` - создать
- `frontend/.env.mobile` - создать
- `frontend/Dockerfile.desktop` - создать
- `frontend/Dockerfile.mobile` - создать
- `frontend/src/api/config.ts` - добавить platform
- `frontend/src/App.tsx` - добавить data-platform
- `frontend/src/index.css` - добавить платформо-зависимые стили
- `docker-compose.prod.yml` - добавить оба фронтенда
- `nginx/prod.conf` - добавить /mob location

### To-dos

- [ ] Добавить frontend сервис в docker-compose.prod.yml
- [ ] Обновить nginx/prod.conf для раздачи frontend статики
- [ ] Обновить CORS и CSRF настройки в production.env
- [ ] Обновить API endpoint в frontend/src/api/config.ts
- [ ] Деплой на VPS и проверка работоспособности