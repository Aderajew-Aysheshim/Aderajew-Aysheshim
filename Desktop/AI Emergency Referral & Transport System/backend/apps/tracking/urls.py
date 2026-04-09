from django.urls import path
from . import views

urlpatterns = [
    path('gps/', views.GPSTrackingCreateView.as_view(), name='gps-create'),
    path('emergency/<uuid:emergency_id>/', views.EmergencyTrackingHistoryView.as_view(), name='emergency-tracking'),
    path('emergency/<uuid:emergency_id>/route/', views.EmergencyRouteView.as_view(), name='emergency-route'),
    path('ambulance/<uuid:ambulance_id>/', views.AmbulanceTrackingHistoryView.as_view(), name='ambulance-tracking'),
    path('ambulance/<uuid:ambulance_id>/latest/', views.AmbulanceLatestLocationView.as_view(), name='ambulance-latest'),
]
