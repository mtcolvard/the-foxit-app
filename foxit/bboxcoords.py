import math
from mapbox import DirectionsMatrix
# from views import BoundingBox

service = DirectionsMatrix(access_token='pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ')

origin = [-0.071132, 51.518891]
bb_width = 100

# class BoundingBoxMath:

def calc_lon_lat_offset(*args):
    global lat_offset, lon_offset
    lat_offset = (1/111111)*bb_width
    lon_offset = 1/(111111*math.cos(math.radians(origin[1])))*bb_width
    return lat_offset, lon_offset
calc_lon_lat_offset()

bb_coords_NW = [origin[0] - lon_offset, origin[1] + lat_offset]
bb_coords_NE = [origin[0] + lon_offset, origin[1] + lat_offset]
bb_coords_SW = [origin[0] - lon_offset, origin[1] - lat_offset]
bb_coords_SE = [origin[0] + lon_offset, origin[1] - lat_offset]
print(bb_coords_NE, bb_coords_SE, bb_coords_SW, bb_coords_NW)


    # def find_route_waypoints(BoundingBox):
    #     loop_count = 0
    #
    #     features_list = [features_list_dict_tower_hamlets['aa'], features_list_dict_tower_hamlets['bb'], features_list_dict_tower_hamlets['cc'], features_list_dict_tower_hamlets['dd'], features_list_dict_tower_hamlets['ee'], features_list_dict_tower_hamlets['ff'], features_list_dict_tower_hamlets['gg'], features_list_dict_tower_hamlets['hh']]
    #
    #     response = service.matrix(features_list, profile='mapbox/walking', sources=[0, 1], annotations=['distance'])
    #     data = response.json()
    #
    #     # calculate the distance to each possible waypoint from both the origin and the destination
    #     # for each potential waypoint in the features_list, sum its distance from both the origin and the destination and then find the waypoint with the smallest total distance.
    #     # convert the sum_distances list into a dictionary to keep track of indexes relative to the features_list
    #     # lets try converting distance from origin into a dictionary, sorting it, and then comparing it to the sum_distances_minus_average to find the lowest value from the set
    #     distances_from_origin = data['distances'][0]
    #     distances_from_destination = data['distances'][1]
    #     sum_distances = list(map(add, distances_from_origin, distances_from_destination))
    #     average_distance = sum(sum_distances[2::])/(len(sum_distances)-2)
    #
    #     distances_from_origin_dict = dict(zip(features_list_dict_tower_hamlets.keys(), distances_from_origin))
    #     sum_distances_dict = dict(zip(features_list_dict_tower_hamlets.keys(), sum_distances))
    #
    #     sum_distances_minus_average = {k:v-average_distance for (k, v) in sum_distances_dict.items()}
    #     waypoint_distances_closer_than_average = {k:v for (k, v) in sum_distances_minus_average.items() if v < 0}
    #     waypoint_distance_from_origin = {k:v for (k, v) in distances_from_origin_dict.items() if k in distances_from_origin_dict.keys() & waypoint_distances_closer_than_average.keys()}
    #     del waypoint_distance_from_origin['aa']
    #
    #     closest_waypoint = min(waypoint_distance_from_origin, key=waypoint_distance_from_origin.get)
    #     print(closest_waypoint)
    #     list_of_waypoints.append(features_list_dict_tower_hamlets[closest_waypoint])
    #     list_of_waypoints_names.append(closest_waypoint)
    #     print(list_of_waypoints_names)
    # #     features_list.remove(features_list[min_distance_index])
    # #     # loop_count = loop_count + 1
    # #     # print(list_of_waypoints)
