from django.db import models
from django.utils import timezone


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


class ClickLog(models.Model):
    """Логирование кликов по офферам"""
    offer_id = models.CharField(max_length=100)
    vk_user_id = models.CharField(max_length=100, null=True, blank=True)
    subscriber = models.ForeignKey(
        Subscriber,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='clicks'
    )
    group_id = models.CharField(max_length=100, null=True, blank=True)
    brand = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'click_logs'
        ordering = ['-created_at']

    def __str__(self):
        return f"Click {self.offer_id} by {self.vk_user_id} at {self.created_at}"

