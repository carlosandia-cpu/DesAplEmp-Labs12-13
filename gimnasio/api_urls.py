from rest_framework.routers import DefaultRouter

from .api_views import (
    MembresiaViewSet, ClienteDetalleViewSet, PagoViewSet,
    ClaseViewSet, InscripcionDetalleViewSet, EntrenadorViewSet, SalaViewSet
)

router = DefaultRouter()
router.register('membresias', MembresiaViewSet, basename='membresia')
router.register('clientes', ClienteDetalleViewSet, basename='cliente-detalle')
router.register('pagos', PagoViewSet, basename='pago')
router.register('clases', ClaseViewSet, basename='clase')
router.register('inscripciones', InscripcionDetalleViewSet, basename='inscripcion-detalle')
router.register('entrenadores', EntrenadorViewSet, basename='entrenador')
router.register('salas', SalaViewSet, basename='sala')

urlpatterns = router.urls