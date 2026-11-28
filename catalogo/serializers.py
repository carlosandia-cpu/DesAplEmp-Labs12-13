
from rest_framework import serializers
from .models import Producto, Curso


# Serializer de productos (Lab 14)
class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = [
            'id',
            'nombre',
            'precio',
            'stock',
            'activo',
            'categoria',
        ]

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "El precio debe ser mayor que cero."
            )
        return value


# Serializer de cursos (SmartIA)
class CursoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Curso
        fields = [
            'id',
            'titulo',
            'descripcion',
            'precio',
            'cupos_disponibles',
            'activo',
            'categoria',
        ]

    def validate_precio(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "El precio debe ser mayor que cero."
            )
        return value
