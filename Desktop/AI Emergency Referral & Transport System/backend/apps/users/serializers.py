from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import EmergencyContact, OTPVerification

User = get_user_model()


class UserRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['phone', 'name', 'password']
        extra_kwargs = {'password': {'write_only': True, 'required': False}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create_user(**validated_data)
        if password:
            user.set_password(password)
            user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    emergency_contacts = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'phone', 'name', 'age', 'blood_type',
            'medical_history', 'allergies', 'role', 'latitude',
            'longitude', 'is_verified', 'preferred_language',
            'profile_image', 'emergency_contacts', 'created_at'
        ]
        read_only_fields = ['id', 'phone', 'is_verified', 'created_at']

    def get_emergency_contacts(self, obj):
        contacts = obj.emergency_contacts.all()
        return EmergencyContactSerializer(contacts, many=True).data


class UserLocationSerializer(serializers.Serializer):
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()


class EmergencyContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyContact
        fields = ['id', 'name', 'phone', 'relationship', 'is_primary', 'created_at']
        read_only_fields = ['id', 'created_at']


class OTPRequestSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)


class OTPVerifySerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    otp = serializers.CharField(max_length=6)


class PhoneLoginSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=20)
    otp = serializers.CharField(max_length=6)
