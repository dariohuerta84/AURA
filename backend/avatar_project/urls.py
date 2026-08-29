from django.conf import settings
from django.conf.urls.static import static
from django.urls import include, path

urlpatterns = [
    path("", include("avatar3d.urls")),
]

# En desarrollo Django sirve los .glb generados desde MEDIA_ROOT.
# En produccion esto lo hace nginx / S3, no Django.
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
