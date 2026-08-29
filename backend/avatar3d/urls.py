"""
Rutas de la app. El proyecto las incluye con:
    path("", include("avatar3d.urls"))

Si mueves esta app a GAVI-CRM, agrega esa misma linea a tu urls.py principal.
"""

from django.urls import path

from .views import GenerateAvatarView, HealthView

urlpatterns = [
    path("api/avatar/generate/", GenerateAvatarView.as_view(), name="generate-avatar"),
    path("api/avatar/health/", HealthView.as_view(), name="avatar-health"),
]
