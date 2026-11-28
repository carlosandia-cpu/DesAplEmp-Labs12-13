
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from catalogo.api_views import ProductoViewSet, CursoViewSet
from pedidos.api_views import CrearMatriculaView


router = DefaultRouter()

router.register(
    'productos',
    ProductoViewSet,
    basename='producto'
)

router.register(
    'cursos',
    CursoViewSet,
    basename='curso'
)


urlpatterns = [
    path('admin/', admin.site.urls),

    # Aplicaciones anteriores
    path('', include('core.urls')),
    path('store/', include('store.urls')),
    path('gimnasio/', include('gimnasio.urls')),

    # SmartIA: matrícula y pago simulado
    path(
        'api/matriculas/',
        CrearMatriculaView.as_view(),
        name='crear-matricula'
    ),

    # API anterior del gimnasio
    path('api/', include('gimnasio.api_urls')),

    # API del catálogo y cursos
    path('api/', include(router.urls)),
]
