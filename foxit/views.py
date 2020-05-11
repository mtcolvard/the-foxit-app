# from django.http import Http404
# from rest_framework.permissions import IsAuthenticatedOrReadOnly
import math
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
# from .permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly
from .models import Location
from .serializers import LocationSerializer, BoundingBoxSerializer
from mapbox import Geocoder

class LocationList(ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class LocationDetail(RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer



class BoundingBox(APIView):
    def get(self, _request, currentWaypoint):
        bb_width = 500
        # dick = currentWaypoint.split(',')
        currentListWaypoint = [float(x) for x in currentWaypoint.split(',')]
        lat_offset = (1/111111)*bb_width
        lon_offset = 1/(111111*math.cos(math.radians(currentListWaypoint[1])))*bb_width
        lat_max = currentListWaypoint[1] + lat_offset
        lat_min = currentListWaypoint[1] - lat_offset
        lon_max = currentListWaypoint[0] + lon_offset
        lon_min = currentListWaypoint[0] - lon_offset

        queryset = Location.objects.filter(lat__lte=lat_max, lat__gte=lat_min, lon__lte=lon_max, lon__gte=lon_min)[:25]
        # # IN FUTURE REMOVE THE SLICE ABOVE AND CREATE AN IF ELSE STATMENT SHRINKING THE BOUNDING BOX
        # # if len(queryset) >= 25
        serializer = BoundingBoxSerializer(queryset, many=True)
        count = len(queryset)
        print(serializer.data)
        return Response(serializer.data)



class MapMatrixView(APIView):
    def get(self, request, coords):
        print(request, coords)
        params = {
            'sources': [0, 1],
            # 'destinations': request.GET.get('destinations'),
            # 'destinations': '1;2;3;4',
            'access_token': 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'
        }
        response = requests.get(f'https://api.mapbox.com/directions-matrix/v1/mapbox/walking/{coords}', params=params)
        print(response.json())
        # calculate the closest and just send that back
        return Response(response.json())

# COORDS IS EVERYTHING AFTER THE INTERNAL urls.py ROUTE WE CALL ON THE app.js AND THE DEFINE IN THIS view.py IN THE FOXIT BACKEND
class MapDirectionsView(APIView):
    def get(self, _request, coords):
        params = {
            'geometries': 'geojson',
            'access_token': 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'
        }
        response = requests.get(f'https://api.mapbox.com/directions/v5/mapbox/walking/{coords}', params=params)
        print(response.json())
        return Response(response.json())

class MapGeocoderView(APIView):
    def get(self, _request, searchQuery, bbox=None, country='GB'):
        params = {
            # 'limit': 1,
            'country': {country},
            'access_token': 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'
        }
        response = requests.get(f'https://api.mapbox.com/geocoding/v5/mapbox.places/{searchQuery}.json', params=params)
        data = response.json()
        # print(data)
        return Response(response.json())

# class MapGeocoderView(APIView):
#     def get(self, _request, coords, bbox=None, country='ISO 3166-2:GB'):
#         geocoder = Geocoder(name='mapbox.places', access_token='pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ')
#         response = geocoder.forward(coords, bbox, country)
#         data = response.json()
#         print(data)
#         return Response(response.json())
