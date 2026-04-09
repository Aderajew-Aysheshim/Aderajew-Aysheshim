from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from .models import EmergencyRequest, EmergencyStatusLog, HospitalSuggestion
from .serializers import (
    EmergencyCreateSerializer,
    EmergencyListSerializer,
    EmergencyDetailSerializer,
    EmergencyUpdateStatusSerializer,
    SelectHospitalSerializer,
)
from .dispatch import find_nearest_ambulance, suggest_hospitals, estimate_arrival_time
from apps.hospitals.models import Hospital


class EmergencyCreateView(APIView):
    def post(self, request):
        serializer = EmergencyCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        emergency = serializer.save(user=request.user)

        EmergencyStatusLog.objects.create(
            emergency=emergency,
            status='requested',
            message='Emergency request created',
            changed_by=request.user,
            latitude=emergency.pickup_latitude,
            longitude=emergency.pickup_longitude
        )

        nearest_ambulance = find_nearest_ambulance(
            emergency.pickup_latitude,
            emergency.pickup_longitude
        )

        if nearest_ambulance:
            emergency.ambulance = nearest_ambulance
            emergency.status = 'dispatched'
            emergency.dispatched_at = timezone.now()

            if hasattr(nearest_ambulance, 'distance_km'):
                emergency.estimated_arrival_minutes = estimate_arrival_time(nearest_ambulance.distance_km)

            emergency.save()

            nearest_ambulance.status = 'en_route'
            nearest_ambulance.save()

            EmergencyStatusLog.objects.create(
                emergency=emergency,
                status='dispatched',
                message=f'Ambulance {nearest_ambulance.plate_number} dispatched. ETA: {emergency.estimated_arrival_minutes} mins',
                changed_by=request.user
            )

        suggestions = suggest_hospitals(
            emergency.pickup_latitude,
            emergency.pickup_longitude,
            emergency_type=emergency.emergency_type
        )

        for suggestion in suggestions:
            HospitalSuggestion.objects.create(
                emergency=emergency,
                hospital=suggestion['hospital'],
                distance_km=suggestion['distance_km'],
                score=suggestion['score'],
                reason=suggestion['reason']
            )

        return Response(
            EmergencyDetailSerializer(emergency).data,
            status=status.HTTP_201_CREATED
        )


class EmergencyListView(generics.ListAPIView):
    serializer_class = EmergencyListSerializer

    def get_queryset(self):
        queryset = EmergencyRequest.objects.filter(user=self.request.user)

        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)

        active = self.request.query_params.get('active')
        if active:
            queryset = queryset.exclude(status__in=['completed', 'cancelled'])

        return queryset


class EmergencyDetailView(generics.RetrieveAPIView):
    serializer_class = EmergencyDetailSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return EmergencyRequest.objects.all()
        return EmergencyRequest.objects.filter(user=self.request.user)


class EmergencyUpdateStatusView(APIView):
    def post(self, request, pk):
        try:
            if request.user.is_staff or request.user.role == 'driver':
                emergency = EmergencyRequest.objects.get(pk=pk)
            else:
                emergency = EmergencyRequest.objects.get(pk=pk, user=request.user)
        except EmergencyRequest.DoesNotExist:
            return Response({'error': 'Emergency not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = EmergencyUpdateStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data['status']
        emergency.status = new_status

        if new_status == 'completed':
            emergency.completed_at = timezone.now()
            if emergency.ambulance:
                emergency.ambulance.status = 'available'
                emergency.ambulance.save()
        elif new_status == 'cancelled':
            emergency.cancelled_at = timezone.now()
            if emergency.ambulance:
                emergency.ambulance.status = 'available'
                emergency.ambulance.save()

        emergency.save()

        EmergencyStatusLog.objects.create(
            emergency=emergency,
            status=new_status,
            message=serializer.validated_data.get('message', ''),
            changed_by=request.user,
            latitude=serializer.validated_data.get('latitude'),
            longitude=serializer.validated_data.get('longitude')
        )

        return Response(EmergencyDetailSerializer(emergency).data)


class EmergencySelectHospitalView(APIView):
    def post(self, request, pk):
        try:
            emergency = EmergencyRequest.objects.get(pk=pk, user=request.user)
        except EmergencyRequest.DoesNotExist:
            return Response({'error': 'Emergency not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SelectHospitalSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            hospital = Hospital.objects.get(pk=serializer.validated_data['hospital_id'])
        except Hospital.DoesNotExist:
            return Response({'error': 'Hospital not found'}, status=status.HTTP_404_NOT_FOUND)

        emergency.hospital = hospital
        emergency.destination_latitude = hospital.latitude
        emergency.destination_longitude = hospital.longitude
        emergency.save()

        HospitalSuggestion.objects.filter(
            emergency=emergency
        ).update(is_selected=False)

        HospitalSuggestion.objects.filter(
            emergency=emergency, hospital=hospital
        ).update(is_selected=True)

        EmergencyStatusLog.objects.create(
            emergency=emergency,
            status=emergency.status,
            message=f'Hospital selected: {hospital.name}',
            changed_by=request.user
        )

        return Response(EmergencyDetailSerializer(emergency).data)


class EmergencyCancelView(APIView):
    def post(self, request, pk):
        try:
            emergency = EmergencyRequest.objects.get(pk=pk, user=request.user)
        except EmergencyRequest.DoesNotExist:
            return Response({'error': 'Emergency not found'}, status=status.HTTP_404_NOT_FOUND)

        if emergency.status in ['completed', 'cancelled']:
            return Response({'error': 'Cannot cancel this emergency'}, status=status.HTTP_400_BAD_REQUEST)

        emergency.status = 'cancelled'
        emergency.cancelled_at = timezone.now()
        emergency.save()

        if emergency.ambulance:
            emergency.ambulance.status = 'available'
            emergency.ambulance.save()

        EmergencyStatusLog.objects.create(
            emergency=emergency,
            status='cancelled',
            message='Emergency cancelled by user',
            changed_by=request.user
        )

        return Response({'message': 'Emergency cancelled'})


class ActiveEmergenciesView(generics.ListAPIView):
    serializer_class = EmergencyListSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return EmergencyRequest.objects.exclude(
            status__in=['completed', 'cancelled']
        )


class AllEmergenciesView(generics.ListAPIView):
    serializer_class = EmergencyListSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = EmergencyRequest.objects.all()
