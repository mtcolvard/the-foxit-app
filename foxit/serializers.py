from rest_framework import serializers
from .models import Location

class LocationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Location
        fields = ('__all__')

class RouteThenBoundingBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fiels = ('id', 'name', 'lon', 'lat', 'lon_lat')


class BoundingBoxSerializer(serializers.ModelSerializer):

    class Meta:
        model = Location
        fields = ('id', 'name', 'lon', 'lat', 'lon_lat')
