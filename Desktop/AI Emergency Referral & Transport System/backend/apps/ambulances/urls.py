from django.urls import path
from . import views

urlpatterns = [
    path('', views.AmbulanceListView.as_view(), name='ambulance-list'),
    path('nearby/', views.AmbulanceNearbyView.as_view(), name='ambulance-nearby'),
    path('register/', views.AmbulanceRegisterView.as_view(), name='ambulance-register'),
    path('<uuid:pk>/', views.AmbulanceDetailView.as_view(), name='ambulance-detail'),
    path('<uuid:pk>/update/', views.AmbulanceUpdateView.as_view(), name='ambulance-update'),
    path('<uuid:pk>/status/', views.AmbulanceStatusView.as_view(), name='ambulance-status'),
    path('<uuid:pk>/location/', views.AmbulanceLocationView.as_view(), name='ambulance-location'),
    path('<uuid:pk>/verify/', views.AmbulanceVerifyView.as_view(), name='ambulance-verify'),
    # Driver endpoints
    path('drivers/register/', views.DriverRegisterView.as_view(), name='driver-register'),
    path('drivers/profile/', views.DriverProfileView.as_view(), name='driver-profile'),
    path('drivers/<uuid:pk>/verify/', views.DriverVerifyView.as_view(), name='driver-verify'),
]
