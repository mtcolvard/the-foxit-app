import math

class DistanceAndBearing:
    def crowflys_bearing(self, startpoint, endpoint):

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
        return crowflys, θ, bearing



    def perpendicular_distance_from_bestfit_line(self, bestFit, waypointFit):
        angle_to_waypoint = math.fabs(bestFit[1] - waypointFit[1])
        perp_distance_to_waypoint = waypointFit[0] * math.sin(angle_to_waypoint)
        return perp_distance_to_waypoint




# def main():
#     bestFit = crowflys_bearing(origin, destination)
#     print('bestfit', bestFit)
#     waypoint = crowflys_bearing(origin, waypoint2)
#     perpendicular_distance_from_bestfit_line(bestFit, waypoint)
#
#
# if __name__ == "__main__":
#     main()
