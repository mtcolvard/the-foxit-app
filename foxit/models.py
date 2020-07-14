from django.db import models

# Create your models here.
class Location(models.Model):
    name = models.CharField(max_length=100, null='')
    summary = models.TextField(max_length=2500, null='')
    previous_name = models.CharField(max_length=100, null='')
    site_location = models.CharField(max_length=100, null='')
    postcode = models.CharField(max_length=10, null='')
    type_of_site = models.CharField(max_length=50, null='')
    date = models.CharField(max_length=30, null='')
    designer = models.CharField(max_length=50, null='')
    listed_structures = models.CharField(max_length=150, null='')
    borough = models.CharField(max_length=50, null='')
    site_ownership = models.CharField(max_length=50, null='')
    site_management = models.CharField(max_length=50, null='')
    open_to_public = models.CharField(max_length=10, null='')
    opening_times = models.CharField(max_length=30, null='')
    special_conditions = models.CharField(max_length=250, null='')
    facilities = models.CharField(max_length=250, null='')
    public_transportation = models.CharField(max_length=200, null='')
    lon_lat = models.CharField(max_length=100, null='')
    lon = models.FloatField(null=True)
    lat = models.FloatField(null=True)
    grid_reference = models.CharField(max_length=36, null='')
    size_in_hectares = models.CharField(max_length=100, null='')
    image = models.CharField(max_length=250, null='')
    fuller_information = models.TextField(max_length=20000, null='')
    sources_consulted = models.TextField(max_length=1000, null='')

    def __str__(self):
        return f'{self.name}'
