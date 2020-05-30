import math



51.533174, -0.077015

origin = (-0.07112, 51.51883)
destination = (-0.058508, 51.528368)
waypoint1 = (-0.064426, 51.524936)
waypoint2 = (-0.061608, 51.523735)

def crowflys_bearing(startpoint, endpoint):

    startpoint_lon = startpoint[0]
    startpoint_lat = startpoint[1]
    endpoint_lon = endpoint[0]
    endpoint_lat = endpoint[1]

    R = 6371000
    φ1 = startpoint_lat * math.pi/180
    φ2 = endpoint_lat * math.pi/180
    Δφ = (endpoint_lat - startpoint_lat) * math.pi/180
    Δλ = (endpoint_lon - startpoint_lon) * math.pi/180

    # CROWFLYS
    a = math.sin(Δφ/2) * math.sin(Δφ/2) + math.cos(φ1) * math.cos(φ2) * math.sin(Δλ/2) * math.sin(Δλ/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    crowflys = R * c

    # BEARING
    y = math.sin(Δλ) * math.cos(φ2)
    x = math.cos(φ1)*math.sin(φ2) - math.sin(φ1)*math.cos(φ2)*math.cos(Δλ)
    θ = math.atan2(y, x)
    bearing = (θ*180/math.pi + 360) % 360

    return crowflys, θ

def perpendicular_distance_from_bestfit_line(bestFit, waypoint):
    angle_to_waypoint = math.fabs(bestFit[1] - waypoint[1])
    # print('angle_to_waypoint', angle_to_waypoint)
    # print('waypoint[0]', waypoint[0])
    # print('sin angeltowaypoint',math.sin(angle_to_waypoint))
    perp_distance = waypoint[0] * math.sin(angle_to_waypoint)
    # print('perp_distance', perp_distance)
    # print(perp_distance)




# def main():
#     bestFit = crowflys_bearing(origin, destination)
#     print('bestfit', bestFit)
#     waypoint = crowflys_bearing(origin, waypoint2)
#     perpendicular_distance_from_bestfit_line(bestFit, waypoint)
#
#
# if __name__ == "__main__":
#     main()


# attempt at sliding bounding box between 60 and 120 degress
# if θ > math.pi*2/3 and θ > math.pi/3:
#     lon_atan2offset = math.cos(math.pi/3) * crowflys
#     verticle_bb(lon_atan2offset)
#
# def verticle_bb(offset):
#     lon_max = origin_lon + (math.cos(θ)/offset)
#     lon_min = origin_lon - ((offset - math.cos(θ))/offset)
#     lat_max = destination_lat
#     lat_min = origin_lat
#     print(lon_max)
