from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GPSTracking, RoutePoint
from .serializers import GPSTrackingSerializer, RoutePointSerializer


class GPSTrackingCreateView(APIView):
    def post(self, request):
        serializer = GPSTrackingSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EmergencyTrackingHistoryView(generics.ListAPIView):
    serializer_class = GPSTrackingSerializer

    def get_queryset(self):
        emergency_id = self.kwargs['emergency_id']
        return GPSTracking.objects.filter(emergency_id=emergency_id)


class AmbulanceTrackingHistoryView(generics.ListAPIView):
    serializer_class = GPSTrackingSerializer

    def get_queryset(self):
        ambulance_id = self.kwargs['ambulance_id']
        return GPSTracking.objects.filter(ambulance_id=ambulance_id).order_by('-timestamp')[:100]


class AmbulanceLatestLocationView(APIView):
    def get(self, request, ambulance_id):
        try:
            latest = GPSTracking.objects.filter(
                ambulance_id=ambulance_id
            ).latest('timestamp')
            return Response(GPSTrackingSerializer(latest).data)
        except GPSTracking.DoesNotExist:
            return Response({'error': 'No tracking data found'}, status=status.HTTP_404_NOT_FOUND)


class EmergencyRouteView(generics.ListAPIView):
    serializer_class = RoutePointSerializer

    def get_queryset(self):
        emergency_id = self.kwargs['emergency_id']
        return RoutePoint.objects.filter(emergency_id=emergency_id)
