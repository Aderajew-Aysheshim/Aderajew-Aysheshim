import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async


class EmergencyTrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.emergency_id = self.scope['url_route']['kwargs']['emergency_id']
        self.room_group_name = f'emergency_{self.emergency_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': f'Connected to emergency tracking: {self.emergency_id}'
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message_type = data.get('type', '')

        if message_type == 'location_update':
            await self.save_gps_track(data)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'ambulance_location',
                    'latitude': data['latitude'],
                    'longitude': data['longitude'],
                    'speed': data.get('speed'),
                    'heading': data.get('heading'),
                    'timestamp': data.get('timestamp'),
                }
            )

        elif message_type == 'status_update':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'emergency_status',
                    'status': data['status'],
                    'message': data.get('message', ''),
                }
            )

        elif message_type == 'eta_update':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'eta_update',
                    'eta_minutes': data['eta_minutes'],
                }
            )

    async def ambulance_location(self, event):
        await self.send(text_data=json.dumps({
            'type': 'ambulance_location',
            'latitude': event['latitude'],
            'longitude': event['longitude'],
            'speed': event.get('speed'),
            'heading': event.get('heading'),
            'timestamp': event.get('timestamp'),
        }))

    async def emergency_status(self, event):
        await self.send(text_data=json.dumps({
            'type': 'emergency_status',
            'status': event['status'],
            'message': event.get('message', ''),
        }))

    async def eta_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'eta_update',
            'eta_minutes': event['eta_minutes'],
        }))

    @database_sync_to_async
    def save_gps_track(self, data):
        from .models import GPSTracking
        from apps.ambulances.models import Ambulance
        from apps.emergencies.models import EmergencyRequest

        try:
            emergency = EmergencyRequest.objects.get(id=self.emergency_id)
            if emergency.ambulance:
                GPSTracking.objects.create(
                    ambulance=emergency.ambulance,
                    emergency=emergency,
                    latitude=data['latitude'],
                    longitude=data['longitude'],
                    speed=data.get('speed'),
                    heading=data.get('heading'),
                    accuracy=data.get('accuracy'),
                )

                emergency.ambulance.latitude = data['latitude']
                emergency.ambulance.longitude = data['longitude']
                emergency.ambulance.save(update_fields=['latitude', 'longitude'])
        except EmergencyRequest.DoesNotExist:
            pass


class AmbulanceTrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.ambulance_id = self.scope['url_route']['kwargs']['ambulance_id']
        self.room_group_name = f'ambulance_{self.ambulance_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.update_ambulance_location(data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'location_broadcast',
                'latitude': data['latitude'],
                'longitude': data['longitude'],
                'speed': data.get('speed'),
                'heading': data.get('heading'),
            }
        )

    async def location_broadcast(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def update_ambulance_location(self, data):
        from apps.ambulances.models import Ambulance
        try:
            ambulance = Ambulance.objects.get(id=self.ambulance_id)
            ambulance.latitude = data['latitude']
            ambulance.longitude = data['longitude']
            ambulance.save(update_fields=['latitude', 'longitude'])
        except Ambulance.DoesNotExist:
            pass
