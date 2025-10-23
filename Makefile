# Makefile для упрощения команд разработки

.PHONY: help install dev build up down logs clean migrate backend-shell frontend-shell

help:
	@echo "Доступные команды:"
	@echo "  make install       - Установка зависимостей"
	@echo "  make dev           - Запуск в dev режиме"
	@echo "  make build         - Сборка Docker контейнеров"
	@echo "  make up            - Запуск production режима"
	@echo "  make down          - Остановка контейнеров"
	@echo "  make logs          - Просмотр логов"
	@echo "  make clean         - Очистка контейнеров и volumes"
	@echo "  make migrate       - Применить миграции Django"
	@echo "  make backend-shell - Войти в backend контейнер"
	@echo "  make frontend-shell - Войти в frontend контейнер"

install:
	@echo "Установка backend зависимостей..."
	cd backend && python -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	@echo "Установка frontend зависимостей..."
	cd frontend && npm install
	@echo "Готово!"

dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

migrate:
	docker-compose exec backend python manage.py migrate

makemigrations:
	docker-compose exec backend python manage.py makemigrations

backend-shell:
	docker-compose exec backend sh

frontend-shell:
	docker-compose exec frontend sh

createsuperuser:
	docker-compose exec backend python manage.py createsuperuser

