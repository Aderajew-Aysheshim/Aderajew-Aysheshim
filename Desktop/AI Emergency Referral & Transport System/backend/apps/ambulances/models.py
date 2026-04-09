import uuid
from django.db import models
from django.conf import settings


class Ambulance(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('en_route', 'En Route'),
        ('busy', 'Busy'),
        ('offline', 'Offline'),
        ('maintenance', 'Under Maintenance'),
    ]

    TYPE_CHOICES = [
        ('basic', 'Basic Life Support'),
        ('advanced', 'Advanced Life Support'),
        ('icu_mobile', 'Mobile ICU'),
        ('neonatal', 'Neonatal'),
        ('patient_transport', 'Patient Transport'),
    ]

    VERIFICATION_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    plate_number = models.CharField(max_length=20, unique=True)
    ambulance_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='basic')
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='offline')
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    equipment = models.JSONField(default=list, blank=True)
    phone = models.CharField(max_length=20)
    organization = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to='ambulances/', null=True, blank=True)
    verification_status = models.CharField(max_length=10, choices=VERIFICATION_STATUS, default='pending')
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='verified_ambulances'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'ambulances'
        ordering = ['plate_number']

    def __str__(self):
        return f"{self.plate_number} ({self.get_ambulance_type_display()})"

    @property
    def is_verified(self):
        return self.verification_status == 'approved'


class Driver(models.Model):
    VERIFICATION_STATUS = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='driver_profile')
    ambulance = models.OneToOneField(Ambulance, on_delete=models.SET_NULL, null=True, blank=True, related_name='driver')
    license_number = models.CharField(max_length=50)
    license_expiry = models.DateField(null=True, blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    is_on_duty = models.BooleanField(default=False)
    verification_status = models.CharField(max_length=10, choices=VERIFICATION_STATUS, default='pending')
    verified_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='verified_drivers'
    )
    verified_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'drivers'

    def __str__(self):
        return f"Driver {self.user.name} - {self.license_number}"

    @property
    def is_verified(self):
        return self.verification_status == 'approved'
