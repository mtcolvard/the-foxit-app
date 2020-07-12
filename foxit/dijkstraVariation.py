from .distanceAndBearingCalcs import DistanceAndBearing

# total_dict = {}
# graph_nodes = list(total_dict.keys())
# infinity = float('inf')
# waypoints_graph = {}
# waypoints_costs = {}
# waypoints_parents = {}
# waypoints_processed = []

def create_waypoints_graph():
    count = 0
    for element in graph_nodes[1:]:
        waypoints_costs[element] = infinity
        waypoints_parents[element] = None
    for node in graph_nodes:
        waypoints_graph[node] = {}
        if len(graph_nodes) -3 > count:
            waypoints_graph[node][graph_nodes[count + 1]] = total_dict[graph_nodes[count + 1]]['lon_lat']
            waypoints_graph[node][graph_nodes[count + 2]] = total_dict[graph_nodes[count + 2]]['lon_lat']
            waypoints_graph[node][graph_nodes[count + 3]] = total_dict[graph_nodes[count + 3]]['lon_lat']
            count = count + 1
        elif len(graph_nodes) - 2 > count:
            waypoints_graph[node][graph_nodes[count + 1]] = total_dict[graph_nodes[count + 1]]['lon_lat']
            waypoints_graph[node][graph_nodes[count + 2]] = total_dict[graph_nodes[count + 2]]['lon_lat']
            count = count + 1
        elif len(graph_nodes) - 1 > count:
            waypoints_graph[node][graph_nodes[count + 1]] = total_dict[graph_nodes[count + 1]]['lon_lat']
            count = count + 1
    return waypoints_graph, waypoints_costs, waypoints_parents

def populate_waypoints_graph_distances():
    create_waypoints_graph()
    for k, v in waypoints_graph.items():
        for key, value in v.items():
            dist_from_current_waypoint_coord = DistanceAndBearing.crowflys_bearing(key, total_dict[k]['lon_lat'], value)[0]
            v.update({key: dist_from_current_waypoint_coord})

    print(total_dict)
    print(graph_nodes)
    print(waypoints_graph)
    print(waypoints_costs)
    print(waypoints_parents)
    print(waypoints_processed)

    waypoints_costs[graph_nodes[1]] = waypoints_graph[graph_nodes[0]][graph_nodes[1]]
    waypoints_costs[graph_nodes[2]] = waypoints_graph[graph_nodes[0]][graph_nodes[2]]
    waypoints_costs[graph_nodes[3]] = waypoints_graph[graph_nodes[0]][graph_nodes[3]]
    waypoints_parents[graph_nodes[1]] = graph_nodes[0]
    waypoints_parents[graph_nodes[2]] = graph_nodes[0]
    waypoints_parents[graph_nodes[3]] = graph_nodes[0]

    print(waypoints_graph, waypoints_costs, waypoints_parents)
    return waypoints_graph, waypoints_costs, waypoints_parents

def find_lowest_cost_node():
    lowest_cost = float('inf')
    lowest_cost_node = None
    for node in waypoints_costs:
        cost = waypoints_costs[node]
        if cost < lowest_cost and node not in waypoints_processed:
            lowest_cost = cost
            lowest_cost_node = node
    return lowest_cost_node

def run_dijkstra(total_dict_sorted_by_distance):
    global total_dict, graph_nodes, infinity, waypoints_graph, waypoints_costs, waypoints_parents, waypoints_processed
    total_dict = total_dict_sorted_by_distance
    graph_nodes = list(total_dict.keys())
    infinity = float('inf')
    waypoints_graph = {}
    waypoints_costs = {}
    waypoints_parents = {}
    waypoints_processed = []
    populate_waypoints_graph_distances()
    node = find_lowest_cost_node()
    while node is not None:
        cost = waypoints_costs[node]
        neighbors = waypoints_graph[node]
        for n in neighbors.keys():
            new_cost = cost + neighbors[n]
            if waypoints_costs[n] > new_cost:
                waypoints_costs[n] = new_cost
                waypoints_parents[n] = node
        waypoints_processed.append(node)
        node = find_lowest_cost_node()
    print(waypoints_parents)
    dijkstra_path = backtrace_dijkstra_path()
    return dijkstra_path

def backtrace_dijkstra_path():
    dijkstra_path = []
    waypoint = waypoints_parents[graph_nodes[-1]]
    while waypoint is not graph_nodes[0]:
        dijkstra_path.append(waypoint)
        waypoint = waypoints_parents[dijkstra_path[-1]]
    dijkstra_path.reverse()
    print(dijkstra_path)
    return dijkstra_path
