from django.contrib import admin
from django.http import HttpResponse, JsonResponse
from django.utils.html import format_html
from django.shortcuts import render, redirect
from django.urls import path, reverse
from django.contrib import messages
from django.utils.safestring import mark_safe
from django.contrib.admin import AdminSite
import csv
import json
from .models import ClickLog, Subscriber, Offer, BrandConfig, AppConfig, ModalSettings
from .statistics import get_dashboard_summary, get_top_offers


# Кастомизация главной страницы админки
class CustomAdminSite(AdminSite):
    site_header = 'Админ-панель Займов'
    site_title = 'Админ-панель'
    index_title = 'Управление приложением'
    
    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['statistics_url'] = '/api/statistics/'
        return super().index(request, extra_context)


class ClickLogInline(admin.TabularInline):
    """Inline для отображения кликов подписчика"""
    model = ClickLog
    extra = 0
    fields = ['offer', 'brand', 'created_at', 'ip_address']
    readonly_fields = ['offer', 'brand', 'created_at', 'ip_address']
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False


def export_subscribers_to_csv(modeladmin, request, queryset):
    """Экспорт подписчиков в CSV"""
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="subscribers_export.csv"'
    response.write('\ufeff')  # UTF-8 BOM для Excel
    
    writer = csv.writer(response)
    writer.writerow([
        'VK User ID',
        'Group ID',
        'Brand',
        'Subscribed',
        'Allowed From Group',
        'Can Receive Messages',
        'Created At',
        'Subscribed At',
        'Unsubscribed At',
        'Total Clicks',
    ])
    
    for subscriber in queryset:
        writer.writerow([
            subscriber.vk_user_id,
            subscriber.group_id,
            subscriber.brand,
            'Yes' if subscriber.subscribed else 'No',
            'Yes' if subscriber.allowed_from_group else 'No',
            'Yes' if subscriber.can_receive_messages else 'No',
            subscriber.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            subscriber.subscribed_at.strftime('%Y-%m-%d %H:%M:%S') if subscriber.subscribed_at else '',
            subscriber.unsubscribed_at.strftime('%Y-%m-%d %H:%M:%S') if subscriber.unsubscribed_at else '',
            subscriber.clicks.count(),
        ])
    
    return response


export_subscribers_to_csv.short_description = "Экспорт выбранных в CSV"


@admin.register(AppConfig)
class AppConfigAdmin(admin.ModelAdmin):
    """Админка для единой конфигурации внешнего вида"""
    
    def has_add_permission(self, request):
        # Разрешаем создание только если нет ни одной записи
        return not AppConfig.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Запрещаем удаление
        return False
    
    list_display = ['app_name', 'color_preview', 'updated_at']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('app_name', 'logo_url')
        }),
        ('🎨 Цветовая палитра', {
            'fields': (
                ('color_primary', 'color_secondary'),
                ('color_background', 'color_surface'),
                ('color_text', 'color_text_secondary'),
                ('color_accent', 'color_error', 'color_success'),
            ),
            'description': 'Используйте формат HEX: #FF6B35. Основной цвет применяется к кнопкам.'
        }),
        ('📝 Тексты', {
            'fields': ('subtitle', 'cta_text', 'disclaimer')
        }),
        ('⚙️ Настройки', {
            'fields': (
                'default_sort',
                ('show_filters', 'show_disclaimer', 'enable_messages'),
            )
        }),
        ('🔘 Цвета кнопок сортировки', {
            'fields': (
                'sort_button_rate_color',
                'sort_button_sum_color',
                'sort_button_term_color',
            ),
            'description': 'Настройте цвет каждой кнопки сортировки'
        }),
        ('🎨 Градиент карточек офферов', {
            'fields': (
                'card_gradient_enabled',
                ('card_gradient_start', 'card_gradient_end'),
            ),
            'description': 'Включите градиентный фон для карточек и настройте цвета'
        }),
        ('🔗 Кнопка "МЫ В ВК"', {
            'fields': (
                'vk_group_url',
                'vk_button_color',
            ),
            'description': 'Настройте кнопку для перехода в группу ВК'
        }),
    )
    
    readonly_fields = ['updated_at']
    
    def color_preview(self, obj):
        return format_html(
            '<div style="display: flex; gap: 4px;">'
            '<div style="width: 24px; height: 24px; background: {}; border: 1px solid #ccc; border-radius: 4px;" title="Основной"></div>'
            '<div style="width: 24px; height: 24px; background: {}; border: 1px solid #ccc; border-radius: 4px;" title="Вторичный"></div>'
            '<div style="width: 24px; height: 24px; background: {}; border: 1px solid #ccc; border-radius: 4px;" title="Акцент"></div>'
            '</div>',
            obj.color_primary,
            obj.color_secondary,
            obj.color_accent
        )
    color_preview.short_description = 'Цвета'
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('export-config/', self.admin_site.admin_view(self.export_config), name='app_appconfig_export'),
            path('import-config/', self.admin_site.admin_view(self.import_config), name='app_appconfig_import'),
        ]
        return custom_urls + urls
    
    def export_config(self, request):
        """Экспорт конфигурации в JSON"""
        config = AppConfig.get_or_create_config()
        response = HttpResponse(config.export_to_json(), content_type='application/json')
        response['Content-Disposition'] = 'attachment; filename="app_config.json"'
        return response
    
    def import_config(self, request):
        """Импорт конфигурации из JSON"""
        if request.method == 'POST' and request.FILES.get('config_file'):
            try:
                config_file = request.FILES['config_file']
                json_data = config_file.read().decode('utf-8')
                AppConfig.import_from_json(json_data)
                messages.success(request, 'Настройки успешно импортированы!')
                return redirect('..')
            except Exception as e:
                messages.error(request, f'Ошибка импорта: {str(e)}')
        
        return render(request, 'admin/app/appconfig/import.html')
    
    def changelist_view(self, request, extra_context=None):
        """Добавляем кнопки экспорта/импорта"""
        extra_context = extra_context or {}
        extra_context['show_export_import'] = True
        return super().changelist_view(request, extra_context)
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        """Добавляем кнопки экспорта/импорта на страницу редактирования"""
        extra_context = extra_context or {}
        extra_context['show_export_import'] = True
        return super().change_view(request, object_id, form_url, extra_context)


@admin.register(BrandConfig)
class BrandConfigAdmin(admin.ModelAdmin):
    list_display = [
        'brand_key',
        'name',
        'color_preview',
        'is_active',
        'updated_at',
    ]
    list_filter = ['is_active', 'created_at']
    search_fields = ['brand_key', 'name']
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('brand_key', 'name', 'logo_url', 'is_active')
        }),
        ('Цветовая палитра', {
            'fields': (
                ('color_primary', 'color_secondary'),
                ('color_background', 'color_surface'),
                ('color_text', 'color_text_secondary'),
                ('color_accent', 'color_error', 'color_success'),
            ),
            'description': 'Используйте формат HEX: #FF6B35'
        }),
        ('Тексты', {
            'fields': ('subtitle', 'cta_text', 'disclaimer')
        }),
        ('Настройки', {
            'fields': (
                'default_sort',
                ('show_filters', 'show_disclaimer', 'enable_messages'),
            )
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def color_preview(self, obj):
        return format_html(
            '<div style="display: flex; gap: 4px;">'
            '<div style="width: 20px; height: 20px; background: {}; border: 1px solid #ccc;"></div>'
            '<div style="width: 20px; height: 20px; background: {}; border: 1px solid #ccc;"></div>'
            '<div style="width: 20px; height: 20px; background: {}; border: 1px solid #ccc;"></div>'
            '</div>',
            obj.color_primary,
            obj.color_secondary,
            obj.color_accent
        )
    color_preview.short_description = 'Цвета'


@admin.register(Offer)
class OfferAdmin(admin.ModelAdmin):
    list_display = [
        'partner_name',
        'sum_range',
        'term_range',
        'rate_text',
        'is_active',
        'priority',
        'clicks_total',
        'clicks_today',
        'clicks_week',
        'clicks_month',
        'unique_users',
        'statistics_link',
        'created_at',
    ]
    list_filter = ['is_active', 'approval_probability', 'created_at']
    search_fields = ['partner_name']
    ordering = ['-priority', '-created_at']
    
    # Разрешаем сортировку по кликам (но не очень эффективно для больших таблиц)
    # admin_order_field для методов не поддерживается напрямую, 
    # но Django покажет данные правильно
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('partner_name', 'logo_url')
        }),
        ('📊 Статистика', {
            'fields': (
                ('clicks_total', 'clicks_today'),
                ('clicks_week', 'clicks_month'),
                ('unique_users', 'statistics_link'),
            ),
            'classes': ('collapse',),
            'description': 'Статистика по кликам и пользователям'
        }),
        ('Параметры займа', {
            'fields': (
                ('sum_min', 'sum_max'),
                ('term_min', 'term_max'),
            )
        }),
        ('Ставка и условия', {
            'fields': (
                ('rate', 'rate_text'),
                ('approval_time', 'approval_probability'),
            )
        }),
        ('Особенности', {
            'fields': ('features',),
            'description': 'Введите список в формате JSON: ["Без отказа", "Первый займ 0%", "Онлайн"]'
        }),
        ('Настройки перехода', {
            'fields': ('redirect_url',),
            'description': 'Используйте {sub_id} для подстановки идентификатора пользователя'
        }),
        ('Отображение', {
            'fields': (('is_active', 'priority'),)
        }),
    )
    
    readonly_fields = [
        'clicks_total', 'clicks_today', 'clicks_week', 'clicks_month',
        'unique_users', 'statistics_link'
    ]
    
    def sum_range(self, obj):
        return f"{obj.sum_min:,} - {obj.sum_max:,} ₽"
    sum_range.short_description = 'Сумма'
    
    def term_range(self, obj):
        return f"{obj.term_min} - {obj.term_max} дней"
    term_range.short_description = 'Срок'
    
    def clicks_total(self, obj):
        """Всего кликов за всё время"""
        count = obj.clicks.count()
        if count > 0:
            return format_html('<strong style="color: #155A31;">{}</strong>', count)
        return format_html('<span style="color: #999;">0</span>')
    clicks_total.short_description = 'Всего'
    
    def clicks_today(self, obj):
        """Кликов сегодня"""
        from django.utils import timezone
        from datetime import timedelta
        
        today_start = timezone.now().replace(hour=0, minute=0, second=0, microsecond=0)
        count = obj.clicks.filter(created_at__gte=today_start).count()
        
        if count > 0:
            return format_html('<strong style="color: #AF6E3D;">{}</strong>', count)
        return format_html('<span style="color: #ccc;">0</span>')
    clicks_today.short_description = 'Сегодня'
    
    def clicks_week(self, obj):
        """Кликов за 7 дней"""
        from django.utils import timezone
        from datetime import timedelta
        
        week_ago = timezone.now() - timedelta(days=7)
        count = obj.clicks.filter(created_at__gte=week_ago).count()
        
        if count > 0:
            return format_html('<span style="color: #2c3e50;">{}</span>', count)
        return format_html('<span style="color: #ccc;">0</span>')
    clicks_week.short_description = '7 дней'
    
    def clicks_month(self, obj):
        """Кликов за 30 дней"""
        from django.utils import timezone
        from datetime import timedelta
        
        month_ago = timezone.now() - timedelta(days=30)
        count = obj.clicks.filter(created_at__gte=month_ago).count()
        
        if count > 0:
            return format_html('<span style="color: #3498db;">{}</span>', count)
        return format_html('<span style="color: #ccc;">0</span>')
    clicks_month.short_description = '30 дней'
    
    def unique_users(self, obj):
        """Уникальных пользователей"""
        from django.utils import timezone
        from datetime import timedelta
        
        month_ago = timezone.now() - timedelta(days=30)
        count = obj.clicks.filter(created_at__gte=month_ago).values('vk_user_id').distinct().count()
        
        if count > 0:
            return format_html(
                '<span style="color: #8e44ad;" title="За последние 30 дней">👤 {}</span>', 
                count
            )
        return format_html('<span style="color: #ccc;">0</span>')
    unique_users.short_description = 'Уникальных'
    
    def statistics_link(self, obj):
        """Ссылка на детальную статистику"""
        url = f"/api/statistics/offers/{obj.id}/?days=30"
        return format_html('<a href="{}" target="_blank" style="text-decoration: none;">📊 Подробнее</a>', url)
    statistics_link.short_description = 'Статистика'
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.prefetch_related('clicks')


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = [
        'vk_user_id',
        'brand',
        'status_badge',
        'messages_badge',
        'clicks_count',
        'created_at',
        'subscribed_at',
    ]
    list_filter = [
        'brand',
        'subscribed',
        'allowed_from_group',
        'created_at',
        'subscribed_at',
    ]
    search_fields = ['vk_user_id', 'group_id']
    readonly_fields = ['created_at', 'updated_at', 'clicks_count']
    actions = [export_subscribers_to_csv]
    inlines = [ClickLogInline]
    
    fieldsets = (
        ('Основная информация', {
            'fields': ('vk_user_id', 'group_id', 'brand')
        }),
        ('Статус подписки', {
            'fields': ('subscribed', 'allowed_from_group')
        }),
        ('Даты', {
            'fields': ('created_at', 'subscribed_at', 'unsubscribed_at', 'updated_at')
        }),
        ('Статистика', {
            'fields': ('clicks_count',)
        }),
    )
    
    def status_badge(self, obj):
        if obj.subscribed:
            return format_html('<span style="color: green;">✓ Подписан</span>')
        return format_html('<span style="color: red;">✗ Отписан</span>')
    status_badge.short_description = 'Статус'
    
    def messages_badge(self, obj):
        if obj.allowed_from_group:
            return format_html('<span style="color: green;">📩 Разрешено</span>')
        return format_html('<span style="color: gray;">📭 Не разрешено</span>')
    messages_badge.short_description = 'Сообщения'
    
    def clicks_count(self, obj):
        return obj.clicks.count()
    clicks_count.short_description = 'Кликов'


@admin.register(ClickLog)
class ClickLogAdmin(admin.ModelAdmin):
    list_display = ['offer_link', 'vk_user_id', 'subscriber_link', 'group_id', 'brand', 'created_at']
    list_filter = ['brand', 'created_at', 'offer']
    search_fields = ['vk_user_id', 'group_id', 'offer__partner_name']
    readonly_fields = ['created_at', 'subscriber', 'offer']
    
    def offer_link(self, obj):
        if obj.offer:
            url = f'/admin/app/offer/{obj.offer.id}/change/'
            return format_html('<a href="{}">{}</a>', url, obj.offer.partner_name)
        return '-'
    offer_link.short_description = 'Оффер'
    
    def subscriber_link(self, obj):
        if obj.subscriber:
            url = f'/admin/app/subscriber/{obj.subscriber.id}/change/'
            return format_html('<a href="{}">{}</a>', url, obj.subscriber.vk_user_id)
        return '-'
    subscriber_link.short_description = 'Подписчик'


@admin.register(ModalSettings)
class ModalSettingsAdmin(admin.ModelAdmin):
    """Админка для настроек модального окна подписки"""
    
    def has_add_permission(self, request):
        # Разрешаем создание только если нет ни одной записи
        return not ModalSettings.objects.exists()
    
    def has_delete_permission(self, request, obj=None):
        # Запрещаем удаление
        return False
    
    list_display = ['title', 'is_enabled', 'show_delay', 'updated_at']
    
    fieldsets = (
        ('🔧 Основные настройки', {
            'fields': ('is_enabled', 'show_delay', 'show_mode'),
            'description': 'Включите модальное окно и настройте задержку показа'
        }),
        ('📝 Тексты', {
            'fields': (
                'title',
                'main_title',
                'subtitle',
                'description',
            ),
            'description': 'Настройте все тексты в модальном окне'
        }),
        ('🔘 Кнопки', {
            'fields': (
                'button_text',
                'skip_button_text',
            ),
            'description': 'Тексты кнопок'
        }),
        ('🎨 Цвета фона', {
            'fields': (
                'background_color',
                ('background_gradient_start', 'background_gradient_end'),
            ),
            'description': 'Настройте фон модального окна'
        }),
        ('🎨 Цвета иконки', {
            'fields': (
                'icon_background_color',
                ('icon_background_gradient_start', 'icon_background_gradient_end'),
                'icon_shadow',
            ),
            'description': 'Настройте внешний вид иконки'
        }),
        ('🎨 Цвета текста', {
            'fields': (
                'title_color',
                'subtitle_color',
                'description_color',
            ),
            'description': 'Цвета всех текстов'
        }),
        ('🎨 Цвета кнопок', {
            'fields': (
                'button_background_color',
                ('button_background_gradient_start', 'button_background_gradient_end'),
                'button_text_color',
                'button_shadow',
                'skip_button_color',
            ),
            'description': 'Настройте внешний вид кнопок'
        }),
        ('📏 Размеры', {
            'fields': (
                'icon_size',
                'title_font_size',
                'subtitle_font_size',
                'description_font_size',
                'button_height',
                'button_font_size',
            ),
            'description': 'Размеры элементов'
        }),
        ('✨ Эффекты', {
            'fields': (
                'border_radius',
            ),
            'description': 'Дополнительные эффекты'
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('preview/', self.admin_site.admin_view(self.preview_modal), name='app_modalsettings_preview'),
        ]
        return custom_urls + urls
    
    def preview_modal(self, request):
        """Предварительный просмотр модального окна"""
        settings = ModalSettings.get_or_create_settings()
        context = {
            'settings': settings.to_dict(),
            'title': 'Предварительный просмотр модального окна'
        }
        return render(request, 'admin/app/modalsettings/preview.html', context)
    
    def changelist_view(self, request, extra_context=None):
        """Добавляем кнопку предварительного просмотра"""
        extra_context = extra_context or {}
        extra_context['show_preview'] = True
        return super().changelist_view(request, extra_context)
    
    def change_view(self, request, object_id, form_url='', extra_context=None):
        """Добавляем кнопку предварительного просмотра на страницу редактирования"""
        extra_context = extra_context or {}
        extra_context['show_preview'] = True
        return super().change_view(request, object_id, form_url, extra_context)

