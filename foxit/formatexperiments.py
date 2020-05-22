import mapbox

help(mapbox.Directions)

# dict_of_waypoints = {'1518': [-0.087419024791445, 51.517718896902], '1385': [-0.087494313257733, 51.515921612032], '2003': [-0.090337358976231, 51.516867197055], '854': [-0.093218055745589, 51.51691406886], '1061': [-0.093218055745589, 51.51691406886], '2113': [-0.094620903404705, 51.517836124354], '940': [-0.096061284965339, 51.517859516813], '2172': [-0.096136233685337, 51.516062222945], '2321': [-0.097576560563233, 51.516085596232], '1231': [-0.09905430420776, 51.515210303177], '1232': [-0.10049460665516, 51.515233640365], '2268': [-0.10053199123268, 51.514334990795], '896': [-0.10197226730847, 51.514358309561], '2611': [-0.10204697403704, 51.512561008454], '902': [-0.10348719543436, 51.512584308055], '2612': [-0.10348719543436, 51.512584308055], '1363': [-0.10060675457565, 51.512537691179], '1148': [-0.099166537051638, 51.512514356231], '1513': [-0.097726321466478, 51.512491003609], '2218': [-0.097726321466478, 51.512491003609], '2228': [-0.097688884151101, 51.513389652002], '2489': [-0.096211174637081, 51.514264928445], '1637': [-0.093293113825296, 51.51511677767], '1574': [-0.091815264711367, 51.51599199703], '938': [-0.089009852504822, 51.514147804368], '2467': [-0.087607231326107, 51.513225683539], '1571': [-0.08764486678115, 51.512327040392], '2641': [-0.08764486678115, 51.512327040392], '833': [-0.089122673954283, 51.511451872672], '2735': [-0.089160277206484, 51.510553228457], '2766': [-0.087720131840413, 51.510529753622], '1522': [-0.08779538909947, 51.508732466219], '2776': [-0.084877533166465, 51.509584108817], '2639': [-0.083437421956153, 51.509560581718], '2753': [-0.083399707449843, 51.510459223084], '1511': [-0.08192182513119, 51.511334318014], '2733': [-0.079003695960983, 51.512185811231], '2731': [-0.078965890677145, 51.51308444986], '2628': [-0.077487838536433, 51.513959486772], '1369': [-0.080292766543172, 51.515803950192], '1850': [-0.080292766543172, 51.515803950192], '2629': [-0.083173379363984, 51.515851067954], '866': [-0.084613688708361, 51.515874600322], '2643': [-0.083211105598963, 51.514952427538], '2600': [-0.081808579106732, 51.514030238427], '2661': [-0.081808579106732, 51.514030238427], '2080': [-0.086129337287234, 51.514100831015], '1624': [-0.090450113038398, 51.514171264532], '2592': [-0.094695908749751, 51.516038831983], '941': [-0.09454589028448, 51.519633416092], '1064': [-0.097389315769702, 51.520578833455], '1586': [-0.097351860987737, 51.521477480425], '1534': [-0.094470869388012, 51.521430707198], '2355': [-0.092955291188137, 51.52320458304], '2746': [-0.094320804262089, 51.525025287512], '2380': [-0.094283283118793, 51.525923932195], '964': [-0.092880198087764, 51.525001871383], '1355': [-0.09860519828627, 51.525994076737], '2190': [-0.10288977780248, 51.526962711148], '2720': [-0.10436777900783, 51.526087355242], '2576': [-0.10728634718486, 51.525235236999], '2666': [-0.10592030681413, 51.523414678219], '1273': [-0.10451705882235, 51.522492754647], '1266': [-0.10739813419693, 51.52253928185], '2716': [-0.10459168712387, 51.520695453402], '1521': [-0.087306077458283, 51.520414823021], '910': [-0.088671282889504, 51.522235590909], '1095': [-0.090074197976318, 51.523157700738], '2051': [-0.084274319440661, 51.523962363714], '1810': [-0.082682760333115, 51.527533378947], '919': [-0.08412343783119, 51.527556921105], '2742': [-0.078398576235896, 51.526564010284], '1040': [-0.075555186872678, 51.525618133595], '1839': [-0.069678742519302, 51.528219335204], '1829': [-0.066721235716513, 51.529969137313], '2901': [-0.065280496813107, 51.529945380685], '1592': [-0.065128086993991, 51.53353989429], 'destination': [-0.049918, 51.516866]}
#
# markerArray =  dict_of_waypoints.values()
# print(markerArray)





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
