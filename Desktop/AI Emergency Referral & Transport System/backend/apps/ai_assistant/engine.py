import json
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class EmergencyAIEngine:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self._model = None

    @property
    def model(self):
        if self._model is None and self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._model = genai.GenerativeModel('gemini-pro')
            except Exception as e:
                logger.error(f"Failed to initialize Gemini: {e}")
        return self._model

    def process_emergency_input(self, user_input, language='en'):
        from .prompts import EMERGENCY_SYSTEM_PROMPT_EN, EMERGENCY_SYSTEM_PROMPT_AM

        system_prompt = EMERGENCY_SYSTEM_PROMPT_AM if language == 'am' else EMERGENCY_SYSTEM_PROMPT_EN

        if self.model:
            try:
                response = self.model.generate_content(
                    f"{system_prompt}\n\nUser input: {user_input}"
                )
                result_text = response.text

                if '```json' in result_text:
                    result_text = result_text.split('```json')[1].split('```')[0]
                elif '```' in result_text:
                    result_text = result_text.split('```')[1].split('```')[0]

                return json.loads(result_text.strip())
            except Exception as e:
                logger.error(f"AI processing error: {e}")
                return self._fallback_processing(user_input)
        else:
            return self._fallback_processing(user_input)

    def chat(self, message, conversation_history=None, language='en'):
        from .prompts import CONVERSATION_PROMPT_EN, CONVERSATION_PROMPT_AM

        prompt_template = CONVERSATION_PROMPT_AM if language == 'am' else CONVERSATION_PROMPT_EN
        context = '\n'.join(conversation_history or [])
        system_prompt = prompt_template.format(context=context)

        if self.model:
            try:
                response = self.model.generate_content(
                    f"{system_prompt}\n\nUser: {message}"
                )
                return {
                    'response': response.text,
                    'is_emergency_detected': self._check_emergency_keywords(message),
                }
            except Exception as e:
                logger.error(f"AI chat error: {e}")
                return self._fallback_chat(message, language)
        else:
            return self._fallback_chat(message, language)

    def _fallback_processing(self, user_input):
        text = user_input.lower()

        emergency_keywords = {
            'accident': ['accident', 'crash', 'collision', 'hit', 'አደጋ'],
            'cardiac': ['heart', 'chest pain', 'cardiac', 'ልብ', 'የደረት ህመም'],
            'respiratory': ['breathing', 'breath', 'asthma', 'choking', 'መተንፈስ'],
            'trauma': ['injury', 'injured', 'hurt', 'wound', 'ጉዳት'],
            'stroke': ['stroke', 'paralysis', 'face drooping', 'ስትሮክ'],
            'burn': ['burn', 'fire', 'ቃጠሎ', 'እሳት'],
            'bleeding': ['bleeding', 'blood', 'ደም'],
            'unconscious': ['unconscious', 'fainted', 'not responding', 'ራሱን ስቶ'],
            'pregnancy': ['pregnant', 'labor', 'delivery', 'birth', 'ነፍሰ ጡር', 'ምጥ'],
        }

        detected_type = 'other'
        for etype, keywords in emergency_keywords.items():
            if any(kw in text for kw in keywords):
                detected_type = etype
                break

        critical_keywords = ['unconscious', 'not breathing', 'severe bleeding', 'heart attack', 'dying']
        priority = 'critical' if any(kw in text for kw in critical_keywords) else 'high'

        return {
            'emergency_type': detected_type,
            'priority': priority,
            'description': user_input,
            'patient_name': '',
            'patient_age': None,
            'patient_condition': user_input,
            'location_mentioned': '',
            'needs_immediate_dispatch': True,
            'follow_up_question': 'Can you provide more details about the patient and your exact location?',
            'reassurance_message': 'Help is being organized. Please stay calm and stay with the patient.'
        }

    def _fallback_chat(self, message, language='en'):
        if language == 'am':
            response = 'እባክዎ ስለ ድንገተኛ ሁኔታዎ ተጨማሪ ዝርዝሮችን ያቅርቡ። ምን ዓይነት አደጋ ነው? የታካሚው ሁኔታ ምንድን ነው?'
        else:
            response = 'Please provide more details about your emergency. What type of emergency is it? What is the patient\'s condition?'

        return {
            'response': response,
            'is_emergency_detected': self._check_emergency_keywords(message),
        }

    def _check_emergency_keywords(self, text):
        emergency_words = [
            'emergency', 'urgent', 'help', 'accident', 'hurt', 'bleeding',
            'unconscious', 'pain', 'ambulance', 'hospital',
            'አደጋ', 'ጉዳት', 'ደም', 'ህመም', 'ሆስፒታል', 'አምቡላንስ', 'እርዳታ'
        ]
        return any(word in text.lower() for word in emergency_words)


ai_engine = EmergencyAIEngine()
