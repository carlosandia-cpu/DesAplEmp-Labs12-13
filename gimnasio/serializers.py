from rest_framework import serializers

from .models import (
    Membresia, Cliente, InscripcionClase, Pago, Clase, Entrenador, Sala
)


# ---------- Parte 1 ----------

class MembresiaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membresia
        fields = ['id', 'cliente', 'tipo', 'precio', 'fecha_inicio', 'fecha_fin']

    def validate_precio(self, value):
        # Regla de negocio: el precio debe ser mayor que cero.
        if value <= 0:
            raise serializers.ValidationError("El precio debe ser mayor que cero.")
        return value


class InscripcionAnidadaSerializer(serializers.ModelSerializer):
    # Muestra el nombre de la clase en lugar de su id.
    clase = serializers.StringRelatedField()

    class Meta:
        model = InscripcionClase
        fields = ['id', 'clase', 'estado', 'sesiones', 'precio_sesion', 'fecha_inscripcion']


class ClienteDetalleSerializer(serializers.ModelSerializer):
    # Datos de la entidad relacionada, anidados dentro de cada cliente.
    inscripciones = InscripcionAnidadaSerializer(many=True, read_only=True)

    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'dni', 'correo', 'telefono', 'inscripciones']


# ---------- Parte 2 ----------

class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = ['id', 'cliente', 'membresia', 'monto', 'fecha', 'metodo_pago']

    def validate_monto(self, value):
        # Regla de negocio: el monto de un pago debe ser mayor que cero.
        if value <= 0:
            raise serializers.ValidationError("El monto debe ser mayor que cero.")
        return value


class ClaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clase
        fields = ['id', 'nombre', 'horario', 'cupos_disponibles', 'entrenador', 'sala']

    def validate_nombre(self, value):
        # Lab 12: la API valida los datos incluso si React permite enviarlos.
        if len(value.strip()) < 3:
            raise serializers.ValidationError('El nombre debe tener al menos 3 caracteres.')
        return value.strip()


class EntrenadorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Entrenador
        fields = ['id', 'nombre', 'especialidad', 'telefono']


class ClienteResumenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nombre', 'correo']


class ClaseResumenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clase
        fields = ['id', 'nombre', 'horario', 'cupos_disponibles']


class InscripcionDetalleSerializer(serializers.ModelSerializer):
    # Cliente y clase anidados dentro de cada inscripción (solo lectura).
    cliente = ClienteResumenSerializer(read_only=True)
    clase = ClaseResumenSerializer(read_only=True)

    class Meta:
        model = InscripcionClase
        fields = ['id', 'cliente', 'clase', 'estado', 'sesiones',
                  'precio_sesion', 'fecha_inscripcion']

# Lab 12: opciones de las relaciones del formulario de Clase.
class SalaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sala
        fields = ['id', 'nombre', 'capacidad', 'ubicacion']
