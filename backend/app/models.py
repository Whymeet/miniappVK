from django.db import models
from django.utils import timezone
import json


class AppConfig(models.Model):
    """Единая конфигурация внешнего вида приложения"""
    # Основная информация
    app_name = models.CharField(max_length=200, default='Займы Онлайн', verbose_name='Название приложения')
    logo_url = models.URLField(max_length=500, verbose_name='URL логотипа')
    
    # Цветовая палитра
    color_primary = models.CharField(max_length=7, default='#FF6B35', verbose_name='Основной цвет (кнопки)',
                                      help_text='Hex формат: #FF6B35')
    color_secondary = models.CharField(max_length=7, default='#FFB800', verbose_name='Вторичный цвет')
    color_background = models.CharField(max_length=7, default='#FFFFFF', verbose_name='Цвет фона')
    color_surface = models.CharField(max_length=7, default='#F5F5F5', verbose_name='Цвет поверхности (карточки)')
    color_text = models.CharField(max_length=7, default='#000000', verbose_name='Цвет текста')
    color_text_secondary = models.CharField(max_length=7, default='#666666', verbose_name='Цвет вторичного текста')
    color_accent = models.CharField(max_length=7, default='#FF6B35', verbose_name='Акцентный цвет')
    color_error = models.CharField(max_length=7, default='#E63946', verbose_name='Цвет ошибки')
    color_success = models.CharField(max_length=7, default='#06D6A0', verbose_name='Цвет успеха')
    
    # Тексты
    subtitle = models.CharField(max_length=200, default='Быстрые займы онлайн', verbose_name='Подзаголовок')
    cta_text = models.CharField(max_length=100, default='Получить деньги', verbose_name='Текст кнопки')
    disclaimer = models.TextField(default='Сервис не является кредитором. Мы помогаем подобрать выгодное предложение.', 
                                   verbose_name='Дисклеймер')
    
    # Настройки
    default_sort = models.CharField(max_length=10, default='rate', verbose_name='Сортировка по умолчанию',
                                     choices=[
                                         ('rate', 'По ставке'),
                                         ('sum', 'По сумме'),
                                         ('term', 'По сроку'),
                                     ])
    show_filters = models.BooleanField(default=True, verbose_name='Показывать фильтры')
    show_disclaimer = models.BooleanField(default=True, verbose_name='Показывать дисклеймер')
    enable_messages = models.BooleanField(default=True, verbose_name='Включить уведомления')
    
    # Цвета кнопок сортировки
    sort_button_rate_color = models.CharField(max_length=7, default='#ac6d3a', verbose_name='Цвет кнопки "По ставке"')
    sort_button_sum_color = models.CharField(max_length=7, default='#d4a574', verbose_name='Цвет кнопки "По сумме"')
    sort_button_term_color = models.CharField(max_length=7, default='#8d5628', verbose_name='Цвет кнопки "По сроку"')
    
    # Градиент для карточек офферов
    card_gradient_start = models.CharField(max_length=7, default='#FFFFFF', verbose_name='Градиент карточек: начало')
    card_gradient_end = models.CharField(max_length=7, default='#F9FAFB', verbose_name='Градиент карточек: конец')
    card_gradient_enabled = models.BooleanField(default=False, verbose_name='Включить градиент карточек')
    
    # Кнопка "МЫ В ВК"
    vk_group_url = models.URLField(max_length=500, blank=True, verbose_name='Ссылка на группу ВК',
                                    help_text='Например: https://vk.com/kubyshkazaim')
    vk_button_color = models.CharField(max_length=7, default='#0077FF', verbose_name='Цвет кнопки "МЫ В ВК"')
    
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлён')
    
    class Meta:
        db_table = 'app_config'
        verbose_name = 'Настройки внешнего вида'
        verbose_name_plural = 'Настройки внешнего вида'
    
    def __str__(self):
        return f"Настройки приложения (обновлено: {self.updated_at.strftime('%d.%m.%Y %H:%M')})"
    
    def to_dict(self):
        """Преобразовать в словарь для API"""
        return {
            'brand': 'default',  # для совместимости с фронтендом
            'name': self.app_name,
            'logo_url': self.logo_url,
            'palette': {
                'primary': self.color_primary,
                'secondary': self.color_secondary,
                'background': self.color_background,
                'surface': self.color_surface,
                'text': self.color_text,
                'textSecondary': self.color_text_secondary,
                'accent': self.color_accent,
                'error': self.color_error,
                'success': self.color_success,
            },
            'copy': {
                'title': self.app_name,
                'subtitle': self.subtitle,
                'cta': self.cta_text,
                'disclaimer': self.disclaimer,
                'policy_title': 'Политика конфиденциальности',
                'policy_text': 'Мы заботимся о безопасности ваших данных...',
            },
            'features': {
                'default_sort': self.default_sort,
                'show_filters': self.show_filters,
                'show_disclaimer': self.show_disclaimer,
                'enable_messages': self.enable_messages,
            },
            'sort_buttons': {
                'rate_color': self.sort_button_rate_color,
                'sum_color': self.sort_button_sum_color,
                'term_color': self.sort_button_term_color,
            },
            'card_gradient': {
                'enabled': self.card_gradient_enabled,
                'start': self.card_gradient_start,
                'end': self.card_gradient_end,
            },
            'vk_button': {
                'group_url': self.vk_group_url,
                'button_color': self.vk_button_color,
            }
        }
    
    def export_to_json(self):
        """Экспорт настроек в JSON"""
        return json.dumps({
            'app_name': self.app_name,
            'logo_url': self.logo_url,
            'colors': {
                'primary': self.color_primary,
                'secondary': self.color_secondary,
                'background': self.color_background,
                'surface': self.color_surface,
                'text': self.color_text,
                'text_secondary': self.color_text_secondary,
                'accent': self.color_accent,
                'error': self.color_error,
                'success': self.color_success,
            },
            'texts': {
                'subtitle': self.subtitle,
                'cta_text': self.cta_text,
                'disclaimer': self.disclaimer,
            },
            'settings': {
                'default_sort': self.default_sort,
                'show_filters': self.show_filters,
                'show_disclaimer': self.show_disclaimer,
                'enable_messages': self.enable_messages,
            }
        }, indent=2, ensure_ascii=False)
    
    @classmethod
    def import_from_json(cls, json_data):
        """Импорт настроек из JSON"""
        data = json.loads(json_data) if isinstance(json_data, str) else json_data
        
        config = cls.get_or_create_config()
        config.app_name = data.get('app_name', config.app_name)
        config.logo_url = data.get('logo_url', config.logo_url)
        
        colors = data.get('colors', {})
        config.color_primary = colors.get('primary', config.color_primary)
        config.color_secondary = colors.get('secondary', config.color_secondary)
        config.color_background = colors.get('background', config.color_background)
        config.color_surface = colors.get('surface', config.color_surface)
        config.color_text = colors.get('text', config.color_text)
        config.color_text_secondary = colors.get('text_secondary', config.color_text_secondary)
        config.color_accent = colors.get('accent', config.color_accent)
        config.color_error = colors.get('error', config.color_error)
        config.color_success = colors.get('success', config.color_success)
        
        texts = data.get('texts', {})
        config.subtitle = texts.get('subtitle', config.subtitle)
        config.cta_text = texts.get('cta_text', config.cta_text)
        config.disclaimer = texts.get('disclaimer', config.disclaimer)
        
        settings = data.get('settings', {})
        config.default_sort = settings.get('default_sort', config.default_sort)
        config.show_filters = settings.get('show_filters', config.show_filters)
        config.show_disclaimer = settings.get('show_disclaimer', config.show_disclaimer)
        config.enable_messages = settings.get('enable_messages', config.enable_messages)
        
        config.save()
        return config
    
    @classmethod
    def get_or_create_config(cls):
        """Получить или создать единственную конфигурацию"""
        config = cls.objects.first()
        if not config:
            config = cls.objects.create(
                app_name='Займы Онлайн',
                logo_url='https://via.placeholder.com/200x60/FF6B35/FFFFFF?text=Займы+Онлайн'
            )
        return config


class BrandConfig(models.Model):
    """Конфигурация бренда для white-label"""
    # Основная информация
    brand_key = models.CharField(max_length=50, unique=True, verbose_name='Ключ бренда',
                                   help_text='Например: kokos, kubyshka')
    name = models.CharField(max_length=200, verbose_name='Название бренда')
    logo_url = models.URLField(max_length=500, verbose_name='URL логотипа')
    
    # Цветовая палитра
    color_primary = models.CharField(max_length=7, default='#FF6B35', verbose_name='Основной цвет',
                                      help_text='Hex формат: #FF6B35')
    color_secondary = models.CharField(max_length=7, default='#FFB800', verbose_name='Вторичный цвет')
    color_background = models.CharField(max_length=7, default='#FFFFFF', verbose_name='Цвет фона')
    color_surface = models.CharField(max_length=7, default='#F5F5F5', verbose_name='Цвет поверхности')
    color_text = models.CharField(max_length=7, default='#000000', verbose_name='Цвет текста')
    color_text_secondary = models.CharField(max_length=7, default='#666666', verbose_name='Цвет вторичного текста')
    color_accent = models.CharField(max_length=7, default='#FF6B35', verbose_name='Акцентный цвет')
    color_error = models.CharField(max_length=7, default='#E63946', verbose_name='Цвет ошибки')
    color_success = models.CharField(max_length=7, default='#06D6A0', verbose_name='Цвет успеха')
    
    # Тексты
    subtitle = models.CharField(max_length=200, default='Быстрые займы онлайн', verbose_name='Подзаголовок')
    cta_text = models.CharField(max_length=100, default='Получить деньги', verbose_name='Текст кнопки CTA')
    disclaimer = models.TextField(default='Сервис не является кредитором.', verbose_name='Дисклеймер')
    
    # Настройки
    default_sort = models.CharField(max_length=10, default='rate', verbose_name='Сортировка по умолчанию',
                                     choices=[
                                         ('rate', 'По ставке'),
                                         ('sum', 'По сумме'),
                                         ('term', 'По сроку'),
                                     ])
    show_filters = models.BooleanField(default=True, verbose_name='Показывать фильтры')
    show_disclaimer = models.BooleanField(default=True, verbose_name='Показывать дисклеймер')
    enable_messages = models.BooleanField(default=True, verbose_name='Включить уведомления')
    
    is_active = models.BooleanField(default=True, verbose_name='Активен')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлён')
    
    class Meta:
        db_table = 'brand_configs'
        ordering = ['brand_key']
        verbose_name = 'Конфигурация бренда'
        verbose_name_plural = 'Конфигурации брендов'
    
    def __str__(self):
        return f"{self.name} ({self.brand_key})"
    
    def to_dict(self):
        """Преобразовать в словарь для API"""
        return {
            'brand': self.brand_key,
            'name': self.name,
            'logo_url': self.logo_url,
            'palette': {
                'primary': self.color_primary,
                'secondary': self.color_secondary,
                'background': self.color_background,
                'surface': self.color_surface,
                'text': self.color_text,
                'textSecondary': self.color_text_secondary,
                'accent': self.color_accent,
                'error': self.color_error,
                'success': self.color_success,
            },
            'copy': {
                'title': self.name,
                'subtitle': self.subtitle,
                'cta': self.cta_text,
                'disclaimer': self.disclaimer,
                'policy_title': 'Политика конфиденциальности',
                'policy_text': 'Мы заботимся о безопасности ваших данных...',
            },
            'features': {
                'default_sort': self.default_sort,
                'show_filters': self.show_filters,
                'show_disclaimer': self.show_disclaimer,
                'enable_messages': self.enable_messages,
            }
        }


class Offer(models.Model):
    """Офферы МФО для агрегатора"""
    # Основная информация
    partner_name = models.CharField(max_length=200, verbose_name='Название партнёра')
    logo_url = models.URLField(max_length=500, verbose_name='URL логотипа')
    
    # Параметры займа
    sum_min = models.IntegerField(verbose_name='Минимальная сумма, ₽')
    sum_max = models.IntegerField(verbose_name='Максимальная сумма, ₽')
    term_min = models.IntegerField(verbose_name='Минимальный срок, дней')
    term_max = models.IntegerField(verbose_name='Максимальный срок, дней')
    
    # Ставка
    rate = models.FloatField(verbose_name='Ставка (% в день)')
    rate_text = models.CharField(max_length=100, verbose_name='Ставка (текст)', 
                                   help_text='Например: "0.5% в день"')
    
    # Условия
    approval_time = models.CharField(max_length=100, verbose_name='Время одобрения',
                                      help_text='Например: "15 минут"')
    approval_probability = models.CharField(max_length=50, verbose_name='Вероятность одобрения',
                                             choices=[
                                                 ('высокая', 'Высокая'),
                                                 ('средняя', 'Средняя'),
                                                 ('низкая', 'Низкая'),
                                             ])
    
    # Особенности (JSON для гибкости)
    features = models.JSONField(verbose_name='Особенности', default=list,
                                 help_text='Список особенностей, например: ["Без отказа", "Первый займ 0%"]')
    
    # Ссылка для перехода
    redirect_url = models.URLField(max_length=1000, verbose_name='URL для перехода',
                                     help_text='Используйте {sub_id} для подстановки идентификатора')
    
    # Настройки отображения
    is_active = models.BooleanField(default=True, verbose_name='Активен',
                                      help_text='Неактивные офферы не показываются пользователям')
    priority = models.IntegerField(default=0, verbose_name='Приоритет',
                                     help_text='Чем выше число, тем выше в списке')
    
    # Даты
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создан')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлён')
    
    class Meta:
        db_table = 'offers'
        ordering = ['-priority', '-created_at']
        verbose_name = 'Оффер'
        verbose_name_plural = 'Офферы'
    
    def __str__(self):
        return f"{self.partner_name} ({self.sum_min}-{self.sum_max}₽)"


class Subscriber(models.Model):
    """Подписчики на рассылку от VK Mini App"""
    vk_user_id = models.CharField(max_length=100, unique=True, db_index=True)
    group_id = models.CharField(max_length=100)
    brand = models.CharField(max_length=50, db_index=True)
    subscribed = models.BooleanField(default=True, db_index=True)
    allowed_from_group = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    subscribed_at = models.DateTimeField(null=True, blank=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'subscribers'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['brand', 'subscribed', 'allowed_from_group']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        status = "✓" if self.subscribed else "✗"
        allowed = "📩" if self.allowed_from_group else "📭"
        return f"{status} {allowed} VK:{self.vk_user_id} ({self.brand})"

    @property
    def can_receive_messages(self):
        """Может ли получать сообщения (подписан И разрешил)"""
        return self.subscribed and self.allowed_from_group


class ModalSettings(models.Model):
    """Настройки модального окна подписки"""
    # Основные настройки
    is_enabled = models.BooleanField(default=True, verbose_name='Включить модальное окно')
    show_delay = models.IntegerField(default=2000, verbose_name='Задержка показа (мс)',
                                     help_text='Через сколько миллисекунд показать модалку')
    show_mode = models.CharField(max_length=20, default='until_subscribed', 
                                 verbose_name='Режим показа',
                                 choices=[
                                     ('every_time', 'При каждом заходе'),
                                     ('until_subscribed', 'Пока не подписался'),
                                 ],
                                 help_text='Когда показывать модальное окно')
    
    # Тексты
    title = models.CharField(max_length=200, default='🎉 Эксклюзивное предложение', 
                             verbose_name='Заголовок модального окна')
    main_title = models.CharField(max_length=200, default='ЭКСКЛЮЗИВНОЕ ПРЕДЛОЖЕНИЕ',
                                  verbose_name='Основной заголовок')
    subtitle = models.CharField(max_length=200, default='Получите займ под 0%',
                                verbose_name='Подзаголовок')
    description = models.TextField(default='Подпишитесь на уведомления, чтобы первыми узнавать о новых предложениях и эксклюзивных условиях',
                                   verbose_name='Описание')
    
    # Кнопки
    button_text = models.CharField(max_length=200, default='🔔 Подписаться и получить займ',
                                   verbose_name='Текст кнопки подписки')
    skip_button_text = models.CharField(max_length=100, default='Пропустить',
                                        verbose_name='Текст кнопки "Пропустить"')
    
    # Цвета
    background_color = models.CharField(max_length=7, default='#f8f9fa', 
                                        verbose_name='Цвет фона модального окна')
    background_gradient_start = models.CharField(max_length=7, default='#f8f9fa',
                                                 verbose_name='Градиент фона: начало')
    background_gradient_end = models.CharField(max_length=7, default='#e9ecef',
                                               verbose_name='Градиент фона: конец')
    icon_background_color = models.CharField(max_length=7, default='#007bff',
                                             verbose_name='Цвет фона иконки')
    icon_background_gradient_start = models.CharField(max_length=7, default='#007bff',
                                                      verbose_name='Градиент иконки: начало')
    icon_background_gradient_end = models.CharField(max_length=7, default='#0056b3',
                                                    verbose_name='Градиент иконки: конец')
    title_color = models.CharField(max_length=7, default='#000000',
                                   verbose_name='Цвет заголовка')
    subtitle_color = models.CharField(max_length=7, default='#007bff',
                                      verbose_name='Цвет подзаголовка')
    description_color = models.CharField(max_length=7, default='#666666',
                                         verbose_name='Цвет описания')
    button_background_color = models.CharField(max_length=7, default='#007bff',
                                               verbose_name='Цвет фона кнопки')
    button_background_gradient_start = models.CharField(max_length=7, default='#007bff',
                                                         verbose_name='Градиент кнопки: начало')
    button_background_gradient_end = models.CharField(max_length=7, default='#0056b3',
                                                       verbose_name='Градиент кнопки: конец')
    button_text_color = models.CharField(max_length=7, default='#ffffff',
                                         verbose_name='Цвет текста кнопки')
    skip_button_color = models.CharField(max_length=7, default='#666666',
                                         verbose_name='Цвет кнопки "Пропустить"')
    
    # Настройки отображения
    icon_size = models.IntegerField(default=80, verbose_name='Размер иконки (px)')
    title_font_size = models.IntegerField(default=24, verbose_name='Размер шрифта заголовка (px)')
    subtitle_font_size = models.IntegerField(default=20, verbose_name='Размер шрифта подзаголовка (px)')
    description_font_size = models.IntegerField(default=16, verbose_name='Размер шрифта описания (px)')
    button_height = models.IntegerField(default=48, verbose_name='Высота кнопки (px)')
    button_font_size = models.IntegerField(default=16, verbose_name='Размер шрифта кнопки (px)')
    
    # Тени и эффекты
    icon_shadow = models.CharField(max_length=100, default='0 8px 24px rgba(0, 123, 255, 0.3)',
                                   verbose_name='Тень иконки')
    button_shadow = models.CharField(max_length=100, default='0 4px 16px rgba(0, 123, 255, 0.3)',
                                     verbose_name='Тень кнопки')
    border_radius = models.IntegerField(default=12, verbose_name='Скругление углов (px)')
    
    # Даты
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Создано')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Обновлено')
    
    class Meta:
        db_table = 'modal_settings'
        verbose_name = 'Настройки модального окна'
        verbose_name_plural = 'Настройки модального окна'
    
    def __str__(self):
        return f"Настройки модального окна (обновлено: {self.updated_at.strftime('%d.%m.%Y %H:%M')})"
    
    @classmethod
    def get_or_create_settings(cls):
        """Получить или создать настройки модального окна"""
        settings = cls.objects.first()
        if not settings:
            settings = cls.objects.create()
        return settings
    
    def to_dict(self):
        """Преобразовать в словарь для API"""
        return {
            'enabled': self.is_enabled,
            'show_delay': self.show_delay,
            'show_mode': self.show_mode,
            'texts': {
                'title': self.title,
                'main_title': self.main_title,
                'subtitle': self.subtitle,
                'description': self.description,
                'button_text': self.button_text,
                'skip_button_text': self.skip_button_text,
            },
            'colors': {
                'background': self.background_color,
                'background_gradient': {
                    'start': self.background_gradient_start,
                    'end': self.background_gradient_end,
                },
                'icon_background': self.icon_background_color,
                'icon_background_gradient': {
                    'start': self.icon_background_gradient_start,
                    'end': self.icon_background_gradient_end,
                },
                'title': self.title_color,
                'subtitle': self.subtitle_color,
                'description': self.description_color,
                'button_background': self.button_background_color,
                'button_background_gradient': {
                    'start': self.button_background_gradient_start,
                    'end': self.button_background_gradient_end,
                },
                'button_text': self.button_text_color,
                'skip_button': self.skip_button_color,
            },
            'sizes': {
                'icon_size': self.icon_size,
                'title_font_size': self.title_font_size,
                'subtitle_font_size': self.subtitle_font_size,
                'description_font_size': self.description_font_size,
                'button_height': self.button_height,
                'button_font_size': self.button_font_size,
            },
            'effects': {
                'icon_shadow': self.icon_shadow,
                'button_shadow': self.button_shadow,
                'border_radius': self.border_radius,
            }
        }


class ClickLog(models.Model):
    """Логирование кликов по офферам"""
    offer = models.ForeignKey(
        Offer,
        on_delete=models.CASCADE,
        related_name='clicks',
        verbose_name='Оффер',
        null=True,
        blank=True
    )
    vk_user_id = models.CharField(max_length=100, null=True, blank=True, verbose_name='VK User ID')
    subscriber = models.ForeignKey(
        Subscriber,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='clicks',
        verbose_name='Подписчик'
    )
    group_id = models.CharField(max_length=100, null=True, blank=True, verbose_name='Group ID')
    brand = models.CharField(max_length=50, null=True, blank=True, verbose_name='Бренд')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Дата клика')
    ip_address = models.GenericIPAddressField(null=True, blank=True, verbose_name='IP адрес')
    user_agent = models.TextField(null=True, blank=True, verbose_name='User Agent')

    class Meta:
        db_table = 'click_logs'
        ordering = ['-created_at']
        verbose_name = 'Клик по офферу'
        verbose_name_plural = 'Клики по офферам'

    def __str__(self):
        return f"Click {self.offer.partner_name} by {self.vk_user_id} at {self.created_at}"

