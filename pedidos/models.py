
from django.db import models
from catalogo.models import Producto, Curso


# =========================================
# MODELOS ORIGINALES DEL LAB 14
# =========================================

class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)

    def __str__(self):
        return self.nombre


class Pedido(models.Model):
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),
        ('PAGADO', 'Pagado'),
        ('ENTREGADO', 'Entregado'),
        ('CANCELADO', 'Cancelado'),
    ]

    cliente = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        related_name='pedidos'
    )
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='PENDIENTE'
    )
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return f'Pedido {self.id} - {self.cliente.nombre}'


class DetallePedido(models.Model):
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name='detalles'
    )
    producto = models.ForeignKey(
        Producto,
        on_delete=models.PROTECT
    )
    cantidad = models.PositiveIntegerField()
    precio_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def __str__(self):
        return f'{self.producto.nombre} x {self.cantidad}'


class Pago(models.Model):
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),
        ('APROBADO', 'Aprobado'),
        ('RECHAZADO', 'Rechazado'),
    ]

    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.PROTECT,
        related_name='pagos'
    )
    monto = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='PENDIENTE'
    )
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pago {self.id} - {self.estado}'


# =========================================
# MODELOS EDUCATIVOS DE SMARTIA
# =========================================

class PedidoCurso(models.Model):
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),
        ('PAGADO', 'Pagado'),
        ('CANCELADO', 'Cancelado'),
    ]

    estudiante = models.ForeignKey(
        Cliente,
        on_delete=models.PROTECT,
        related_name='pedidos_cursos'
    )
    fecha = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='PENDIENTE'
    )
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    def __str__(self):
        return f'Matricula {self.id} - {self.estudiante.nombre}'


class DetallePedidoCurso(models.Model):
    pedido = models.ForeignKey(
        PedidoCurso,
        on_delete=models.CASCADE,
        related_name='detalles'
    )
    curso = models.ForeignKey(
        Curso,
        on_delete=models.PROTECT
    )
    cantidad = models.PositiveIntegerField(default=1)
    precio_unitario = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    def __str__(self):
        return f'{self.curso.titulo} x {self.cantidad}'


class PagoCurso(models.Model):
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),
        ('APROBADO', 'Aprobado'),
        ('RECHAZADO', 'Rechazado'),
    ]

    pedido = models.ForeignKey(
        PedidoCurso,
        on_delete=models.PROTECT,
        related_name='pagos'
    )
    monto = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    estado = models.CharField(
        max_length=20,
        choices=ESTADOS,
        default='PENDIENTE'
    )
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pago de matricula {self.id} - {self.estado}'
