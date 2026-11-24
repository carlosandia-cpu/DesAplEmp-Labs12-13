from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Membresia, Cliente, Pago, Clase, InscripcionClase, Entrenador, Sala
from .serializers import (
    MembresiaSerializer, ClienteDetalleSerializer,
    PagoSerializer, ClaseSerializer, InscripcionDetalleSerializer, EntrenadorSerializer, SalaSerializer
)


# ---------- Parte 1 ----------

class MembresiaViewSet(viewsets.ModelViewSet):
    queryset = Membresia.objects.all()
    serializer_class = MembresiaSerializer

    # Búsqueda (?search=) y ordenamiento (?ordering=)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['tipo', 'cliente__nombre']
    ordering_fields = ['precio', 'fecha_inicio', 'fecha_fin']


class ClienteDetalleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ClienteDetalleSerializer

    def get_queryset(self):
        queryset = Cliente.objects.prefetch_related('inscripciones__clase')

        # Filtro por parámetro: /api/clientes/?estado=Activa
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(inscripciones__estado=estado).distinct()

        return queryset

    # Acción propia: /api/clientes/activos/
    @action(detail=False, methods=['get'])
    def activos(self, request):
        # Reutiliza el método del QuerySet personalizado de la Semana 7.
        clientes = Cliente.objects.con_inscripciones_activas().prefetch_related(
            'inscripciones__clase'
        )
        serializer = self.get_serializer(clientes, many=True)
        return Response(serializer.data)


# ---------- Parte 2 ----------

class PagoViewSet(viewsets.ModelViewSet):
    queryset = Pago.objects.all()
    serializer_class = PagoSerializer


class ClaseViewSet(viewsets.ModelViewSet):
    queryset = Clase.objects.all()
    serializer_class = ClaseSerializer

    # Búsqueda (?search=) y ordenamiento (?ordering=)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['nombre', 'entrenador__nombre']
    ordering_fields = ['nombre', 'horario', 'cupos_disponibles']

    # Lab 12: filtro por sala con ?sala=ID, combinable con ?search= y ?ordering=.
    def get_queryset(self):
        queryset = Clase.objects.select_related('entrenador', 'sala').all()
        sala = self.request.query_params.get('sala')
        if sala:
            queryset = queryset.filter(sala_id=sala)
        return queryset

    # Acción propia: /api/clases/proximas/
    @action(detail=False, methods=['get'])
    def proximas(self, request):
        # Reutiliza los métodos encadenados del ClaseQuerySet de la Semana 7.
        clases = self.filter_queryset(Clase.objects.proximas().con_cupos())
        serializer = self.get_serializer(clases, many=True)
        return Response(serializer.data)


class InscripcionDetalleViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = InscripcionDetalleSerializer

    def get_queryset(self):
        queryset = InscripcionClase.objects.select_related('cliente', 'clase')

        # Filtro por parámetro: /api/inscripciones/?estado=Activa
        estado = self.request.query_params.get('estado')
        if estado:
            queryset = queryset.filter(estado=estado)

        return queryset

# Lab 12: recursos de solo lectura para los select de React.
class EntrenadorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Entrenador.objects.all().order_by('nombre')
    serializer_class = EntrenadorSerializer


class SalaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Sala.objects.all().order_by('nombre')
    serializer_class = SalaSerializer
