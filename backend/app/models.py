from django.db import models


class ClickLog(models.Model):
    """Логирование кликов по офферам"""
    offer_id = models.CharField(max_length=100)
    vk_user_id = models.CharField(max_length=100, null=True, blank=True)
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

