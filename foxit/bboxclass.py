import math

class FindClosestPark:
    def __init__(self, lon_orig, lat_orig, lon_dest, lat_dest):
        self.lon_orig = math.radians(lon_orig)
        self.lat_orig = math.radians(lat_orig)
        self.lon_dest = math.radians(lon_dest)
        self.lat_dest = math.radians(lat_dest)

    # def convert_to_radians(self):
    #     rlon_orig = math.radians(self.lon_orig)
    #     rlat_orig = math.radians(self.lat_orig)
    #     rlon_dest = math.radians(self.lon_dest)
    #     rlat_dest = math.radians(self.lat_dest)
    #     return rlon_orig, rlat_orig, rlon_dest, rlat_dest

    def find_midpoint(self):
        Bx = math.cos(self.lat_dest) * math.cos(self.lon_dest - self.lon_orig)
        By = math.cos(self.lat_dest) * math.sin(self.lon_dest - self.lon_orig)
        lat_mid = math.atan2(
            (math.sin(self.lat_orig) + math.sin(self.lat_dest)),
            (math.sqrt((math.cos(self.lon_orig)+Bx)*(math.cos(self.lon_orig)+Bx) + By*By)))
        print(math.degrees(lat_mid))
        return lat_mid


Bx = cos φ2 ⋅ cos Δλ
By = cos φ2 ⋅ sin Δλ
φm = atan2( sin φ1 + sin φ2, √(cos φ1 + Bx)² + By² )
λm = λ1 + atan2(By, cos(φ1)+Bx)

var Bx = Math.cos(φ2) * Math.cos(λ2-λ1);
var By = Math.cos(φ2) * Math.sin(λ2-λ1);
var φ3 = Math.atan2(Math.sin(φ1) + Math.sin(φ2),
                    Math.sqrt( (Math.cos(φ1)+Bx)*(Math.cos(φ1)+Bx) + By*By ) );
var λ3 = λ1 + Math.atan2(By, Math.cos(φ1) + Bx);
The longitude can be normalised to −180…+180 using (lon+540)%360-180
