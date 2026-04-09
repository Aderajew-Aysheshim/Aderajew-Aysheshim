from rest_framework import serializers
from .models import Ambulance, Driver


class AmbulanceListSerializer(serializers.ModelSerializer):
    driver_name = serializers.SerializerMethodField()
    distance_km = serializers.FloatField(read_only=True, required=False)

    class Meta:
        model = Ambulance
        fields = [
            'id', 'plate_number', 'ambulance_type', 'status',
            'latitude', 'longitude', 'phone', 'organization',
            'verification_status', 'driver_name', 'distance_km', 'image'
        ]

    def get_driver_name(self, obj):
        try:
            return obj.driver.user.name if obj.driver else None
        except Driver.DoesNotExist:
            return None


class AmbulanceDetailSerializer(serializers.ModelSerializer):
    driver = serializers.SerializerMethodField()

    class Meta:
        model = Ambulance
        fields = '__all__'
        read_only_fields = ['id', 'verification_status', 'verified_by', 'verified_at', 'created_at', 'updated_at']

    def get_driver(self, obj):
        try:
            return DriverSerializer(obj.driver).data if obj.driver else None
        except Driver.DoesNotExist:
            return None


class AmbulanceRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambulance
        fields = [
            'plate_number', 'ambulance_type', 'phone',
            'organization', 'equipment', 'image'
        ]


class AmbulanceVerificationSerializer(serializers.Serializer):
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    reason = serializers.CharField(required=False, allow_blank=True)


class DriverSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.name', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)

    class Meta:
        model = Driver
        fields = [
            'id', 'name', 'phone', 'license_number', 'license_expiry',
            'experience_years', 'is_on_duty', 'verification_status'
        ]
        read_only_fields = ['id', 'verification_status']


class DriverRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = ['license_number', 'license_expiry', 'experience_years', 'ambulance']
