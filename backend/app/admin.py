from django.contrib import admin
from django.http import HttpResponse
from django.utils.html import format_html
import csv
from .models import ClickLog, Subscriber


class ClickLogInline(admin.TabularInline):
    """Inline для отображения кликов подписчика"""
    model = ClickLog
    extra = 0
    fields = ['offer_id', 'brand', 'created_at', 'ip_address']
    readonly_fields = ['offer_id', 'brand', 'created_at', 'ip_address']
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
    list_display = ['offer_id', 'vk_user_id', 'subscriber_link', 'group_id', 'brand', 'created_at']
    list_filter = ['brand', 'created_at']
    search_fields = ['offer_id', 'vk_user_id', 'group_id']
    readonly_fields = ['created_at', 'subscriber']
    
    def subscriber_link(self, obj):
        if obj.subscriber:
            url = f'/admin/app/subscriber/{obj.subscriber.id}/change/'
            return format_html('<a href="{}">{}</a>', url, obj.subscriber.vk_user_id)
        return '-'
    subscriber_link.short_description = 'Подписчик'

