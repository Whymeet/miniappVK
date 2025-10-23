from django.contrib import admin
from .models import ClickLog


@admin.register(ClickLog)
class ClickLogAdmin(admin.ModelAdmin):
    list_display = ['offer_id', 'vk_user_id', 'group_id', 'brand', 'created_at']
    list_filter = ['brand', 'created_at']
    search_fields = ['offer_id', 'vk_user_id', 'group_id']
    readonly_fields = ['created_at']

