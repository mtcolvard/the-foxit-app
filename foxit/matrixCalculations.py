from operator import add
from mapbox import DirectionsMatrix

service = DirectionsMatrix(access_token='pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ')

origin = [-0.047092, 51.519331]
destination = [-0.043618, 51.538311]

# parks_within_bounding_box = {'origin': [-0.084254, 51.518961], 'destination': [-0.043618, 51.538311], 833: [-0.089122673954283, 51.511451872672], 854: [-0.093218055745589, 51.51691406886], 866: [-0.084613688708361, 51.515874600322], 910: [-0.088671282889504, 51.522235590909], 919: [-0.08412343783119, 51.527556921105], 938: [-0.089009852504822, 51.514147804368], 940: [-0.096061284965339, 51.517859516813], 941: [-0.09454589028448, 51.519633416092], 964: [-0.092880198087764, 51.525001871383], 1040: [-0.075555186872678, 51.525618133595], 1061: [-0.093218055745589, 51.51691406886], 1064: [-0.097389315769702, 51.520578833455], 1095: [-0.090074197976318, 51.523157700738], 1178: [-0.085601812291904, 51.526681805717], 1224: [-0.074417864366412, 51.518405409273], 1263: [-0.096323571501542, 51.511568985509], 1350: [-0.078814649948071, 51.516679002793], 1355: [-0.09860519828627, 51.525994076737], 1369: [-0.080292766543172, 51.515803950192], 1385: [-0.087494313257733, 51.515921612032], 1511: [-0.08192182513119, 51.511334318014], 1513: [-0.097726321466478, 51.512491003609], 1518: [-0.087419024791445, 51.517718896902]}

list_of_waypoints = []
list_of_waypoints_names = []

class MatrixCalculations:
    def find_route_waypoints(self, parks_within_bounding_box):
        loop_count = 0

        features_list = parks_within_bounding_box.values()

        response = service.matrix(features_list, profile='mapbox/walking', sources=[0, 1], annotations=['distance'])
        data = response.json()

        # calculate the distance to each possible waypoint from both the origin and the destination
        # for each potential waypoint in the features_list, sum its distance from both the origin and the destination and then find the waypoint with the smallest total distance.
        # convert the sum_distances list into a dictionary to keep track of indexes relative to the features_list
        # lets try converting distance from origin into a dictionary, sorting it, and then comparing it to the sum_distances_minus_average to find the lowest value from the set
        distances_from_origin = data['distances'][0]
        distances_from_destination = data['distances'][1]
        sum_distances = list(map(add, distances_from_origin, distances_from_destination))
        average_distance = sum(sum_distances[2::])/(len(sum_distances)-2)

        distances_from_origin_dict = dict(zip(parks_within_bounding_box.keys(), distances_from_origin))
        sum_distances_dict = dict(zip(parks_within_bounding_box.keys(), sum_distances))

        sum_distances_minus_average = {k:v-average_distance for (k, v) in sum_distances_dict.items()}
        waypoint_distances_closer_than_average = {k:v for (k, v) in sum_distances_minus_average.items() if v < 0}

        waypoint_distance_from_origin = {k:v for (k, v) in distances_from_origin_dict.items() if k in distances_from_origin_dict.keys() & waypoint_distances_closer_than_average.keys()}
        del waypoint_distance_from_origin['origin']

        closest_waypoint = min(waypoint_distance_from_origin, key=waypoint_distance_from_origin.get)
        print('MatrixCalc, closest waypoint', closest_waypoint)
        list_of_waypoints.append(parks_within_bounding_box[closest_waypoint])
        list_of_waypoints_names.append(closest_waypoint)
        print('MatrixCalc, list of waypoint names', list_of_waypoints_names)
        return closest_waypoint
    #     features_list.remove(features_list[min_distance_index])
    #     # loop_count = loop_count + 1
    #     # print(list_of_waypoints)
