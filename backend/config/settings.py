"""
Django settings for VK Mini App White-Label project.
"""
from __future__ import annotations

import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent


def get_env_bool(var_name: str, default: bool = False) -> bool:
    value = os.getenv(var_name)
    if value is None:
        return default
    return value.strip().lower() in {'1', 'true', 'yes', 'on'}


def get_env_list(var_name: str, default: str | None = None) -> list[str]:
    if default is None:
        value = os.getenv(var_name)
    else:
        value = os.getenv(var_name, default)
    if not value:
        return []
    return [item.strip() for item in value.split(',') if item.strip()]


SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'django-insecure-dev-key-change-in-production')

DEBUG = get_env_bool('DJANGO_DEBUG', True)

ALLOWED_HOSTS = get_env_list('ALLOWED_HOSTS', 'localhost,127.0.0.1')

CSRF_TRUSTED_ORIGINS = get_env_list(
    'CSRF_TRUSTED_ORIGINS',
    'http://localhost:5173,https://localhost:5173',
)

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    # 'corsheaders.middleware.CorsMiddleware',  # Отключено: CORS обрабатывается nginx
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'config.middleware.ContentSecurityPolicyMiddleware',
    'config.vk_middleware.VKSignatureMiddleware',  # VK signature verification
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'vkminiapp'),
        'USER': os.getenv('POSTGRES_USER', 'vkuser'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', ''),
        'HOST': os.getenv('POSTGRES_HOST', 'db'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'ru-ru'
TIME_ZONE = 'Europe/Moscow'
USE_I18N = True
USE_TZ = True

# Static files
# STATIC_URL должен быть абсолютным (начинаться с "/"),
# иначе ссылки на статику в шаблонах будут относительными
# и браузер будет запрашивать их как /admin/static/... вместо /static/...
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings для VK Mini App
CORS_ALLOW_ALL_ORIGINS = get_env_bool('CORS_ALLOW_ALL_ORIGINS', False)
CORS_ALLOWED_ORIGINS = get_env_list(
    'CORS_ALLOWED_ORIGINS',
    'http://localhost:5173,https://localhost:5173',
)
CORS_ALLOWED_ORIGIN_REGEXES = get_env_list('CORS_ALLOWED_ORIGIN_REGEXES')
CORS_ALLOW_CREDENTIALS = get_env_bool('CORS_ALLOW_CREDENTIALS', True)

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}

# VK App settings
VK_APP_SECRET = os.getenv('VK_APP_SECRET', '')
VK_GROUP_ACCESS_TOKEN = os.getenv('VK_GROUP_ACCESS_TOKEN', '')
VK_CALLBACK_SECRET = os.getenv('VK_CALLBACK_SECRET', '')
VK_CONFIRMATION_CODE = os.getenv('VK_CONFIRMATION_CODE', '')
DEFAULT_BRAND = os.getenv('DEFAULT_BRAND', 'kokos')

# Security headers
SECURE_HSTS_SECONDS = int(os.getenv('SECURE_HSTS_SECONDS', '0'))
SECURE_SSL_REDIRECT = get_env_bool('SECURE_SSL_REDIRECT', False)
SESSION_COOKIE_SECURE = get_env_bool('SESSION_COOKIE_SECURE', False)
CSRF_COOKIE_SECURE = get_env_bool('CSRF_COOKIE_SECURE', False)

CSP_FRAME_ANCESTORS = get_env_list('CSP_FRAME_ANCESTORS', 'https://vk.com')

