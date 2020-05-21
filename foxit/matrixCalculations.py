from operator import add
from mapbox import DirectionsMatrix

service = DirectionsMatrix(access_token='pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ')

origin = [-0.047092, 51.519331]
destination = [-0.043618, 51.538311]

# parks_within_bounding_box = {'origin': [-0.084254, 51.518961], 'destination': [-0.043618, 51.538311], 833: [-0.089122673954283, 51.511451872672], 854: [-0.093218055745589, 51.51691406886], 866: [-0.084613688708361, 51.515874600322], 910: [-0.088671282889504, 51.522235590909], 919: [-0.08412343783119, 51.527556921105], 938: [-0.089009852504822, 51.514147804368], 940: [-0.096061284965339, 51.517859516813], 941: [-0.09454589028448, 51.519633416092], 964: [-0.092880198087764, 51.525001871383], 1040: [-0.075555186872678, 51.525618133595], 1061: [-0.093218055745589, 51.51691406886], 1064: [-0.097389315769702, 51.520578833455], 1095: [-0.090074197976318, 51.523157700738], 1178: [-0.085601812291904, 51.526681805717], 1224: [-0.074417864366412, 51.518405409273], 1263: [-0.096323571501542, 51.511568985509], 1350: [-0.078814649948071, 51.516679002793], 1355: [-0.09860519828627, 51.525994076737], 1369: [-0.080292766543172, 51.515803950192], 1385: [-0.087494313257733, 51.515921612032], 1511: [-0.08192182513119, 51.511334318014], 1513: [-0.097726321466478, 51.512491003609], 1518: [-0.087419024791445, 51.517718896902]}

dict_of_waypoints = {}
list_of_waypoints_names = []

# """This pings the MapBox Matrix API to caluculate the distance to every park within a given bounding box distance of the current waypoint (which is initially the origin) and the distance from each of those parks to the destination.  It then sums to find the total distance to the destination through each park and averages the distances to create a subset of parks whose total distance is below the average.  Then it finds the closest park in that set to the current waypoint. This will be the closest park in the direction of the destination  It then calls the database to determine the next set of parks within the bounding box distance of that park"""

class MatrixCalculations:
    # def find_route_waypoints(self, parks_within_bounding_box, bounding_box_width):
    def find_route_waypoints(self, parks_within_bounding_box, bounding_box_width, next_waypoint_id):

        parks_lonLat_list = parks_within_bounding_box.values()
        response = service.matrix(parks_lonLat_list, profile='mapbox/walking', sources=[0, 1], annotations=['distance'])
        data = response.json()
        distances_from_origin = data['distances'][0]
        distances_from_destination = data['distances'][1]

        # for each potential waypoint in the parks_list, sum its distance from both the origin and the destination and calculate the average length of the distances.
        sum_distances = list(map(add, distances_from_origin, distances_from_destination))
        average_distance = sum(sum_distances[2::])/(len(sum_distances)-2)

        # because the mapbox response snaps the lon_lat coord to nearest address on a road map create new dictionaries preserving our park keys, but one with the values of the distances to each park from the origin, and one with the total distance of a route going from the origin to the destination through that park
        distances_from_origin_dict = dict(zip(parks_within_bounding_box.keys(), distances_from_origin))
        distances_from_destination_dict = dict(zip(parks_within_bounding_box.keys(), distances_from_destination))
        sum_distances_dict = dict(zip(parks_within_bounding_box.keys(), sum_distances))

        #  create a subset of the parks(waypoints) where the total distance of a route through them is less than the average total distance across all parks
        sum_distances_minus_average = {k:v-average_distance for (k, v) in sum_distances_dict.items()}
        waypoint_distances_closer_than_average = {k:v for (k, v) in sum_distances_minus_average.items() if v < 0}
        waypoint_distance_from_origin = {k:v for (k, v) in distances_from_origin_dict.items() if k in distances_from_origin_dict.keys() & waypoint_distances_closer_than_average.keys()}
        del waypoint_distance_from_origin['origin']
        if next_waypoint_id == None:
            pass
        else:
            del waypoint_distance_from_origin[next_waypoint_id]

        # find the closest park(waypoint)
        closest_waypoint = min(waypoint_distance_from_origin, key=waypoint_distance_from_origin.get)
        print('closest_waypoint', closest_waypoint)

        # update the dictionary of waypoints to include this new waypoint
        dict_of_waypoints.update({closest_waypoint: parks_within_bounding_box[closest_waypoint]})
        list_of_waypoints_names.append(closest_waypoint)
        closest_waypoint_lonLat = dict_of_waypoints[closest_waypoint]
        matrix_response_dict = {
        'distances_from_current_waypoint': [distances_from_destination_dict],
        'dict_of_waypoints': [dict_of_waypoints],
        'next_waypoint_id': closest_waypoint,
        'next_waypoint_lonLat': closest_waypoint_lonLat}

        return matrix_response_dict
        # if distances_from_origin_dict['origin'] > bounding_box_width:
        #     return closest_waypoint
        # else:
        #     return dict_of_waypoints

        # print('closest waypoint name', closest_waypoint)
        # print('MatrixCalc, dict of waypoints', dict_of_waypoints)
        # print('MatrixCalc, list of waypoint names', list_of_waypoints_names)
    #     parks_list.remove(parks_list[min_distance_index])
    #     # loop_count = loop_count + 1
    #     # print(list_of_waypoints)
