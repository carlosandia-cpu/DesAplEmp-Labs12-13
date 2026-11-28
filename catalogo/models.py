
from django.db import models


# Modelos originales del Lab 14

class Categoria(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Producto(models.Model):
    nombre = models.CharField(max_length=150)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(default=0)
    activo = models.BooleanField(default=True)

    categoria = models.ForeignKey(
        Categoria,
        on_delete=models.PROTECT,
        related_name='productos'
    )

    def __str__(self):
        return self.nombre


# Modelos adaptados a SmartIA

class CategoriaCurso(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre


class Curso(models.Model):
    titulo = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    cupos_disponibles = models.PositiveIntegerField(default=0)
    activo = models.BooleanField(default=True)

    categoria = models.ForeignKey(
        CategoriaCurso,
        on_delete=models.PROTECT,
        related_name='cursos'
    )

    def __str__(self):
        return self.titulo
