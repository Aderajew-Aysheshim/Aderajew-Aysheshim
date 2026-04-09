import uuid
from django.db import models
from django.conf import settings


class GPSTracking(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    ambulance = models.ForeignKey(
        'ambulances.Ambulance', on_delete=models.CASCADE, related_name='gps_tracks'
    )
    emergency = models.ForeignKey(
        'emergencies.EmergencyRequest', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='gps_tracks'
    )
    latitude = models.FloatField()
    longitude = models.FloatField()
    speed = models.FloatField(null=True, blank=True)
    heading = models.FloatField(null=True, blank=True)
    accuracy = models.FloatField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'gps_tracking'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['ambulance', '-timestamp']),
            models.Index(fields=['emergency', '-timestamp']),
        ]

    def __str__(self):
        return f"GPS: {self.ambulance} at ({self.latitude}, {self.longitude})"


class RoutePoint(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    emergency = models.ForeignKey(
        'emergencies.EmergencyRequest', on_delete=models.CASCADE, related_name='route_points'
    )
    latitude = models.FloatField()
    longitude = models.FloatField()
    sequence = models.PositiveIntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'route_points'
        ordering = ['sequence']

    def __str__(self):
        return f"Route point #{self.sequence} for {self.emergency}"
