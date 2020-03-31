import math

# First, convert all latitude and longitude to radians
# To create a bounding box whose width is d wide and whose length is the distance between point A (lonA, latA) and point B (lonB, latB) on a sphere, we first find the midpoint M between the coordinates of point A and the coordinates of point B.
# Next, we find the circle that is formed by all points which have distance d from M.
# Then, we compute the bounding coordinates (latmin, lonmin) and (latmax, lonmax) which are opposite corners of a bounding rectangle (on the sphere) that completely contains this "query" circle.
# calculating the maxLat and minLat is fairly straight forward. First convert the width of the bounding box to radians by calculating the angular radius of the query circle.  Pick the width you want and call it d. The radius of the earth is R = 6371 km.  The angular radius r is:    r = d/R
# NOTE: ALL COORDINATES ARE [LONGITUDE, LATITUDE]
# THIS IS GEOJSON STANDARD.

φ
λ

R = 6371 # Earth Radius
boxWidth = 0
coordA = []
coordB = []
midpoint = []

#Convert to radians
def convert_to_radians(lon1, lat1, lon2, lat2):
    λ1 = math.radians(lon1)
    φ1 = math.radians(lat1)
    λ2 = math.radians(lon2)
    φ2 = math.radians(lat2)

convert_to_radians(coordA[0], coordA[1], coordB[0], coordB[1])

def midpoint(λ1, φ1, λ2, φ2):
#Input values as degrees

    bx = math.cos(φ2) * math.cos(λ2 - λ1)
    by = math.cos(φ2) * math.sin(λ2 - λ1)
    φ3 = math.atan2(math.sin(φ1) + math.sin(φ2), \
           math.sqrt((math.cos(φ1) + bx) * (math.cos(φ1) \
           + bx) + by**2))
    λ3 = λ1 + math.atan2(by, math.cos(φ1) + bx)

    return [round(math.degrees(φ3), 2), round(math.degrees(λ3), 2)]


# dist = arccos(sin(lat1) · sin(lat2) + cos(lat1) · cos(lat2) · cos(lon1 - lon2)) · earth_radius
def calculateGreatCircleDistance(coordA,coordB):
    boxLength = math.acos((math.sin(coordA[1]) * math.sin(coordB[1])) + (math.cos(coordA[1]) * math.cos(coordB[1]) * math.cos(coordA[0] - coordB[0]))) * R
    return boxLength

def findQueryCircleRadius(boxWidth)
    queryRadius = boxWidth//R
    return queryRadius

# then calculate the maxLat and minLat of the bounding box
def findMaxLat(midpoint)
    maxLat = midpoint[0] -= queryRadius
    return maxLat

def findMinLat(midpoint)
    minLat = midpoint[1] -= queryRadius
    return maxLat

# then calculate the maxLon and minLon of the bounding boxWidth
# NOTE: this method will not work near Poles or the 180th meridian
# it is necessary to adjust the latitude because spherical geometry
def calculateAdjustedLatitude(midpoint)
    adjLat = math.asin(math.sin(midpoint[1])//math.cos(queryRadius))
    return adjLat

# latT = arcsin(sin(lat)/cos(r))
# lonmin = lonT1 = lon - Δlon
# lonmax = lonT2 = lon + Δlon
# where
# Δlon = arccos(( cos(r) - sin(latT) · sin(lat)) / (cos(latT) · cos(lat)))
#       = arcsin(sin(r)/cos(lat))

def findMaxLon()
