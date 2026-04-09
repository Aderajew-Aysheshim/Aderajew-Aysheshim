import uuid
from django.db import models
from django.conf import settings


class Hospital(models.Model):
    VERIFICATION_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    FACILITY_TYPE = [
        ('hospital', 'Hospital'),
        ('clinic', 'Clinic'),
        ('health_center', 'Health Center'),
        ('specialized', 'Specialized Center'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    facility_type = models.CharField(max_length=20, choices=FACILITY_TYPE, default='hospital')
    address = models.TextField()
    city = models.CharField(max_length=100)
    region = models.CharField(max_length=100, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    description = models.TextField(blank=True)
    specialties = models.JSONField(default=list, blank=True)
    services = models.JSONField(default=list, blank=True)
    capacity = models.PositiveIntegerField(default=0)
    available_beds = models.PositiveIntegerField(default=0)
    has_emergency = models.BooleanField(default=True)
    has_icu = models.BooleanField(default=False)
    has_surgery = models.BooleanField(default=False)
    operating_hours = models.JSONField(default=dict, blank=True)
    image = models.ImageField(upload_to='hospitals/', null=True, blank=True)
    verification_status = models.CharField(max_length=10, choices=VERIFICATION_STATUS, default='pending')
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='verified_hospitals'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    is_available = models.BooleanField(default=True)
    admin_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='managed_hospitals'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hospitals'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.city})"

    @property
    def is_verified(self):
        return self.verification_status == 'approved'
