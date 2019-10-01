# from django.http import Http404
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticatedOrReadOnly
import requests
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView

# from .permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly
from .models import Location
from .serializers import LocationSerializer

class LocationList(ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class LocationDetail(RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer



class MapMatrixView(APIView):

    def get(self, request, coords):
        params = {
            'sources': 0,
            'destinations': request.GET.get('destinations'),
            'access_token': 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'
        }
        response = requests.get(f'https://api.mapbox.com/directions-matrix/v1/mapbox/walking/{coords}', params=params)

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

        return Response(response.json())
