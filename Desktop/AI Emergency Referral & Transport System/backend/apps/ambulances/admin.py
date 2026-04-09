from django.contrib import admin
from .models import Ambulance, Driver


@admin.register(Ambulance)
class AmbulanceAdmin(admin.ModelAdmin):
    list_display = ['plate_number', 'ambulance_type', 'status', 'phone', 'organization', 'verification_status']
    list_filter = ['verification_status', 'ambulance_type', 'status']
    search_fields = ['plate_number', 'organization', 'phone']
    list_editable = ['verification_status', 'status']
    readonly_fields = ['id', 'created_at', 'updated_at', 'verified_by', 'verified_at']

    actions = ['approve_ambulances', 'reject_ambulances', 'set_available', 'set_offline']

    @admin.action(description='Approve selected ambulances')
    def approve_ambulances(self, request, queryset):
        queryset.update(verification_status='approved', verified_by=request.user)

    @admin.action(description='Reject selected ambulances')
    def reject_ambulances(self, request, queryset):
        queryset.update(verification_status='rejected')

    @admin.action(description='Set status to Available')
    def set_available(self, request, queryset):
        queryset.update(status='available')

    @admin.action(description='Set status to Offline')
    def set_offline(self, request, queryset):
        queryset.update(status='offline')


@admin.register(Driver)
class DriverAdmin(admin.ModelAdmin):
    list_display = ['user', 'license_number', 'ambulance', 'is_on_duty', 'verification_status', 'experience_years']
    list_filter = ['verification_status', 'is_on_duty']
    search_fields = ['user__name', 'license_number']
    list_editable = ['verification_status']

    actions = ['approve_drivers', 'reject_drivers']

    @admin.action(description='Approve selected drivers')
    def approve_drivers(self, request, queryset):
        queryset.update(verification_status='approved', verified_by=request.user)

    @admin.action(description='Reject selected drivers')
    def reject_drivers(self, request, queryset):
        queryset.update(verification_status='rejected')
