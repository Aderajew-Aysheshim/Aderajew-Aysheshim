from django.contrib import admin
from .models import EmergencyRequest, EmergencyStatusLog, HospitalSuggestion


class StatusLogInline(admin.TabularInline):
    model = EmergencyStatusLog
    extra = 0
    readonly_fields = ['id', 'status', 'message', 'changed_by', 'latitude', 'longitude', 'created_at']


class HospitalSuggestionInline(admin.TabularInline):
    model = HospitalSuggestion
    extra = 0
    readonly_fields = ['hospital', 'distance_km', 'score', 'reason', 'is_selected']


@admin.register(EmergencyRequest)
class EmergencyRequestAdmin(admin.ModelAdmin):
    list_display = [
        'short_id', 'emergency_type', 'priority', 'status',
        'user', 'ambulance', 'hospital', 'created_at'
    ]
    list_filter = ['status', 'priority', 'emergency_type', 'ai_generated']
    search_fields = ['id', 'user__phone', 'user__name', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at', 'dispatched_at', 'completed_at', 'cancelled_at']
    list_editable = ['status', 'priority']
    inlines = [StatusLogInline, HospitalSuggestionInline]

    fieldsets = (
        ('Emergency Info', {'fields': ('id', 'user', 'emergency_type', 'priority', 'status', 'description')}),
        ('Location', {'fields': ('pickup_latitude', 'pickup_longitude', 'pickup_address', 'destination_latitude', 'destination_longitude')}),
        ('Assignment', {'fields': ('ambulance', 'hospital', 'estimated_arrival_minutes')}),
        ('Patient', {'fields': ('patient_name', 'patient_age', 'patient_condition')}),
        ('AI Data', {'fields': ('ai_generated', 'ai_raw_input')}),
        ('Timestamps', {'fields': ('created_at', 'dispatched_at', 'completed_at', 'cancelled_at', 'updated_at')}),
        ('Notes', {'fields': ('notes',)}),
    )

    def short_id(self, obj):
        return str(obj.id)[:8]
    short_id.short_description = 'ID'


@admin.register(EmergencyStatusLog)
class EmergencyStatusLogAdmin(admin.ModelAdmin):
    list_display = ['emergency', 'status', 'message', 'changed_by', 'created_at']
    list_filter = ['status']
    readonly_fields = ['id', 'created_at']
