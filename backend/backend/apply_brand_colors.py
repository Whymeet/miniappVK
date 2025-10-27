"""
Скрипт для применения брендовых цветов к приложению
"""
import os
import sys
import django
import json

# Настройка Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from app.models import AppConfig


def apply_brand_colors():
    """Применить брендовые цвета из JSON файла"""
    
    # Читаем конфигурацию
    config_path = os.path.join(os.path.dirname(__file__), 'brand_colors_config.json')
    
    with open(config_path, 'r', encoding='utf-8') as f:
        config_data = json.load(f)
    
    # Получаем или создаем конфигурацию
    app_config = AppConfig.get_or_create_config()
    
    # Применяем настройки
    app_config.app_name = config_data['app_name']
    app_config.logo_url = config_data['logo_url']
    
    # Цвета
    colors = config_data['colors']
    app_config.color_primary = colors['primary']
    app_config.color_secondary = colors['secondary']
    app_config.color_background = colors['background']
    app_config.color_surface = colors['surface']
    app_config.color_text = colors['text']
    app_config.color_text_secondary = colors['text_secondary']
    app_config.color_accent = colors['accent']
    app_config.color_error = colors['error']
    app_config.color_success = colors['success']
    
    # Тексты
    texts = config_data['texts']
    app_config.subtitle = texts['subtitle']
    app_config.cta_text = texts['cta_text']
    app_config.disclaimer = texts['disclaimer']
    
    # Настройки
    settings = config_data['settings']
    app_config.default_sort = settings['default_sort']
    app_config.show_filters = settings['show_filters']
    app_config.show_disclaimer = settings['show_disclaimer']
    app_config.enable_messages = settings['enable_messages']
    
    # Цвета кнопок сортировки
    if 'sort_buttons' in config_data:
        sort_buttons = config_data['sort_buttons']
        app_config.sort_button_rate_color = sort_buttons.get('rate_color', '#ac6d3a')
        app_config.sort_button_sum_color = sort_buttons.get('sum_color', '#d4a574')
        app_config.sort_button_term_color = sort_buttons.get('term_color', '#8d5628')
    
    app_config.save()
    
    print("✅ Брендовые цвета успешно применены!")
    print("\n📋 Примененные цвета:")
    print(f"  🎨 Основной цвет (кнопки): {colors['primary']}")
    print(f"  🎨 Вторичный цвет: {colors['secondary']}")
    print(f"  🎨 Фон приложения: {colors['background']}")
    print(f"  🎨 Фон карточек: {colors['surface']}")
    print(f"  🎨 Цвет текста: {colors['text']}")
    print(f"  🎨 Вторичный текст: {colors['text_secondary']}")
    print(f"  🎨 Акцентный цвет: {colors['accent']}")
    print(f"  🎨 Цвет ошибки: {colors['error']}")
    print(f"  🎨 Цвет успеха: {colors['success']}")
    
    if 'sort_buttons' in config_data:
        sort_buttons = config_data['sort_buttons']
        print("\n🔘 Цвета кнопок сортировки:")
        print(f"  📊 По ставке: {sort_buttons.get('rate_color', '#ac6d3a')}")
        print(f"  💰 По сумме: {sort_buttons.get('sum_color', '#d4a574')}")
        print(f"  📅 По сроку: {sort_buttons.get('term_color', '#8d5628')}")
    
    print("\n🌐 Обновите страницу фронтенда чтобы увидеть изменения!")


if __name__ == '__main__':
    print("🎨 Применение брендовых цветов...")
    apply_brand_colors()

