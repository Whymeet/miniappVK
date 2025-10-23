from django.urls import path
from . import views
from . import callbacks

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
    
    # VK Callback API
    path('vk-callback/', callbacks.vk_callback_view, name='vk_callback'),
]

