"""
Статистика по кликам и офферам
"""
from django.db.models import Count, Q, Sum
from django.db.models.functions import TruncDate, TruncHour
from django.utils import timezone
from datetime import timedelta
from .models import ClickLog, Offer, Subscriber


def get_offer_statistics(days=30):
    """
    Статистика по офферам за последние N дней
    """
    date_from = timezone.now() - timedelta(days=days)
    
    # Статистика по офферам
    offer_stats = ClickLog.objects.filter(
        created_at__gte=date_from,
        offer__isnull=False
    ).values(
        'offer__id',
        'offer__partner_name',
        'offer__logo_url'
    ).annotate(
        total_clicks=Count('id'),
        unique_users=Count('vk_user_id', distinct=True)
    ).order_by('-total_clicks')
    
    return list(offer_stats)


def get_brand_statistics(days=30):
    """
    Статистика по брендам за последние N дней
    """
    date_from = timezone.now() - timedelta(days=days)
    
    brand_stats = ClickLog.objects.filter(
        created_at__gte=date_from,
        brand__isnull=False
    ).values('brand').annotate(
        total_clicks=Count('id'),
        unique_users=Count('vk_user_id', distinct=True)
    ).order_by('-total_clicks')
    
    return list(brand_stats)


def get_daily_statistics(days=30):
    """
    Статистика по дням за последние N дней
    """
    date_from = timezone.now() - timedelta(days=days)
    
    daily_stats = ClickLog.objects.filter(
        created_at__gte=date_from
    ).annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        total_clicks=Count('id'),
        unique_users=Count('vk_user_id', distinct=True)
    ).order_by('date')
    
    return list(daily_stats)


def get_hourly_statistics(days=7):
    """
    Статистика по часам за последние N дней
    """
    date_from = timezone.now() - timedelta(days=days)
    
    hourly_stats = ClickLog.objects.filter(
        created_at__gte=date_from
    ).annotate(
        hour=TruncHour('created_at')
    ).values('hour').annotate(
        total_clicks=Count('id')
    ).order_by('hour')
    
    return list(hourly_stats)


def get_top_offers(limit=10, days=30):
    """
    ТОП офферов по кликам
    """
    date_from = timezone.now() - timedelta(days=days)
    
    top_offers = ClickLog.objects.filter(
        created_at__gte=date_from,
        offer__isnull=False
    ).values(
        'offer__id',
        'offer__partner_name',
        'offer__logo_url',
        'offer__rate_text'
    ).annotate(
        total_clicks=Count('id'),
        unique_users=Count('vk_user_id', distinct=True)
    ).order_by('-total_clicks')[:limit]
    
    return list(top_offers)


def get_conversion_rate(days=30):
    """
    Конверсия: клики / уникальные пользователи
    """
    date_from = timezone.now() - timedelta(days=days)
    
    total_clicks = ClickLog.objects.filter(created_at__gte=date_from).count()
    unique_users = ClickLog.objects.filter(
        created_at__gte=date_from
    ).values('vk_user_id').distinct().count()
    
    conversion_rate = (total_clicks / unique_users * 100) if unique_users > 0 else 0
    
    return {
        'total_clicks': total_clicks,
        'unique_users': unique_users,
        'conversion_rate': round(conversion_rate, 2),
        'avg_clicks_per_user': round(total_clicks / unique_users, 2) if unique_users > 0 else 0
    }


def get_subscriber_statistics():
    """
    Статистика по подписчикам
    """
    total_subscribers = Subscriber.objects.count()
    active_subscribers = Subscriber.objects.filter(subscribed=True).count()
    with_messages = Subscriber.objects.filter(
        subscribed=True, 
        allowed_from_group=True
    ).count()
    
    # Подписчики по брендам
    by_brand = Subscriber.objects.values('brand').annotate(
        total=Count('id'),
        active=Count('id', filter=Q(subscribed=True)),
        with_messages=Count('id', filter=Q(subscribed=True, allowed_from_group=True))
    ).order_by('-total')
    
    return {
        'total': total_subscribers,
        'active': active_subscribers,
        'with_messages': with_messages,
        'by_brand': list(by_brand)
    }


def get_offer_performance(offer_id, days=30):
    """
    Детальная статистика по конкретному офферу
    """
    date_from = timezone.now() - timedelta(days=days)
    
    # Общая статистика
    total_clicks = ClickLog.objects.filter(
        offer_id=offer_id,
        created_at__gte=date_from
    ).count()
    
    unique_users = ClickLog.objects.filter(
        offer_id=offer_id,
        created_at__gte=date_from
    ).values('vk_user_id').distinct().count()
    
    # По дням
    daily = ClickLog.objects.filter(
        offer_id=offer_id,
        created_at__gte=date_from
    ).annotate(
        date=TruncDate('created_at')
    ).values('date').annotate(
        clicks=Count('id')
    ).order_by('date')
    
    # По брендам
    by_brand = ClickLog.objects.filter(
        offer_id=offer_id,
        created_at__gte=date_from,
        brand__isnull=False
    ).values('brand').annotate(
        clicks=Count('id')
    ).order_by('-clicks')
    
    return {
        'total_clicks': total_clicks,
        'unique_users': unique_users,
        'avg_clicks_per_user': round(total_clicks / unique_users, 2) if unique_users > 0 else 0,
        'daily': list(daily),
        'by_brand': list(by_brand)
    }


def get_dashboard_summary(days=30):
    """
    Сводка для дашборда
    """
    date_from = timezone.now() - timedelta(days=days)
    
    # Общие метрики
    total_clicks = ClickLog.objects.filter(created_at__gte=date_from).count()
    unique_users = ClickLog.objects.filter(
        created_at__gte=date_from
    ).values('vk_user_id').distinct().count()
    
    # Активные офферы (с кликами)
    active_offers = ClickLog.objects.filter(
        created_at__gte=date_from,
        offer__isnull=False
    ).values('offer_id').distinct().count()
    
    # Всего офферов
    total_offers = Offer.objects.filter(is_active=True).count()
    
    # Подписчики
    subscribers = get_subscriber_statistics()
    
    # ТОП-5 офферов
    top_offers = get_top_offers(limit=5, days=days)
    
    # Конверсия
    conversion = get_conversion_rate(days=days)
    
    return {
        'period_days': days,
        'total_clicks': total_clicks,
        'unique_users': unique_users,
        'active_offers': active_offers,
        'total_offers': total_offers,
        'subscribers': subscribers,
        'top_offers': top_offers,
        'conversion': conversion
    }

