matrix_result = {'distances_from_waypoint': [{'origin': 0.0, 'destination': 5421.1, '866': 431.0, '910': 742.2, '1095': 880.2, '1350': 514.5, '1369': 577.4, '1385': 555.8, '1518': 387.8, '1521': 398.3, '1850': 577.4, '2003': 722.1, '2629': 508.1, '2643': 624.4, '2767': 666.4}], 'dict_of_waypoints': [{'1518': [-0.087419024791445, 51.517718896902]}], 'next_waypoint_id': '1518', 'next_waypoint_lonLat': [-0.087419024791445, 51.517718896902]}

distance_from_next_waypoint_to_destination = matrix_result['distances_from_waypoint'][0][matrix_result['next_waypoint_id']]
print(distance_from_next_waypoint_to_destination)




# {'distances_from_waypoint': [
#     {'origin': 0.0, 'destination': 3311.2, 866: 431.0, 910: 742.2, 1095: 880.2, 1350: 514.5, 1369: 577.4, 1385: 555.8, 1518: 387.8, 1521: 398.3, 1850: 577.4, 2003: 722.1, 2629: 508.1, 2643: 624.4, 2767: 666.4}],
# 'dict_of_waypoints': [{1518: [-0.087419024791445, 51.517718896902]}],
# 'closest_waypoint_lonLat': [-0.087419024791445, 51.517718896902]}
#
# {'code': 'Ok',
# 'distances': [
#     [0.0, 3311.2, 431.0, 742.2, 880.2, 514.5, 577.4, 555.8, 387.8, 398.3, 577.4, 722.1, 508.1, 624.4, 666.4],
#     [3311.2, 0.0, 3075.5, 3006.4, 2961.2, 3487.7, 3290.0, 2891.6, 3017.9, 3101.5, 3290.0, 2718.2, 3209.4, 3049.1, 3150.5]
#     ],
# 'destinations':
#     [{'distance': 25.786855429, 'name': 'Broadgate', 'location': [-0.083903, 51.518885]}, {'distance': 0.412237776, 'name': '', 'location': [-0.122794, 51.511979]}, {'distance': 9.479630844, 'name': 'Great Winchester Street', 'location': [-0.084567, 51.515955]}, {'distance': 76.665687963, 'name': 'Bunhill Row', 'location': [-0.089775, 51.522259]}, {'distance': 13.11694105, 'name': 'Dufferin Street', 'location': [-0.090142, 51.523268]}, {'distance': 0.431035718, 'name': 'Western Courtyard', 'location': [-0.078821, 51.51668]}, {'distance': 17.817922083, 'name': 'Camomile Street', 'location': [-0.08047, 51.515688]}, {'distance': 11.467018898, 'name': '', 'location': [-0.087454, 51.516022]}, {'distance': 3.745386976, 'name': 'Finsbury Circus', 'location': [-0.087367, 51.517728]}, {'distance': 0.791085295, 'name': '', 'location': [-0.087308, 51.520408]}, {'distance': 17.817922083, 'name': 'Camomile Street', 'location': [-0.08047, 51.515688]}, {'distance': 1.55916909, 'name': 'Basinghall Avenue', 'location': [-0.090336, 51.516881]}, {'distance': 1.924043319, 'name': '', 'location': [-0.083147, 51.515845]}, {'distance': 1.562670983, 'name': '', 'location': [-0.083197, 51.514963]}, {'distance': 19.325256171, 'name': "St Helen's Place", 'location': [-0.081684, 51.515094]}], 'sources': [{'distance': 25.786855429, 'name': 'Broadgate', 'location': [-0.083903, 51.518885]}, {'distance': 0.412237776, 'name': '', 'location': [-0.122794, 51.511979]}]}
