"""
Конфигурация брендов для white-label системы.
В продакшене может храниться в БД или отдельном сервисе.
"""

BRAND_CONFIGS = {
    'kokos': {
        'name': 'Кубышка Займ',
        'palette': {
            'primary': '#FF6B35',
            'secondary': '#FFB800',
            'background': '#FFFFFF',
            'surface': '#F5F5F5',
            'text': '#000000',
            'textSecondary': '#666666',
            'accent': '#FF6B35',
            'error': '#E63946',
            'success': '#06D6A0',
        },
        'logo_url': 'https://via.placeholder.com/200x60/FF6B35/FFFFFF?text=Кубышка+Займ',
        'copy': {
            'title': 'Кубышка Займ',
            'subtitle': 'Быстрые займы онлайн',
            'cta': 'Получить деньги',
            'disclaimer': 'Сервис не является кредитором. Мы помогаем подобрать выгодное предложение.',
            'policy_title': 'Политика конфиденциальности',
            'policy_text': 'Мы заботимся о безопасности ваших данных...',
        },
        'features': {
            'default_sort': 'rate',  # rate | term | sum
            'show_filters': True,
            'show_disclaimer': True,
            'enable_messages': True,
        },
    },
    'kubyshka': {
        'name': 'Кубышка Займ',
        'palette': {
            'primary': '#4A90E2',
            'secondary': '#50C878',
            'background': '#FFFFFF',
            'surface': '#F8F9FA',
            'text': '#212529',
            'textSecondary': '#6C757D',
            'accent': '#4A90E2',
            'error': '#DC3545',
            'success': '#28A745',
        },
        'logo_url': 'https://via.placeholder.com/200x60/4A90E2/FFFFFF?text=Кубышка+Займ',
        'copy': {
            'title': 'Кубышка Займ',
            'subtitle': 'Надёжные микрозаймы',
            'cta': 'Оформить займ',
            'disclaimer': 'Информация носит справочный характер. Условия уточняйте у кредитора.',
            'policy_title': 'Политика конфиденциальности',
            'policy_text': 'Ваши данные под надёжной защитой...',
        },
        'features': {
            'default_sort': 'sum',
            'show_filters': True,
            'show_disclaimer': True,
            'enable_messages': True,
        },
    },
}

# Маппинг VK Group ID -> Brand
GROUP_TO_BRAND = {
    '123456789': 'kokos',
    '987654321': 'kubyshka',
    # Добавьте свои group_id здесь
}


def get_brand_config(group_id=None, brand=None, default_brand='kokos'):
    """
    Получить конфигурацию бренда.
    
    Приоритет:
    1. brand параметр (для предпросмотра)
    2. group_id маппинг
    3. default_brand
    
    Сначала пытается загрузить из БД, затем из BRAND_CONFIGS
    """
    # Определяем какой бренд нужен
    brand_key = None
    if brand and brand in BRAND_CONFIGS:
        brand_key = brand
    elif group_id and group_id in GROUP_TO_BRAND:
        brand_key = GROUP_TO_BRAND[group_id]
    else:
        brand_key = default_brand if default_brand in BRAND_CONFIGS else 'kokos'
    
    # Пытаемся загрузить из БД
    try:
        from .models import BrandConfig
        db_config = BrandConfig.objects.filter(brand_key=brand_key, is_active=True).first()
        if db_config:
            return db_config.to_dict()
    except Exception:
        # Если БД недоступна или модель не мигрирована, используем fallback
        pass
    
    # Fallback на статическую конфигурацию
    return {'brand': brand_key, **BRAND_CONFIGS[brand_key]}

