from django.db import models

# Create your models here.
class Location(models.Model):
    name = models.CharField(max_length=100)
    endname = models.CharField(max_length=100)
    endcoord = models.CharField(max_length=100)
    lat = models.FloatField()
    lon = models.FloatField()

    def __str__(self):
        return f'{self.name}'
