
from rest_framework import serializers
from catalogo.models import Curso
from .models import Cliente


class MatriculaSerializer(serializers.Serializer):
    estudiante_id = serializers.PrimaryKeyRelatedField(
        queryset=Cliente.objects.all(),
        source='estudiante'
    )

    curso_id = serializers.PrimaryKeyRelatedField(
        queryset=Curso.objects.all(),
        source='curso'
    )

    cantidad = serializers.IntegerField(
        min_value=1,
        default=1
    )
