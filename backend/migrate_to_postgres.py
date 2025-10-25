import os
import sys
import json
import django
from django.core.management import call_command

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

def dump_data():
    """Выгрузка данных из SQLite"""
    print("Выгружаем данные из SQLite...")
    
    # Создаем папку для дампа если её нет
    os.makedirs('data_dump', exist_ok=True)
    
    # Выгружаем данные по отдельности для каждого приложения
    apps_models = [
        ('app', 'offer'),
        ('app', 'clicklog'),
        ('app', 'brandconfig'),
        ('app', 'appconfig'),
        ('admin', 'logentry'),
        ('auth', 'user'),
        ('auth', 'group'),
        ('auth', 'permission'),
    ]
    
    for app, model in apps_models:
        output_file = f'data_dump/{app}_{model}.json'
        print(f"Выгружаем {app}.{model}...")
        
        try:
            with open(output_file, 'w', encoding='utf-8') as f:
                call_command('dumpdata', f'{app}.{model}', indent=2, stdout=f)
            print(f"Успешно выгружено в {output_file}")
        except Exception as e:
            print(f"Ошибка при выгрузке {app}.{model}: {e}")
            continue

def load_data():
    """Загрузка данных в PostgreSQL"""
    print("\nЗагружаем данные в PostgreSQL...")
    
    # Применяем миграции к новой БД
    print("Применяем миграции...")
    call_command('migrate')
    
    # Загружаем данные в правильном порядке
    load_order = [
        'auth_permission.json',
        'auth_group.json',
        'auth_user.json',
        'admin_logentry.json',
        'app_brandconfig.json',
        'app_appconfig.json',
        'app_offer.json',
        'app_clicklog.json',
    ]
    
    for filename in load_order:
        filepath = f'data_dump/{filename}'
        if os.path.exists(filepath):
            print(f"Загружаем {filename}...")
            try:
                call_command('loaddata', filepath)
                print(f"Успешно загружено {filename}")
            except Exception as e:
                print(f"Ошибка при загрузке {filename}: {e}")
                continue
        else:
            print(f"Файл {filename} не найден")

if __name__ == '__main__':
    # Проверяем, что мы используем PostgreSQL
    from django.conf import settings
    if 'postgresql' not in settings.DATABASES['default']['ENGINE']:
        print("ОШИБКА: Настройте подключение к PostgreSQL в settings.py перед запуском скрипта")
        sys.exit(1)
    
    # Спрашиваем подтверждение
    response = input("Это скрипт миграции данных из SQLite в PostgreSQL. Продолжить? (y/n): ")
    if response.lower() != 'y':
        print("Миграция отменена")
        sys.exit(0)
    
    dump_data()
    load_data()
    print("\nМиграция данных завершена!")