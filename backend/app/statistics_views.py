"""
API views для статистики
"""
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .statistics import (
    get_offer_statistics,
    get_brand_statistics,
    get_daily_statistics,
    get_top_offers,
    get_conversion_rate,
    get_subscriber_statistics,
    get_offer_performance,
    get_dashboard_summary
)


@staff_member_required
def statistics_dashboard_html(request):
    """
    HTML страница со статистикой для админов
    """
    return render(request, 'admin/statistics_dashboard.html')


@api_view(['GET'])
def statistics_dashboard_view(request):
    """
    GET /api/statistics/dashboard/?days=30
    
    Сводка статистики для дашборда
    """
    days = int(request.GET.get('days', 30))
    
    try:
        summary = get_dashboard_summary(days=days)
        return Response({
            'success': True,
            'data': summary
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def statistics_offers_view(request):
    """
    GET /api/statistics/offers/?days=30
    
    Статистика по офферам
    """
    days = int(request.GET.get('days', 30))
    
    try:
        stats = get_offer_statistics(days=days)
        return Response({
            'success': True,
            'data': stats
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def statistics_brands_view(request):
    """
    GET /api/statistics/brands/?days=30
    
    Статистика по брендам
    """
    days = int(request.GET.get('days', 30))
    
    try:
        stats = get_brand_statistics(days=days)
        return Response({
            'success': True,
            'data': stats
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def statistics_daily_view(request):
    """
    GET /api/statistics/daily/?days=30
    
    Статистика по дням
    """
    days = int(request.GET.get('days', 30))
    
    try:
        stats = get_daily_statistics(days=days)
        return Response({
            'success': True,
            'data': stats
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def statistics_top_offers_view(request):
    """
    GET /api/statistics/top-offers/?limit=10&days=30
    
    ТОП офферов по кликам
    """
    limit = int(request.GET.get('limit', 10))
    days = int(request.GET.get('days', 30))
    
    try:
        stats = get_top_offers(limit=limit, days=days)
        return Response({
            'success': True,
            'data': stats
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def statistics_offer_detail_view(request, offer_id):
    """
    GET /api/statistics/offers/<offer_id>/?days=30
    
    Детальная статистика по офферу
    """
    days = int(request.GET.get('days', 30))
    
    try:
        stats = get_offer_performance(offer_id=offer_id, days=days)
        return Response({
            'success': True,
            'data': stats
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def statistics_conversion_view(request):
    """
    GET /api/statistics/conversion/?days=30
    
    Конверсия и метрики
    """
    days = int(request.GET.get('days', 30))
    
    try:
        stats = get_conversion_rate(days=days)
        return Response({
            'success': True,
            'data': stats
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def statistics_subscribers_view(request):
    """
    GET /api/statistics/subscribers/
    
    Статистика по подписчикам
    """
    try:
        stats = get_subscriber_statistics()
        return Response({
            'success': True,
            'data': stats
        })
    except Exception as e:
        return Response(
            {'success': False, 'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

