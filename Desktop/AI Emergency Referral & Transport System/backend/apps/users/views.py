from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import EmergencyContact, OTPVerification
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    UserLocationSerializer,
    EmergencyContactSerializer,
    OTPRequestSerializer,
    OTPVerifySerializer,
    PhoneLoginSerializer,
)

User = get_user_model()


class RequestOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone = serializer.validated_data['phone']

        OTPVerification.objects.filter(phone=phone, is_used=False).update(is_used=True)

        otp_obj = OTPVerification.objects.create(phone=phone)

        # In production, send OTP via SMS (Twilio, Africa's Talking, etc.)
        # For development, return OTP in response
        return Response({
            'message': 'OTP sent successfully',
            'otp': otp_obj.otp,  # Remove in production
            'expires_in_minutes': 5
        }, status=status.HTTP_200_OK)


class VerifyOTPView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = OTPVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data['phone']
        otp = serializer.validated_data['otp']

        try:
            otp_obj = OTPVerification.objects.filter(
                phone=phone, otp=otp, is_used=False
            ).latest('created_at')
        except OTPVerification.DoesNotExist:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        if not otp_obj.is_valid:
            return Response({'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)

        otp_obj.is_used = True
        otp_obj.save()

        return Response({'message': 'OTP verified successfully', 'verified': True})


class PhoneLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PhoneLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        phone = serializer.validated_data['phone']
        otp = serializer.validated_data['otp']

        try:
            otp_obj = OTPVerification.objects.filter(
                phone=phone, otp=otp, is_used=False
            ).latest('created_at')
        except OTPVerification.DoesNotExist:
            return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)

        if not otp_obj.is_valid:
            return Response({'error': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)

        otp_obj.is_used = True
        otp_obj.save()

        user, created = User.objects.get_or_create(phone=phone)
        if created:
            user.is_verified = True
            user.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Login successful',
            'is_new_user': created,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'user': UserProfileSerializer(user).data
        })


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'message': 'Registration successful',
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'user': UserProfileSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user


class UpdateLocationView(APIView):
    def post(self, request):
        serializer = UserLocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        request.user.latitude = serializer.validated_data['latitude']
        request.user.longitude = serializer.validated_data['longitude']
        request.user.save(update_fields=['latitude', 'longitude'])

        return Response({'message': 'Location updated'})


class EmergencyContactListCreateView(generics.ListCreateAPIView):
    serializer_class = EmergencyContactSerializer

    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class EmergencyContactDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EmergencyContactSerializer

    def get_queryset(self):
        return EmergencyContact.objects.filter(user=self.request.user)
