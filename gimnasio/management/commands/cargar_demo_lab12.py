from datetime import timedelta
from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils import timezone
from gimnasio.models import Entrenador, Sala, Clase, Membresia


class Command(BaseCommand):
    help = 'Crea registros de muestra del Lab 12 solo cuando no hay datos en esas tablas.'

    def handle(self, *args, **options):
        if Entrenador.objects.exists():
            entrenador = Entrenador.objects.first()
        else:
            entrenador = Entrenador.objects.create(nombre='Entrenador Demo', especialidad='Yoga', telefono='900000000')
        if Sala.objects.exists():
            sala = Sala.objects.first()
        else:
            sala = Sala.objects.create(nombre='Sala Demo', capacidad=30, ubicacion='Primer piso')
        if not Clase.objects.exists():
            Clase.objects.create(nombre='Yoga de muestra', horario=timezone.now() + timedelta(days=2),
                                 cupos_disponibles=15, entrenador=entrenador, sala=sala)
        if not Membresia.objects.exists():
            hoy = timezone.localdate()
            Membresia.objects.create(tipo='Mensual de muestra', precio=Decimal('100.00'),
                                    fecha_inicio=hoy, fecha_fin=hoy + timedelta(days=30))
        self.stdout.write(self.style.SUCCESS('Datos de prueba disponibles (sin borrar los existentes).'))
