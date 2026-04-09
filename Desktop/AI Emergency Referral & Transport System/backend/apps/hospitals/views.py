from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from haversine import haversine, Unit
from .models import Hospital
from .serializers import (
    HospitalListSerializer,
    HospitalDetailSerializer,
    HospitalRegistrationSerializer,
    HospitalVerificationSerializer,
)


class HospitalListView(generics.ListAPIView):
    serializer_class = HospitalListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Hospital.objects.filter(verification_status='approved')

        facility_type = self.request.query_params.get('type')
        if facility_type:
            queryset = queryset.filter(facility_type=facility_type)

        city = self.request.query_params.get('city')
        if city:
            queryset = queryset.filter(city__icontains=city)

        has_emergency = self.request.query_params.get('has_emergency')
        if has_emergency:
            queryset = queryset.filter(has_emergency=True)

        has_icu = self.request.query_params.get('has_icu')
        if has_icu:
            queryset = queryset.filter(has_icu=True)

        specialty = self.request.query_params.get('specialty')
        if specialty:
            queryset = queryset.filter(specialties__contains=[specialty])

        available = self.request.query_params.get('available')
        if available:
            queryset = queryset.filter(is_available=True)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)

        return queryset


class HospitalNearbyView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        lat = request.query_params.get('lat')
        lng = request.query_params.get('lng')
        radius_km = float(request.query_params.get('radius', 10))

        if not lat or not lng:
            return Response(
                {'error': 'lat and lng parameters are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user_location = (float(lat), float(lng))
        hospitals = Hospital.objects.filter(
            verification_status='approved',
            is_available=True
        )

        nearby = []
        for hospital in hospitals:
            hospital_location = (hospital.latitude, hospital.longitude)
            distance = haversine(user_location, hospital_location, unit=Unit.KILOMETERS)
            if distance <= radius_km:
                hospital.distance_km = round(distance, 2)
                nearby.append(hospital)

        nearby.sort(key=lambda h: h.distance_km)
        serializer = HospitalListSerializer(nearby, many=True)
        return Response(serializer.data)


class HospitalDetailView(generics.RetrieveAPIView):
    queryset = Hospital.objects.all()
    serializer_class = HospitalDetailSerializer
    permission_classes = [permissions.AllowAny]


class HospitalRegisterView(generics.CreateAPIView):
    serializer_class = HospitalRegistrationSerializer

    def perform_create(self, serializer):
        serializer.save(admin_user=self.request.user)


class HospitalUpdateView(generics.UpdateAPIView):
    serializer_class = HospitalDetailSerializer

    def get_queryset(self):
        return Hospital.objects.filter(admin_user=self.request.user)


class HospitalVerifyView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            hospital = Hospital.objects.get(pk=pk)
        except Hospital.DoesNotExist:
            return Response({'error': 'Hospital not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = HospitalVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        action = serializer.validated_data['action']
        if action == 'approve':
            hospital.verification_status = 'approved'
            hospital.verified_by = request.user
            hospital.verified_at = timezone.now()
        else:
            hospital.verification_status = 'rejected'

        hospital.save()
        return Response({
            'message': f'Hospital {action}d successfully',
            'hospital': HospitalDetailSerializer(hospital).data
        })


class HospitalAvailabilityView(APIView):
    def post(self, request, pk):
        try:
            hospital = Hospital.objects.get(pk=pk, admin_user=request.user)
        except Hospital.DoesNotExist:
            return Response({'error': 'Hospital not found'}, status=status.HTTP_404_NOT_FOUND)

        hospital.is_available = request.data.get('is_available', True)
        hospital.available_beds = request.data.get('available_beds', hospital.available_beds)
        hospital.save()

        return Response({'message': 'Availability updated', 'hospital': HospitalDetailSerializer(hospital).data})
