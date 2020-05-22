from mapbox import Directions

service = Directions(access_token='pk.eyJ1IjoibXRjb2x2YXJkIiwiYSI6ImNrMDgzYndkZjBoanUzb21jaTkzajZjNWEifQ.ocEzAm8Y7a6im_FVc92HjQ')

features_dict = {'1518': [-0.087419024791445, 51.517718896902], '1385': [-0.087494313257733, 51.515921612032], '2003': [-0.090337358976231, 51.516867197055], '854': [-0.093218055745589, 51.51691406886], '1061': [-0.093218055745589, 51.51691406886], '2113': [-0.094620903404705, 51.517836124354], '940': [-0.096061284965339, 51.517859516813], '2172': [-0.096136233685337, 51.516062222945], '2321': [-0.097576560563233, 51.516085596232], '1231': [-0.09905430420776, 51.515210303177], '1232': [-0.10049460665516, 51.515233640365], '2268': [-0.10053199123268, 51.514334990795], '896': [-0.10197226730847, 51.514358309561], '2611': [-0.10204697403704, 51.512561008454], '902': [-0.10348719543436, 51.512584308055], '2612': [-0.10348719543436, 51.512584308055], '1363': [-0.10060675457565, 51.512537691179], '1148': [-0.099166537051638, 51.512514356231], '1513': [-0.097726321466478, 51.512491003609], '2218': [-0.097726321466478, 51.512491003609], 'destination': [-0.049918, 51.516866]}

parks_lonLat_list = features_dict.values()

response = service.directions(parks_lonLat_list, profile='mapbox/walking')
data = response.geojson()

print(data['features'])



# class DirectionsCalculations:
#     def returnRouteGeometry(self, features_dict):
#
#         features = features_dict.values()
#
#         response = service.directions(features, profile='mapbox/walking', alternatives=None, geometries=None, overview=None, steps=None, continue_straight=None, waypoint_snapping=None, annotations=None, language=None)
#         # response.status_code
#         # response.headers['Content-Type']
#
#         data = response.geojson()
#
#         print(data['features'][0]['geometry']['type'])
#
#         return data
