from django.contrib import admin
from .models import Hospital


@admin.register(Hospital)
class HospitalAdmin(admin.ModelAdmin):
    list_display = ['name', 'facility_type', 'city', 'phone', 'verification_status', 'is_available', 'available_beds', 'has_emergency']
    list_filter = ['verification_status', 'facility_type', 'is_available', 'has_emergency', 'has_icu', 'city']
    search_fields = ['name', 'city', 'address']
    list_editable = ['verification_status', 'is_available']
    readonly_fields = ['id', 'created_at', 'updated_at', 'verified_by', 'verified_at']
    fieldsets = (
        ('Basic Info', {'fields': ('id', 'name', 'facility_type', 'description', 'image')}),
        ('Location', {'fields': ('address', 'city', 'region', 'latitude', 'longitude')}),
        ('Contact', {'fields': ('phone', 'email', 'website')}),
        ('Medical', {'fields': ('specialties', 'services', 'capacity', 'available_beds', 'has_emergency', 'has_icu', 'has_surgery', 'operating_hours')}),
        ('Verification', {'fields': ('verification_status', 'verified_by', 'verified_at', 'admin_user')}),
        ('Status', {'fields': ('is_available', 'created_at', 'updated_at')}),
    )

    actions = ['approve_hospitals', 'reject_hospitals']

    @admin.action(description='Approve selected hospitals')
    def approve_hospitals(self, request, queryset):
        queryset.update(verification_status='approved', verified_by=request.user)

    @admin.action(description='Reject selected hospitals')
    def reject_hospitals(self, request, queryset):
        queryset.update(verification_status='rejected')
