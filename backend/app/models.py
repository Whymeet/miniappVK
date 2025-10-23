from django.db import models
from django.utils import timezone


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

