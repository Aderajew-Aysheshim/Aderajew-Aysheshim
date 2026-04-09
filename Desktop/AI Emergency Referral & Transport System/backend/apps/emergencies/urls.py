from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.EmergencyCreateView.as_view(), name='emergency-create'),
    path('', views.EmergencyListView.as_view(), name='emergency-list'),
    path('active/', views.ActiveEmergenciesView.as_view(), name='emergency-active'),
    path('all/', views.AllEmergenciesView.as_view(), name='emergency-all'),
    path('<uuid:pk>/', views.EmergencyDetailView.as_view(), name='emergency-detail'),
    path('<uuid:pk>/status/', views.EmergencyUpdateStatusView.as_view(), name='emergency-update-status'),
    path('<uuid:pk>/select-hospital/', views.EmergencySelectHospitalView.as_view(), name='emergency-select-hospital'),
    path('<uuid:pk>/cancel/', views.EmergencyCancelView.as_view(), name='emergency-cancel'),
]
