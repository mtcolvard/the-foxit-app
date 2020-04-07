import math

origin = [-0.071132, 51.518891]
destination = [-0.033834, 51.558065]
earth_radius = 6371
bbwidth = 5
midpoint = []


class FindClosestPark:
    def __init__(self, lon_orig, lat_orig, lon_dest, lat_dest):
        self.lon_orig = math.radians(lon_orig)
        self.lat_orig = math.radians(lat_orig)
        self.lon_dest = math.radians(lon_dest)
        self.lat_dest = math.radians(lat_dest)

    def find_midpoint(self):
        Bx = math.cos(self.lat_dest) * math.cos(self.lon_dest - self.lon_orig)
        By = math.cos(self.lat_dest) * math.sin(self.lon_dest - self.lon_orig)
        lat_mid = math.atan2((math.sin(self.lat_orig)+math.sin(self.lat_dest)),
                math.sqrt(math.pow((math.cos(self.lat_orig)+Bx),2)+math.pow(By,2)))

        lon_mid = self.lon_orig + math.atan2(By, math.cos(self.lat_orig)+Bx)
        global midpoint
        midpoint = [lon_mid, lat_mid]
        return midpoint

    def define_bbox(self):
        # boundary box angular radius
        bb_ang_rad = bbwidth/earth_radius
        global bb_lat_min, bb_lat_max
        bb_lat_min = midpoint[1] - bb_ang_rad
        bb_lat_max = midpoint[0] + bb_ang_rad
        return bb_lat_min, bb_lat_max

def main():
    query1 = FindClosestPark(origin[0], origin[1], destination[0], destination[1])
    query1.find_midpoint()
    print(midpoint)
    query1.define_bbox()
    print(bb_lat_min, bb_lat_max)

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
