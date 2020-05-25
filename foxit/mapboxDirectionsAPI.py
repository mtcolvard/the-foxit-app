from mapbox import Directions

service = Directions(access_token='pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ')


class DirectionsCalculations:
    def returnRouteGeometry(self, dict_of_waypoints):
        parks_lonLat_list = list(dict_of_waypoints.values())[:25]
        print('parks_lonLat_list', parks_lonLat_list)
        response = service.directions(parks_lonLat_list, profile='mapbox/walking', walkway_bias=1, alley_bias=1)
        data = response.geojson()

        print(data['features'])
        return data['features'][0]
