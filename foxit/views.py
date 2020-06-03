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
from django.db.models import Case, When, FloatField, F, Count

from .models import Location
from .serializers import LocationSerializer, BoundingBoxSerializer, RouteThenBoundingBoxSerializer
from .mapboxMatrixAPI import MatrixCalculations
from .mapboxDirectionsAPI import DirectionsCalculations
from .distanceAndBearingCalcs import DistanceAndBearing



class LocationList(ListCreateAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer


class LocationDetail(RetrieveUpdateDestroyAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class RouteThenBoundingBox(APIView):
    def get(self, request, currentWaypoint, destination, bounding_box_width):
        bb_width = int(bounding_box_width)
        currentWaypointArray = [float(x) for x in currentWaypoint.split(',')]
        destinationArray = [float(x) for x in destination.split(',')]
        best_fit = DistanceAndBearing.crowflys_bearing(self, currentWaypointArray, destinationArray)
        queryset = Location.objects.all()
        serializer = BoundingBoxSerializer(queryset, many=True)
        response_data = serializer.data

        parks_dict = {}
        for park in response_data:
            park_lon_lat = [park['lon'], park['lat']]
            park_crowflys_bearing = DistanceAndBearing.crowflys_bearing(self, currentWaypointArray, park_lon_lat)
            parks_dict[park['id']] = {'park_lon_lat':park_lon_lat, 'park_crowflys_bearing': park_crowflys_bearing, 'perp_distance_angle':DistanceAndBearing.perpendicular_distance_from_bestfit_line(self, best_fit, park_crowflys_bearing)}

        parks_within_perp_distance = {k:v for (k,v) in parks_dict.items() if
        # v['perp_distance_angle'][1] < best_fit[1] + math.pi/4
        # and v['perp_distance_angle'][1] > best_fit[1] - math.pi/4 and 
        v['park_crowflys_bearing'][0] < best_fit[0]
        and v['perp_distance_angle'][0]<500
        and v['perp_distance_angle'][0] > 0}
# THIS STUFF COMES IN AND YOU WANT TO LIMIT THE SET TO ALL PERP_DISTANCES UNDER MIN... SAY 500m , THEN YOU NEED TO SORT ALL THIS BY DISTANCE FROM ORIGIN.
# THEN YOU NEED TO DECIDE WHAT TO DO IF TO PARKS ARE A SIMILAR DISTANCE FROM THE ORIGIN
# YOU COULD USE THE WAYPOINTS FROM THE DEFAULT MAPBOX ROUTE GEOMETRY TO HELP FILTER FOR MOST  PLAUSIBLE ROUTES
# YOU SHOULD PRIORITIZE PARKS WITH THE GREATEST AREA.
# PERHAPS THE WHOLE ROUTE SHOULD BE SECTIONED INTO THIRDS OR QUARTERS.  SO THAT YOU COULD LOOK FOR THE BIG PARKS, BUT ALSO GROUP THE CROWFLIES DISTANCES INTO SECTIONS AND JUST PIC ONE OR TWO FROM EACH. ///////////  AN ALTERNATIVE WOULD BE TO DO SOMETHING LIKE THAT MAPBOX MATRIX ALGORYTHM YOU WROTE TO FIND THE NEXT PARK.

        # querysetTwo = Locations.object.annotate(perp_distance=)
        parks_within_perp_distance_lon_lat_array = [x['park_lon_lat'] for x in parks_within_perp_distance.values()]


        print(parks_within_perp_distance_lon_lat_array)
        return Response(parks_within_perp_distance_lon_lat_array)


        # queryset = Location.objects.filter(lat__lte=lat_max, lat__gte=lat_min, lon__lte=lon_max, lon__gte=lon_min)

        # dict_of_waypoints = {'origin': currentWaypointArray, 'destination': destinationArray}
        # routeGeometry = DirectionsCalculations.returnRouteGeometry(self, dict_of_waypoints)
        # routeGeometryCoords = routeGeometry['geometry']['coordinates']
        # lons = [x for x,y in routeGeometryCoords]
        # lats = [y for x,y in routeGeometryCoords]
        # lon_max = max(lons)
        # lon_min = min(lons)
        # lat_max = max(lats)
        # lat_min = min(lats)

# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


class BoundingBox(APIView):
    def get(self, _request, currentWaypoint, destination, bounding_box_width):
        bb_width = int(bounding_box_width)
        currentWaypointArray = [float(x) for x in currentWaypoint.split(',')]
        destinationArray = [float(x) for x in destination.split(',')]
        distance_from_next_waypoint_to_destination = 501
        dict_of_waypoints = {}

        while distance_from_next_waypoint_to_destination > bb_width:
            # print('currentWaypoint', currentWaypointArray)
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
    # !!!!! REMEMBER TO CHANGE DESTINATION BACK TO NONE !!!!!!!!!!!!!!!!!!!
            # global parks_within_bounding_box
            parks_within_bounding_box = {'origin': currentWaypointArray, 'destination': destinationArray}
            # print('parks_within_bounding_box initial', parks_within_bounding_box)
            # CREATE A NEW DICTIONARY WITH THE 'ID' AND [LON,LAT] OF EACH PARK AS KEY:VALUE
            for x in response_data:
                parks_within_bounding_box[str(x['id'])] = [x['lon'], x['lat']]

    # THIS MAY BE AN INELLEGANT WAY TO DO THIS.
            for x in dict_of_waypoints.keys():
                if x in parks_within_bounding_box:
                    parks_within_bounding_box.pop(x)
            # print('parks_within_bounding_box update', parks_within_bounding_box)
    # IS SOMETHING LIKE THIS BETTER?  IS THERE NO FILTER OR INTERTOOLS.FILTERFALSE METHOD THAT WOULD BE QUICKER?
            # reset_past_waypoint_values_to_none =  {k:v == None for (k,v) in dict_of_waypoints.items()}
            # parks_within_bounding_box.update(reset_past_waypoint_values_to_none)
            # for x in parks_within_bounding_box.values():
            #     if x == False:
            #         x.pop()

            matrix_result = MatrixCalculations.find_route_waypoints(self, parks_within_bounding_box, dict_of_waypoints)
    #  ------matrix_result LOOKS LIKE THIS ---------------------------
        # 'distances_from_current_waypoint': [distances_from_origin_dict],
        # 'dict_of_waypoints': dict_of_waypoints,
        # 'next_waypoint_id': closest_waypoint,
        # 'next_waypoint_lonLat': closest_waypoint_lonLat}

            currentWaypointArray = [float(x) for x in matrix_result['next_waypoint_lonLat']]
            distance_from_next_waypoint_to_destination = matrix_result['distances_from_current_waypoint'][0][matrix_result['next_waypoint_id']]
            next_waypoint_id = matrix_result['next_waypoint_id']
            parks_within_bounding_box.clear()
            dict_of_waypoints = matrix_result['dict_of_waypoints']
            print('dict_of_waypoints', dict_of_waypoints)


            # if distance_from_next_waypoint_to_destination > bb_width:
            #     continue
            # else:
        routeGeometry = DirectionsCalculations.returnRouteGeometry(self, dict_of_waypoints)
        print('routeGeometry', routeGeometry)

        return Response(routeGeometry)


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
        return Response(response.json())
