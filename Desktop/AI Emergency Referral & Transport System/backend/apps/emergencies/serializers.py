from rest_framework import serializers
from .models import EmergencyRequest, EmergencyStatusLog, HospitalSuggestion
from apps.users.serializers import UserProfileSerializer
from apps.ambulances.serializers import AmbulanceListSerializer
from apps.hospitals.serializers import HospitalListSerializer


class EmergencyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyRequest
        fields = [
            'emergency_type', 'priority', 'description',
            'pickup_latitude', 'pickup_longitude', 'pickup_address',
            'patient_name', 'patient_age', 'patient_condition',
            'ai_generated', 'ai_raw_input'
        ]


class EmergencyStatusLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyStatusLog
        fields = ['id', 'status', 'message', 'latitude', 'longitude', 'created_at']


class HospitalSuggestionSerializer(serializers.ModelSerializer):
    hospital = HospitalListSerializer()

    class Meta:
        model = HospitalSuggestion
        fields = ['id', 'hospital', 'distance_km', 'score', 'reason', 'is_selected']


class EmergencyListSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyRequest
        fields = [
            'id', 'emergency_type', 'priority', 'status',
            'pickup_latitude', 'pickup_longitude', 'pickup_address',
            'created_at', 'estimated_arrival_minutes'
        ]


class EmergencyDetailSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    ambulance = AmbulanceListSerializer(read_only=True)
    hospital = HospitalListSerializer(read_only=True)
    status_logs = EmergencyStatusLogSerializer(many=True, read_only=True)
    hospital_suggestions = HospitalSuggestionSerializer(many=True, read_only=True)

    class Meta:
        model = EmergencyRequest
        fields = '__all__'


class EmergencyUpdateStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=EmergencyRequest.STATUS_CHOICES)
    message = serializers.CharField(required=False, allow_blank=True)
    latitude = serializers.FloatField(required=False)
    longitude = serializers.FloatField(required=False)


class SelectHospitalSerializer(serializers.Serializer):
    hospital_id = serializers.UUIDField()
