import math

origin = [-0.071132, 51.518891]
bb_width = 1000

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
