from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from .engine import ai_engine


class AIProcessEmergencyView(APIView):
    def post(self, request):
        user_input = request.data.get('text', '')
        language = request.data.get('language', request.user.preferred_language or 'en')

        if not user_input:
            return Response(
                {'error': 'Text input is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = ai_engine.process_emergency_input(user_input, language)

        return Response({
            'success': True,
            'structured_data': result,
            'original_input': user_input,
            'language': language
        })


class AIChatView(APIView):
    def post(self, request):
        message = request.data.get('message', '')
        language = request.data.get('language', request.user.preferred_language or 'en')
        history = request.data.get('history', [])

        if not message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = ai_engine.chat(message, history, language)

        return Response({
            'success': True,
            'response': result['response'],
            'is_emergency_detected': result['is_emergency_detected'],
        })


class AIQuickEmergencyView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        text = request.data.get('text', '')
        language = request.data.get('language', 'en')

        if not text:
            return Response(
                {'error': 'Text input is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = ai_engine.process_emergency_input(text, language)

        return Response({
            'success': True,
            'structured_data': result,
        })
