from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, EmergencyContact, OTPVerification


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['phone', 'name', 'role', 'blood_type', 'is_verified', 'is_active', 'created_at']
    list_filter = ['role', 'is_verified', 'is_active', 'blood_type']
    search_fields = ['phone', 'name']
    ordering = ['-created_at']
    fieldsets = (
        (None, {'fields': ('phone', 'password')}),
        ('Personal Info', {'fields': ('name', 'age', 'blood_type', 'medical_history', 'allergies', 'profile_image', 'preferred_language')}),
        ('Location', {'fields': ('latitude', 'longitude')}),
        ('Permissions', {'fields': ('role', 'is_verified', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('phone', 'name', 'password1', 'password2', 'role'),
        }),
    )


@admin.register(EmergencyContact)
class EmergencyContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'relationship', 'user', 'is_primary']
    list_filter = ['is_primary']
    search_fields = ['name', 'phone']


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ['phone', 'otp', 'is_used', 'created_at', 'expires_at']
    list_filter = ['is_used']
    search_fields = ['phone']
