from django.contrib import admin
from .models import GPSTracking, RoutePoint


@admin.register(GPSTracking)
class GPSTrackingAdmin(admin.ModelAdmin):
    list_display = ['ambulance', 'emergency', 'latitude', 'longitude', 'speed', 'timestamp']
    list_filter = ['ambulance', 'timestamp']
    readonly_fields = ['id', 'timestamp']


@admin.register(RoutePoint)
class RoutePointAdmin(admin.ModelAdmin):
    list_display = ['emergency', 'sequence', 'latitude', 'longitude', 'timestamp']
    list_filter = ['emergency']
    readonly_fields = ['id', 'timestamp']
