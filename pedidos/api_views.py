
from django.db import transaction
from django.db.models import F
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from catalogo.models import Curso
from .models import PedidoCurso, DetallePedidoCurso, PagoCurso
from .serializers import MatriculaSerializer


class CrearMatriculaView(APIView):

    def post(self, request):
        serializer = MatriculaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        estudiante = serializer.validated_data['estudiante']
        curso = serializer.validated_data['curso']
        cantidad = serializer.validated_data['cantidad']

        if not curso.activo:
            return Response(
                {'error': 'El curso no está disponible.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():

            # Descontar cupos solo si existen suficientes
            actualizados = Curso.objects.filter(
                pk=curso.pk,
                activo=True,
                cupos_disponibles__gte=cantidad
            ).update(
                cupos_disponibles=F('cupos_disponibles') - cantidad
            )

            if actualizados == 0:
                return Response(
                    {'error': 'No hay cupos suficientes.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # El precio viene de Django, no de React
            total = curso.precio * cantidad

            pedido = PedidoCurso.objects.create(
                estudiante=estudiante,
                estado='PENDIENTE',
                total=total
            )

            DetallePedidoCurso.objects.create(
                pedido=pedido,
                curso=curso,
                cantidad=cantidad,
                precio_unitario=curso.precio
            )

            # Pago simulado: no se utiliza dinero real
            PagoCurso.objects.create(
                pedido=pedido,
                monto=total,
                estado='APROBADO'
            )

            pedido.estado = 'PAGADO'
            pedido.save(update_fields=['estado'])

        return Response(
            {
                'mensaje': 'Matrícula registrada correctamente.',
                'pedido_id': pedido.id,
                'curso': curso.titulo,
                'cantidad': cantidad,
                'total': str(total),
                'estado': pedido.estado,
                'pago': 'SIMULADO'
            },
            status=status.HTTP_201_CREATED
        )
