from django.urls import path
from . import views

urlpatterns = [
    path('process/', views.AIProcessEmergencyView.as_view(), name='ai-process'),
    path('chat/', views.AIChatView.as_view(), name='ai-chat'),
    path('quick/', views.AIQuickEmergencyView.as_view(), name='ai-quick'),
]
