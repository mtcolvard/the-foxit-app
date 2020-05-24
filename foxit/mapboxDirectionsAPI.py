from mapbox import Directions

service = Directions(access_token='pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ')


class DirectionsCalculations:
    def returnRouteGeometry(self, dict_of_waypoints):
        parks_lonLat_list = dict_of_waypoints.values()
        response = service.directions(parks_lonLat_list, profile='mapbox/walking')
        data = response.geojson()

        print(data['features'])
        return data['features'][0]['geometry']['coordinates']
