from django.urls import path
from . import views

urlpatterns = [
    path('', views.HospitalListView.as_view(), name='hospital-list'),
    path('nearby/', views.HospitalNearbyView.as_view(), name='hospital-nearby'),
    path('register/', views.HospitalRegisterView.as_view(), name='hospital-register'),
    path('<uuid:pk>/', views.HospitalDetailView.as_view(), name='hospital-detail'),
    path('<uuid:pk>/update/', views.HospitalUpdateView.as_view(), name='hospital-update'),
    path('<uuid:pk>/verify/', views.HospitalVerifyView.as_view(), name='hospital-verify'),
    path('<uuid:pk>/availability/', views.HospitalAvailabilityView.as_view(), name='hospital-availability'),
]
