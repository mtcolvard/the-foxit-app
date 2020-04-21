import math

origin = [-0.071132,51.518891]
destination = [-0.033834, 51.558065]
earth_radius = 6371
bb_width = 1
midpoint = []


class FindClosestPark:
    def __init__(self, lon_orig, lat_orig, lon_dest, lat_dest):
        self.lon_orig = math.radians(lon_orig)
        self.lat_orig = math.radians(lat_orig)
        self.lon_dest = math.radians(lon_dest)
        self.lat_dest = math.radians(lat_dest)

    def find_midpoint(self):
        # global midpoint, midpoint_deg
        Bx = math.cos(self.lat_dest) * math.cos(self.lon_dest - self.lon_orig)
        By = math.cos(self.lat_dest) * math.sin(self.lon_dest - self.lon_orig)
        lat_mid = math.atan2((math.sin(self.lat_orig)+math.sin(self.lat_dest)),
                math.sqrt(math.pow((math.cos(self.lat_orig)+Bx),2)+math.pow(By,2)))

        lon_mid = self.lon_orig + math.atan2(By, math.cos(self.lat_orig)+Bx)
        midpoint_deg = []
        self.midpoint = [lon_mid, lat_mid]
        midpoint_deg = [math.degrees(point) for point in midpoint]
        midpoint_deg.reverse()
        return self

    def define_bbox(self):
        global bb_lon_min, bb_lat_min, bb_lon_max, bb_lat_max, bb_box, bb_box_deg
        # boundary box angular radius
        bb_ang_rad = bb_width/earth_radius
        bb_lat_min = self.midpoint[1] - bb_ang_rad
        bb_lat_max = self.midpoint[1] + bb_ang_rad
        bb_latT = math.asin(math.sin(self.midpoint[1])/math.cos(bb_ang_rad))
        bb_lon_delta = math.acos((math.cos(bb_ang_rad)-math.sin(bb_latT)*math.sin(self.midpoint[1]))/(math.cos(bb_latT)*math.cos(self.midpoint[1])))

        bb_lon_min = self.midpoint[0] - bb_lon_delta
        bb_lon_max = self.midpoint[0] + bb_lon_delta
        bb_box = [bb_lon_min, bb_lat_min, bb_lon_max, bb_lat_max]
        bb_box_deg = [math.degrees(point) for point in bb_box]
        bb_box_deg.reverse()
        origin.reverse()
        destination.reverse()
        # print(origin)
        # print(math.degrees(bb_lat_min), math.degrees(bb_lon_min), math.degrees(bb_lat_max), math.degrees(bb_lon_max))
        print(bb_lon_min)
        return bb_lon_min, bb_lat_min, bb_lon_max, bb_lat_max

    # def create_dict(self):
    #     list_coords = origin + destination + midpoint_deg + bb_box_deg
    #     for
    #     print(list_coords)


def main():
    query1 = FindClosestPark(origin[0], origin[1], destination[0], destination[1])
    query1.find_midpoint()
    query1.define_bbox()
    # query1.create_dict()
    # print(origin + destination + midpoint_deg + bb_box_deg)


if __name__ == "__main__":
    main()
# Bx = cos φ2 ⋅ cos Δλ
# By = cos φ2 ⋅ sin Δλ
# φm = atan2( sin φ1 + sin φ2, √(cos φ1 + Bx)² + By² )
# λm = λ1 + atan2(By, cos(φ1)+Bx)
#
# var Bx = Math.cos(φ2) * Math.cos(λ2-λ1);
# var By = Math.cos(φ2) * Math.sin(λ2-λ1);
# var φ3 = Math.atan2(Math.sin(φ1) + Math.sin(φ2),
#                     Math.sqrt( (Math.cos(φ1)+Bx)*(Math.cos(φ1)+Bx) + By*By ) );
# var λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);
# The longitude can be normalised to −180…+180 using (lon+540)%360-180
