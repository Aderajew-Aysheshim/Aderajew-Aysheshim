from rest_framework import serializers
from .models import Hospital


class HospitalListSerializer(serializers.ModelSerializer):
    distance_km = serializers.FloatField(read_only=True, required=False)

    class Meta:
        model = Hospital
        fields = [
            'id', 'name', 'facility_type', 'address', 'city', 'latitude',
            'longitude', 'phone', 'has_emergency', 'has_icu', 'has_surgery',
            'specialties', 'available_beds', 'is_available',
            'verification_status', 'image', 'distance_km'
        ]


class HospitalDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'
        read_only_fields = ['id', 'verification_status', 'verified_by', 'verified_at', 'created_at', 'updated_at']


class HospitalRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = [
            'name', 'facility_type', 'address', 'city', 'region',
            'latitude', 'longitude', 'phone', 'email', 'website',
            'description', 'specialties', 'services', 'capacity',
            'has_emergency', 'has_icu', 'has_surgery', 'operating_hours', 'image'
        ]


class HospitalVerificationSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    reason = serializers.CharField(required=False, allow_blank=True)
