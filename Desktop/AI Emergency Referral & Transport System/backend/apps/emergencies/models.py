import uuid
from django.db import models
from django.conf import settings


class EmergencyRequest(models.Model):
    PRIORITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]

    STATUS_CHOICES = [
        ('requested', 'Requested'),
        ('dispatched', 'Dispatched'),
        ('ambulance_en_route', 'Ambulance En Route'),
        ('ambulance_arrived', 'Ambulance Arrived'),
        ('patient_picked_up', 'Patient Picked Up'),
        ('en_route_hospital', 'En Route to Hospital'),
        ('arrived_hospital', 'Arrived at Hospital'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]

    EMERGENCY_TYPES = [
        ('accident', 'Traffic Accident'),
        ('cardiac', 'Cardiac Emergency'),
        ('respiratory', 'Respiratory Emergency'),
        ('trauma', 'Trauma/Injury'),
        ('stroke', 'Stroke'),
        ('burn', 'Burn'),
        ('poisoning', 'Poisoning'),
        ('pregnancy', 'Pregnancy/Childbirth'),
        ('pediatric', 'Pediatric Emergency'),
        ('mental_health', 'Mental Health Crisis'),
        ('allergic', 'Allergic Reaction'),
        ('bleeding', 'Severe Bleeding'),
        ('unconscious', 'Unconscious Person'),
        ('other', 'Other'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='emergency_requests')
    ambulance = models.ForeignKey(
        'ambulances.Ambulance', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='emergency_requests'
    )
    hospital = models.ForeignKey(
        'hospitals.Hospital', on_delete=models.SET_NULL,
        null=True, blank=True, related_name='emergency_requests'
    )
    emergency_type = models.CharField(max_length=20, choices=EMERGENCY_TYPES, default='other')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='requested')
    description = models.TextField(blank=True)
    pickup_latitude = models.FloatField()
    pickup_longitude = models.FloatField()
    pickup_address = models.TextField(blank=True)
    destination_latitude = models.FloatField(null=True, blank=True)
    destination_longitude = models.FloatField(null=True, blank=True)
    patient_name = models.CharField(max_length=150, blank=True)
    patient_age = models.PositiveIntegerField(null=True, blank=True)
    patient_condition = models.TextField(blank=True)
    ai_generated = models.BooleanField(default=False)
    ai_raw_input = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    estimated_arrival_minutes = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    dispatched_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'emergency_requests'
        ordering = ['-created_at']

    def __str__(self):
        return f"Emergency #{str(self.id)[:8]} - {self.get_emergency_type_display()} ({self.get_status_display()})"


class EmergencyStatusLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    emergency = models.ForeignKey(EmergencyRequest, on_delete=models.CASCADE, related_name='status_logs')
    status = models.CharField(max_length=20)
    message = models.TextField(blank=True)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True
    )
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'emergency_status_logs'
        ordering = ['created_at']

    def __str__(self):
        return f"{self.emergency} -> {self.status}"


class HospitalSuggestion(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    emergency = models.ForeignKey(EmergencyRequest, on_delete=models.CASCADE, related_name='hospital_suggestions')
    hospital = models.ForeignKey('hospitals.Hospital', on_delete=models.CASCADE)
    distance_km = models.FloatField()
    score = models.FloatField(default=0)
    reason = models.TextField(blank=True)
    is_selected = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'hospital_suggestions'
        ordering = ['score']

    def __str__(self):
        return f"{self.hospital.name} for {self.emergency}"
