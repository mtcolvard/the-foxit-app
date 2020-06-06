import math
import requests
import collections.abc

from mapbox import Geocoder
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
# from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django.http import Http404
# from .permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly
from django.db.models import Case, When, FloatField, F, Count

from .models import Location
from .serializers import LocationSerializer, BoundingBoxSerializer
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
    def parks_within_perp_distance(self, parks_dict, orientation, journey_leg, best_fit, rambling_tolerance):
        if initial_journey_leg:
            parks_within_perp_distance = {
            k:v for (k, v) in parks_dict.items() if
                # select only parks within ± 45 degrees of inital bearing towards destination
                v['crowflys_distance_and_bearing'][orientation][1] < (best_fit[1] + math.pi/4) and
                v['crowflys_distance_and_bearing'][orientation][1] > (best_fit[1] - math.pi/4) and
                # select only parks closer than the crowflys distance from origin to destination
                v['crowflys_distance_and_bearing'][orientation][0] < best_fit[0] and
                # select parks within users tolerance for rambling
                v['distance_from_bestfit_line'][journey_leg] <= rambling_tolerance and
                v['distance_from_bestfit_line'][journey_leg] >= 0}
        else:
            parks_within_perp_distance = {
            k:v for (k, v) in parks_dict.items() if
                v['distance_from_bestfit_line'][journey_leg] <= rambling_tolerance and
                v['distance_from_bestfit_line'][journey_leg] >= 0}
        print(len(parks_within_perp_distance))
        return parks_within_perp_distance

    def get(self, _request, currentWaypoint, destination, ramblingTolerance):
        rambling_tolerance = int(ramblingTolerance)
        current_waypoint_lon_lat = [float(x) for x in currentWaypoint.split(',')]
        destination_lon_lat = [float(x) for x in destination.split(',')]
        best_fit_origin_to_destination = DistanceAndBearing.crowflys_bearing(self, current_waypoint_lon_lat, destination_lon_lat)

        queryset = Location.objects.all()
        serializer = BoundingBoxSerializer(queryset, many=True)
        response_data = serializer.data

        parks_dict = {}
        for park in response_data:
            lon_lat = [park['lon'], park['lat']]
            crowflys_distance_and_bearing = DistanceAndBearing.crowflys_bearing(self, current_waypoint_lon_lat, lon_lat)
            size_in_hectares = park['size_in_hectares']
            try:
                size_in_hectares_float = float(size_in_hectares)
            except (TypeError, ValueError):
                size_in_hectares_float = 0.0
            parks_dict[park['id']] = {
            'lon_lat': lon_lat,
            'crowflys_distance_and_bearing': {'from_origin': crowflys_distance_and_bearing},
            'distance_from_bestfit_line': {'origin_to_destination': DistanceAndBearing.perpendicular_distance_from_bestfit_line(self, best_fit_origin_to_destination, crowflys_distance_and_bearing)},
            'size_in_hectares': size_in_hectares_float}

        parks_within_perp_distance = self.parks_within_perp_distance(parks_dict, 'from_origin', 'origin_to_destination', best_fit_origin_to_destination, rambling_tolerance)
        largest_park_key = max(parks_within_perp_distance, key=lambda v: parks_within_perp_distance[v]['size_in_hectares'])
        largest_park_lon_lat = parks_within_perp_distance[largest_park_key]['lon_lat']
        best_fit_to_largest_park = DistanceAndBearing.crowflys_bearing(self, current_waypoint_lon_lat, parks_within_perp_distance[largest_park_key]['lon_lat'])
        best_fit_from_largest_park = DistanceAndBearing.crowflys_bearing(self, largest_park_lon_lat, destination_lon_lat)

        for k, v in parks_within_perp_distance.items():
            perp_distance_origin_to_largest_park = DistanceAndBearing.perpendicular_distance_from_bestfit_line(self, best_fit_to_largest_park, v['crowflys_distance_and_bearing']['from_origin'])

            crowflys_from_largest_park = DistanceAndBearing.crowflys_bearing(self, largest_park_lon_lat, v['lon_lat'])

            perp_distance_largest_park_to_destination = DistanceAndBearing.perpendicular_distance_from_bestfit_line(self, best_fit_from_largest_park, crowflys_from_largest_park)

            v.update({'crowflys_distance_and_bearing':{'from_origin': v['crowflys_distance_and_bearing']['from_origin'], 'from_largest_park': crowflys_from_largest_park},
            'distance_from_bestfit_line':{'origin_to_destination': v['distance_from_bestfit_line']['origin_to_destination'], 'to_largest_park': perp_distance_origin_to_largest_park, 'from_largest_park': perp_distance_largest_park_to_destination}})
        print('parks_within_perp_distance_update', len(parks_within_perp_distance))

        parks_within_perp_distance_origin_to_largest_park = self.parks_within_perp_distance(parks_within_perp_distance, 'from_origin', 'to_largest_park', best_fit_to_largest_park, rambling_tolerance/5)

        parks_within_perp_distance_largest_park_to_destination = self.parks_within_perp_distance(parks_within_perp_distance, 'from_largest_park', 'from_largest_park', best_fit_from_largest_park, rambling_tolerance/3)

        print('parks_within_perp_distance_origin_to_largest_park', parks_within_perp_distance_origin_to_largest_park)
        print('parks_within_perp_distance_largest_park_to_destination', parks_within_perp_distance_largest_park_to_destination)

        parks_within_perp_distance_list = [x['lon_lat'] for x in parks_within_perp_distance.values()]

        parks_within_perp_distance_origin_to_largest_park_list = [x['lon_lat'] for x in parks_within_perp_distance_origin_to_largest_park.values()]

        parks_within_perp_distance_largest_park_to_destination_list = [x['lon_lat'] for x in parks_within_perp_distance_largest_park_to_destination.values()]

        return Response([current_waypoint_lon_lat] + [destination_lon_lat] +parks_within_perp_distance_origin_to_largest_park_list + parks_within_perp_distance_largest_park_to_destination_list)

# parks_within_perp_distance_largest_park_to_destination_list + parks_within_perp_distance_origin_to_largest_park_list
# YOU SHOULD PRIORITIZE PARKS WITH THE GREATEST AREA.
# THIS STUFF COMES IN AND YOU WANT TO LIMIT THE SET TO ALL PERP_DISTANCES UNDER MIN... SAY 500m , THEN YOU NEED TO SORT ALL THIS BY DISTANCE FROM ORIGIN.
# THEN YOU NEED TO DECIDE WHAT TO DO IF TO PARKS ARE A SIMILAR DISTANCE FROM THE ORIGIN
# YOU COULD USE THE WAYPOINTS FROM THE DEFAULT MAPBOX ROUTE GEOMETRY TO HELP FILTER FOR MOST  PLAUSIBLE ROUTES
# PERHAPS THE WHOLE ROUTE SHOULD BE SECTIONED INTO THIRDS OR QUARTERS.  SO THAT YOU COULD LOOK FOR THE BIG PARKS, BUT ALSO GROUP THE CROWFLIES DISTANCES INTO SECTIONS AND JUST PIC ONE OR TWO FROM EACH. ///////////  AN ALTERNATIVE WOULD BE TO DO SOMETHING LIKE THAT MAPBOX MATRIX ALGORYTHM YOU WROTE TO FIND THE NEXT PARK.

# @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@


class BoundingBox(APIView):
    def get(self, _request, currentWaypoint, destination, ramblingTolerance):
        rambling_tolerance = int(ramblingTolerance)
        current_waypoint_lon_lat = [float(x) for x in currentWaypoint.split(',')]
        destination_lon_lat = [float(x) for x in destination.split(',')]
        distance_from_next_waypoint_to_destination = 501
        dict_of_waypoints = {}

        while distance_from_next_waypoint_to_destination > rambling_tolerance:
            # print('currentWaypoint', current_waypoint_lon_lat)
            lat_offset = (1/111111)*rambling_tolerance
            lon_offset = 1/(111111*math.cos(math.radians(current_waypoint_lon_lat[1])))*rambling_tolerance
            lat_max = current_waypoint_lon_lat[1] + lat_offset
            lat_min = current_waypoint_lon_lat[1] - lat_offset
            lon_max = current_waypoint_lon_lat[0] + lon_offset
            lon_min = current_waypoint_lon_lat[0] - lon_offset

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
            parks_within_bounding_box = {'origin': current_waypoint_lon_lat, 'destination': destination_lon_lat}
            # print('parks_within_bounding_box origin_to_destination', parks_within_bounding_box)
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

            current_waypoint_lon_lat = [float(x) for x in matrix_result['next_waypoint_lonLat']]
            distance_from_next_waypoint_to_destination = matrix_result['distances_from_current_waypoint'][0][matrix_result['next_waypoint_id']]
            next_waypoint_id = matrix_result['next_waypoint_id']
            parks_within_bounding_box.clear()
            dict_of_waypoints = matrix_result['dict_of_waypoints']
            print('dict_of_waypoints', dict_of_waypoints)


            # if distance_from_next_waypoint_to_destination > rambling_tolerance:
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
