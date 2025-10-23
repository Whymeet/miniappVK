from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('config/', views.config_view, name='config'),
    path('offers/', views.offers_view, name='offers'),
    path('go/<str:offer_id>/', views.offer_redirect_view, name='offer_redirect'),
]

