"""
Скрипт для загрузки конфигураций брендов из brands.py в БД
"""
import os
import sys
import django

# Настройка Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from app.models import BrandConfig
from app.brands import BRAND_CONFIGS


def load_brand_configs():
    """Загрузить конфигурации брендов в БД"""
    for brand_key, config in BRAND_CONFIGS.items():
        brand_config, created = BrandConfig.objects.update_or_create(
            brand_key=brand_key,
            defaults={
                'name': config['name'],
                'logo_url': config['logo_url'],
                'color_primary': config['palette']['primary'],
                'color_secondary': config['palette']['secondary'],
                'color_background': config['palette']['background'],
                'color_surface': config['palette']['surface'],
                'color_text': config['palette']['text'],
                'color_text_secondary': config['palette']['textSecondary'],
                'color_accent': config['palette']['accent'],
                'color_error': config['palette']['error'],
                'color_success': config['palette']['success'],
                'subtitle': config['copy']['subtitle'],
                'cta_text': config['copy']['cta'],
                'disclaimer': config['copy']['disclaimer'],
                'default_sort': config['features']['default_sort'],
                'show_filters': config['features']['show_filters'],
                'show_disclaimer': config['features']['show_disclaimer'],
                'enable_messages': config['features']['enable_messages'],
                'is_active': True,
            }
        )
        
        action = "Создан" if created else "Обновлён"
        print(f"{action} бренд: {brand_config.name} ({brand_config.brand_key})")


if __name__ == '__main__':
    print("Загрузка конфигураций брендов в БД...")
    load_brand_configs()
    print("Готово!")

