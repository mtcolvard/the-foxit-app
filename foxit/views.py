import math
import itertools
import requests

from mapbox import Geocoder
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
# from rest_framework.permissions import IsAuthenticatedOrReadOnly
# from django.http import Http404
# from .permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly

from .models import Location
from .serializers import LocationSerializer, BoundingBoxSerializer
from .mapboxMatrixAPI import MatrixCalculations



class LocationList(ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class LocationDetail(RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class BoundingBox(APIView):
    def get(self, _request, currentWaypoint, destination, bounding_box_width):
        bb_width = int(bounding_box_width)
        currentWaypointArray = [float(x) for x in currentWaypoint.split(',')]
        destinationArray = [float(x) for x in destination.split(',')]
        distance_from_next_waypoint_to_destination = 600
        dict_of_waypoints = {}

        while distance_from_next_waypoint_to_destination > bb_width:
            print('currentWaypointArray 1', currentWaypointArray)
            lat_offset = (1/111111)*bb_width
            lon_offset = 1/(111111*math.cos(math.radians(currentWaypointArray[1])))*bb_width
            lat_max = currentWaypointArray[1] + lat_offset
            lat_min = currentWaypointArray[1] - lat_offset
            lon_max = currentWaypointArray[0] + lon_offset
            lon_min = currentWaypointArray[0] - lon_offset

            queryset = Location.objects.filter(lat__lte=lat_max, lat__gte=lat_min, lon__lte=lon_max, lon__gte=lon_min)[:23]
    # # IN FUTURE REMOVE THE SLICE ABOVE AND CREATE AN IF ELSE STATMENT SHRINKING THE BOUNDING BOX THIS WILL GIVE GREATER ACCURACY AS IT WILL NOT ACCIDENTALLY THROW OUT RESULTS THAT MAY BE CLOSER.  REVIEW THE DJANGO DOCS FOR QUERYSETS TO FIGURE OUT HOW TO FILTER THIS BIG RESULT WITHOUT HAVING TO DO ANOTHER DATABASE HIT.  POSSIBLY THIS WILL BY IN PURE PYTHON RATHER THAN DJANGO PYTHON BUT PERHAPS NOT.
            # # if len(queryset) >= 25
            serializer = BoundingBoxSerializer(queryset, many=True)
            count = len(queryset)
            print('count', count)
            response_data = serializer.data
    # THAT ^ IS A LIST OF DICTIONARIES CONTAINING PARK 'ID', 'NAME', & 'LON_LAT'
            print('response data', response_data)
    # !!!!! REMEMBER TO CHANGE DESTINATION BACK TO NONE !!!!!!!!!!!!!!!!!!!
            # global parks_within_bounding_box
            parks_within_bounding_box = {'origin': currentWaypointArray, 'destination': destinationArray}
            print('parks_within_bounding_box initial', parks_within_bounding_box)
            # CREATE A NEW DICTIONARY WITH THE 'ID' AND [LON,LAT] OF EACH PARK AS KEY:VALUE
            for x in response_data:
                parks_within_bounding_box[str(x['id'])] = [x['lon'], x['lat']]

    # THIS MAY BE AN INELLEGANT WAY TO DO THIS.
            for x in dict_of_waypoints.keys():
                if x in parks_within_bounding_box:
                    parks_within_bounding_box.pop(x)
            print('parks_within_bounding_box update', parks_within_bounding_box)
    # IS SOMETHING LIKE THIS BETTER?  IS THERE NO FILTER OR INTERTOOLS.FILTERFALSE METHOD THAT WOULD BE QUICKER?
            # reset_past_waypoint_values_to_none =  {k:v == None for (k,v) in dict_of_waypoints.items()}
            # parks_within_bounding_box.update(reset_past_waypoint_values_to_none)
            # for x in parks_within_bounding_box.values():
            #     if x == False:
            #         x.pop()

            matrix_result = MatrixCalculations.find_route_waypoints(self, parks_within_bounding_box)
    #  ------matrix_result LOOKS LIKE THIS ---------------------------
        # 'distances_from_current_waypoint': [distances_from_origin_dict],
        # 'dict_of_waypoints': dict_of_waypoints,
        # 'next_waypoint_id': closest_waypoint,
        # 'next_waypoint_lonLat': closest_waypoint_lonLat}

            currentWaypointArray = [float(x) for x in matrix_result['next_waypoint_lonLat']]
            print('currentWaypointArray 2', currentWaypointArray)

            distance_from_next_waypoint_to_destination = matrix_result['distances_from_current_waypoint'][0][matrix_result['next_waypoint_id']]
            print('distance_from_next_waypoint_to_destination', distance_from_next_waypoint_to_destination)

            next_waypoint_id = matrix_result['next_waypoint_id']
            print('next_waypoint_id', next_waypoint_id)
            parks_within_bounding_box.clear()

            dict_of_waypoints = matrix_result['dict_of_waypoints']
            print('dict_of_waypoints', matrix_result['dict_of_waypoints'])


            # if distance_from_next_waypoint_to_destination > bb_width:
            #     continue
            # else:

        return Response(matrix_result['dict_of_waypoints'])


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

#THIS IS THE ORIGINAL IMPLEMENTATION RECEIVING INSTRUCTIONS FROM THE FRONT END
# class MapMatrixView(APIView):
#     def get(self, request, coords):
#         print(request, coords)
#         params = {
#             'sources': [0, 1],
#             # 'destinations': request.GET.get('destinations'),
#             # 'destinations': '1;2;3;4',
#             'access_token': 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'
#         }
#         response = requests.get(f'https://api.mapbox.com/directions-matrix/v1/mapbox/walking/{coords}', params=params)
#         print(response.json())
#         # calculate the closest and just send that back
#         return Response(response.json())


class MapDirectionsView(APIView):
    def get(self, _request, coords):
        params = {
            'geometries': 'geojson',
            'access_token': 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'
        }
        response = requests.get(f'https://api.mapbox.com/directions/v5/mapbox/walking/{coords}', params=params)
        # print(response.json())
        return Response(response.json())

# class MapGeocoderView(APIView):
#     def get(self, _request, searchQuery, bbox=None, country='GB'):
#         params = {
#             # 'limit': 1,
#             'country': {country},
#             'access_token': 'pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ'
#         }
#         response = requests.get(f'https://api.mapbox.com/geocoding/v5/mapbox.places/{searchQuery}.json', params=params)
#         data = response.json()
#         print(data)
#         return Response(response.json())


class MapGeocoderView(APIView):
    def get(self, _request, searchQuery, bbox=None, country='ISO 3166-2:GB'):
        geocoder = Geocoder(name='mapbox.places', access_token='pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ')
        response = geocoder.forward(searchQuery, bbox, country)
        data = response.json()
        print(data)
        return Response(response.json())
