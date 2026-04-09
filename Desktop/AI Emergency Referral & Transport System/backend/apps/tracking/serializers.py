from rest_framework import serializers
from .models import GPSTracking, RoutePoint


class GPSTrackingSerializer(serializers.ModelSerializer):
    class Meta:
        model = GPSTracking
        fields = ['id', 'ambulance', 'emergency', 'latitude', 'longitude', 'speed', 'heading', 'accuracy', 'timestamp']
        read_only_fields = ['id', 'timestamp']


class RoutePointSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoutePoint
        fields = ['id', 'latitude', 'longitude', 'sequence', 'timestamp']
