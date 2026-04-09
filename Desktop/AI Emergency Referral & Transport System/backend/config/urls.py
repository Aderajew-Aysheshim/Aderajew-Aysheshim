from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = '🚑 Emergency System Admin'
admin.site.site_title = 'Emergency Admin Portal'
admin.site.index_title = 'System Management'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/hospitals/', include('apps.hospitals.urls')),
    path('api/ambulances/', include('apps.ambulances.urls')),
    path('api/emergencies/', include('apps.emergencies.urls')),
    path('api/tracking/', include('apps.tracking.urls')),
    path('api/ai/', include('apps.ai_assistant.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
