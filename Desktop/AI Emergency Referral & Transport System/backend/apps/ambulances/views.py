from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils import timezone
from haversine import haversine, Unit
from .models import Ambulance, Driver
from .serializers import (
    AmbulanceListSerializer,
    AmbulanceDetailSerializer,
    AmbulanceRegistrationSerializer,
    AmbulanceVerificationSerializer,
    DriverSerializer,
    DriverRegistrationSerializer,
)


class AmbulanceListView(generics.ListAPIView):
    serializer_class = AmbulanceListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Ambulance.objects.filter(verification_status='approved')

        ambulance_type = self.request.query_params.get('type')
        if ambulance_type:
            queryset = queryset.filter(ambulance_type=ambulance_type)

        ambulance_status = self.request.query_params.get('status')
        if ambulance_status:
            queryset = queryset.filter(status=ambulance_status)

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(plate_number__icontains=search)

        return queryset


class AmbulanceNearbyView(APIView):
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
        ambulances = Ambulance.objects.filter(
            verification_status='approved',
            status='available',
            latitude__isnull=False,
            longitude__isnull=False
        )

        nearby = []
        for ambulance in ambulances:
            amb_location = (ambulance.latitude, ambulance.longitude)
            distance = haversine(user_location, amb_location, unit=Unit.KILOMETERS)
            if distance <= radius_km:
                ambulance.distance_km = round(distance, 2)
                nearby.append(ambulance)

        nearby.sort(key=lambda a: a.distance_km)
        serializer = AmbulanceListSerializer(nearby, many=True)
        return Response(serializer.data)


class AmbulanceDetailView(generics.RetrieveAPIView):
    queryset = Ambulance.objects.all()
    serializer_class = AmbulanceDetailSerializer
    permission_classes = [permissions.AllowAny]


class AmbulanceRegisterView(generics.CreateAPIView):
    serializer_class = AmbulanceRegistrationSerializer


class AmbulanceUpdateView(generics.UpdateAPIView):
    queryset = Ambulance.objects.all()
    serializer_class = AmbulanceDetailSerializer


class AmbulanceStatusView(APIView):
    def post(self, request, pk):
        try:
            ambulance = Ambulance.objects.get(pk=pk)
        except Ambulance.DoesNotExist:
            return Response({'error': 'Ambulance not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in dict(Ambulance.STATUS_CHOICES):
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        ambulance.status = new_status
        ambulance.save()
        return Response({'message': 'Status updated', 'status': new_status})


class AmbulanceLocationView(APIView):
    def post(self, request, pk):
        try:
            ambulance = Ambulance.objects.get(pk=pk)
        except Ambulance.DoesNotExist:
            return Response({'error': 'Ambulance not found'}, status=status.HTTP_404_NOT_FOUND)

        ambulance.latitude = request.data.get('latitude')
        ambulance.longitude = request.data.get('longitude')
        ambulance.save(update_fields=['latitude', 'longitude'])
        return Response({'message': 'Location updated'})


class AmbulanceVerifyView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            ambulance = Ambulance.objects.get(pk=pk)
        except Ambulance.DoesNotExist:
            return Response({'error': 'Ambulance not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = AmbulanceVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        action = serializer.validated_data['action']
        if action == 'approve':
            ambulance.verification_status = 'approved'
            ambulance.verified_by = request.user
            ambulance.verified_at = timezone.now()
        else:
            ambulance.verification_status = 'rejected'

        ambulance.save()
        return Response({
            'message': f'Ambulance {action}d successfully',
            'ambulance': AmbulanceDetailSerializer(ambulance).data
        })


class DriverRegisterView(generics.CreateAPIView):
    serializer_class = DriverRegistrationSerializer

    def perform_create(self, serializer):
        self.request.user.role = 'driver'
        self.request.user.save()
        serializer.save(user=self.request.user)


class DriverProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = DriverSerializer

    def get_object(self):
        return Driver.objects.get(user=self.request.user)


class DriverVerifyView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def post(self, request, pk):
        try:
            driver = Driver.objects.get(pk=pk)
        except Driver.DoesNotExist:
            return Response({'error': 'Driver not found'}, status=status.HTTP_404_NOT_FOUND)

        action = request.data.get('action')
        if action == 'approve':
            driver.verification_status = 'approved'
            driver.verified_by = request.user
            driver.verified_at = timezone.now()
        elif action == 'reject':
            driver.verification_status = 'rejected'

        driver.save()
        return Response({'message': f'Driver {action}d', 'driver': DriverSerializer(driver).data})
