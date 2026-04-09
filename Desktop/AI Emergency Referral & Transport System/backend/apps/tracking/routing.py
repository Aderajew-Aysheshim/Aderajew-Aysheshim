from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/tracking/emergency/(?P<emergency_id>[0-9a-f-]+)/$', consumers.EmergencyTrackingConsumer.as_asgi()),
    re_path(r'ws/tracking/ambulance/(?P<ambulance_id>[0-9a-f-]+)/$', consumers.AmbulanceTrackingConsumer.as_asgi()),
]
