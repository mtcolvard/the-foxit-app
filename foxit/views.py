# from django.http import Http404
# from rest_framework.response import Response
# from rest_framework.permissions import IsAuthenticatedOrReadOnly
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
