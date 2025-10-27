from django.urls import path
from . import views
from . import callbacks
from . import statistics_views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('config/', views.config_view, name='config'),
    path('offers/', views.offers_view, name='offers'),
    path('go/<str:offer_id>/', views.offer_redirect_view, name='offer_redirect'),
    
    # Subscription API
    path('subscribe/', views.subscribe_view, name='subscribe'),
    path('subscribe/allow-messages/', views.allow_messages_view, name='allow_messages'),
    path('unsubscribe/', views.unsubscribe_view, name='unsubscribe'),
    path('subscription/status/', views.subscription_status_view, name='subscription_status'),
    
    # Statistics HTML (для админов)
    path('statistics/', statistics_views.statistics_dashboard_html, name='statistics_html'),
    
    # Statistics API
    path('statistics/dashboard/', statistics_views.statistics_dashboard_view, name='statistics_dashboard'),
    path('statistics/offers/', statistics_views.statistics_offers_view, name='statistics_offers'),
    path('statistics/offers/<str:offer_id>/', statistics_views.statistics_offer_detail_view, name='statistics_offer_detail'),
    path('statistics/brands/', statistics_views.statistics_brands_view, name='statistics_brands'),
    path('statistics/daily/', statistics_views.statistics_daily_view, name='statistics_daily'),
    path('statistics/top-offers/', statistics_views.statistics_top_offers_view, name='statistics_top_offers'),
    path('statistics/conversion/', statistics_views.statistics_conversion_view, name='statistics_conversion'),
    path('statistics/subscribers/', statistics_views.statistics_subscribers_view, name='statistics_subscribers'),
    
    # VK Callback API
    path('vk-callback/', callbacks.vk_callback_view, name='vk_callback'),
]

