
from rest_framework import viewsets, filters

from .models import Producto, Curso
from .serializers import ProductoSerializer, CursoSerializer


# API de productos del Lab 14
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['nombre']


# API de cursos de SmartIA
class CursoViewSet(viewsets.ModelViewSet):
    queryset = Curso.objects.all()
    serializer_class = CursoSerializer

    filter_backends = [filters.SearchFilter]
    search_fields = ['titulo', 'descripcion']
