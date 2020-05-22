from operator import add
from mapbox import DirectionsMatrix

# """This pings the MapBox Matrix API to caluculate the distance to every park within a given bounding box distance of the current waypoint (which is initially the origin) and the distance from each of those parks to the destination.  It then sums to find the total distance to the destination through each park and averages the distances to create a subset of parks whose total distance is below the average.  Then it finds the closest park in that set to the current waypoint. This will be the closest park in the direction of the destination  It then calls the database to determine the next set of parks within the bounding box distance of that park"""

service = DirectionsMatrix(access_token='pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ')

dict_of_waypoints = {}
list_of_waypoints_names = []

class MatrixCalculations:
    def find_route_waypoints(self, parks_within_bounding_box):
        parks_lonLat_list = parks_within_bounding_box.values()

        response = service.matrix(parks_lonLat_list, profile='mapbox/walking', sources=[0, 1], annotations=['distance'])

        data = response.json()
        distances_from_origin = data['distances'][0]
        distances_from_destination = data['distances'][1]

        # for each potential waypoint in the parks_list, sum its distance from both the origin and the destination and calculate the average length of the distances.
        sum_distances = list(map(add, distances_from_origin, distances_from_destination))

        if len(sum_distances) > 2:
            average_distance = sum(sum_distances[2:])/(len(sum_distances)-2)
        else:
            average_distance = sum(sum_distances[0:2])/2

        # because the mapbox response snaps the lon_lat coord to nearest address on a road map create new dictionaries preserving our park keys, but one with the values of the distances to each park from the origin, and one with the total distance of a route going from the origin to the destination through that park
        distances_from_origin_dict = dict(zip(parks_within_bounding_box.keys(), distances_from_origin))

        distances_from_destination_dict = dict(zip(parks_within_bounding_box.keys(), distances_from_destination))

        sum_distances_dict = dict(zip(parks_within_bounding_box.keys(), sum_distances))

        #  create a subset of the parks(waypoints) where the total distance of a route through them is less than the average total distance across all parks
        sum_distances_minus_average = {k:v-average_distance for (k, v) in sum_distances_dict.items()}

        waypoint_distances_closer_than_average = {k:v for (k, v) in sum_distances_minus_average.items() if v < 0}

        waypoint_distance_from_origin = {k:v for (k, v) in distances_from_origin_dict.items() if k in distances_from_origin_dict.keys() & waypoint_distances_closer_than_average.keys()}

        print('waypoint_distance_from_origin', waypoint_distance_from_origin)

        del waypoint_distance_from_origin['origin']

        # find the closest park(waypoint)
        closest_waypoint = min(waypoint_distance_from_origin, key=waypoint_distance_from_origin.get)

        # update the dictionary of waypoints to include this new waypoint
        dict_of_waypoints[closest_waypoint] = parks_within_bounding_box[closest_waypoint]

        matrix_response_dict = {
        'distances_from_current_waypoint': [distances_from_destination_dict],
        'dict_of_waypoints': dict_of_waypoints,
        'next_waypoint_id': closest_waypoint,
        'next_waypoint_lonLat': dict_of_waypoints[closest_waypoint]}

        return matrix_response_dict
