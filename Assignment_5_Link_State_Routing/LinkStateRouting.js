const fs = require('fs');
const readline = require('readline');
const readline_sync = require('readline-sync');



class NetWork {
    constructor () {
        this.network = {};
        this.node_num = 0;
        this.node_array = [];
        this.mark = [];

        var connections = {};
        var routerName = "";
        var routerId = "";

        var input = fs.readFileSync('infile.dat', "utf8");
        var lines = input.split('\n');
        var len = lines.length;
        for (var i=0; i < len; i++) {
            lines[i] = lines[i].replace("\r", "");
            lines[i] = lines[i].replace("\n", "");
        }
        
        var i = 0;
        while(lines[i] != null) {
            if (lines[i].charAt(0) != " ")
            {
                if ("" != routerId) {
                    this.network[routerId] = new Router (routerId, routerName, connections);
                }
                connections = {};
                var strings = lines[i].split(" ");
                // console.log(strings);
                routerId = strings[0];
                this.node_num++;
                this.mark.push(1);
                routerName = strings[1];
                connections[routerId] = 0;
            } else {
                var strings = lines[i].split(" ");
                var simple_string = [];
                for (var j=0; j < strings.length; j++) {
                    if (strings[j] != '') {
                        simple_string.push(strings[j]);
                    }
                }
                // console.log(simple_string);
                var distance;
                if (simple_string.length == 1 ) distance = 1;
                else distance = parseInt(simple_string[1]);
                connections[simple_string[0]] = distance;
            }
            i = i + 1;
        }
        if ("" != routerId) {
            this.network[routerId] = new Router (routerId, routerName, connections);
        }

        for (var row = 0; row < this.node_num; row++) {
            this.node_array[row] = []
            for (var col = 0; col < this.node_num; col++) {
                this.node_array[row][col] = 999;
            }
        }
        
        for (var router in this.network) {
            for (var r in this.network[router].connections) {
                this.node_array[parseInt(router)][parseInt(r)] = this.network[router].connections[r];
            }
        }

        // console.log(this.node_array);
    }

    shutDownRouter(routerId) 
    {
        var router = this.network[routerId];
        if (router == null)
        {
            // invalid router ID
            return;
        }
        router.shutDown();
        //.....shut
        this.network[routerId] = router;
    }

    startUpRouter(routerId)
    {
        var router = this.network[routerId];
        if (router == null)
        {
            // invalid router ID
            return;
        }
        router.startUp();
        //.....shut
        this.network[routerId] = router;
    }

    
    forward(linkStatePackage)
    {
        if (linkStatePackage == null) return;
        for ( var routerId in linkStatePackage.getReceiver())
        {
            var router = this.network[routerId];
            var newLinkStatePackage = router.receivePacket(linkStatePackage, linkStatePackage.getForwardBy());
            this.network[routerId] = router;
            if (newLinkStatePackage == null) continue;
            this.forward(newLinkStatePackage);
        }
        
    }

    con()
    {   
        for ( var routerId in this.network)
        {
            var router = this.network[routerId];
            var linkStatePackage = router.originatePacket();

            console.log(linkStatePackage);
            this.forward(linkStatePackage);
        }
    }
    
    printRoutingTable(routerId)
    {
        var router = this.network[routerId];
        if (router == null) {
            console.log("Invalid router ID. Pls Try Again.");
            return;
        } 

        var index = parseInt(routerId);
        var dist = [];
        var i, j, k;
        var point = [];

        for (j = 0; j < this.node_num; j++) {
            dist[j] = this.node_array[index][j];
        }

        this.mark[index] = 0;
        point[index] = index;
        for (i = 0; i < this.node_num - 1; i++) {
            var min = [0, 0, 999];
            for (j = 0; j < this.node_num; j++) {
                if (this.mark[j]) {
                    if (this.node_array[i][j] < min[2]) {
                        min = [i, j, this.node_array[i][j]];
                    }
                }
            }
            this.mark[min[1]] = 0;
            for (k = 0; k < this.node_num; k++) {
                if (this.node_array[min[1]][k] + dist[min[1]] <= dist[k]) {
                    dist[k] = this.node_array[min[1]][k] + dist[min[1]];
                    if(point[k] == null)point[k] = min[1];
                }
            }
        }

        console.log("The routing table for " + routerId + " is:");
        for (var i = 0; i < this.node_num; i++) {
            console.log(this.network[point[i]].network_name + ', ' + point[i]);
        }
    }
}

class Router {
    constructor (id, network_name, connections) {
        this.id = id;   // string
        this.on = true; // boolean
        this.network_name = network_name;   // string
        this.sequence_num = 0;  // int
        this.connections = connections; // Map<String, Integer>
        this.tick_counter = {}; // Map<String, Integer>
        this.routing_table = {};    // Map<String, Integer>
        this.private_network = {};  // Map<String, Map<String, Integer>>
        this.sequence_num_map = {}; // Map<String, Integer>
        
        // Init private network and tick counter.
        for (var router_id in this.connections) {
            // Init tickCounter, all set 0;
            this.tick_counter[router_id] = 0;
            // Init the cost from the reverse way.
            if (router_id == this.id) {
                continue;
            }
            var network_cost = {};
            network_cost[this.id] = this.connections[router_id];
            this.private_network[router_id] = network_cost;
        }
        this.private_network[this.id] = connections;
        this.sequence_num_map = {};
        // console.log("_____________________________________________");
        // console.log(this.private_network);
        // console.log("_____________________________________________");
    }

    getNetworkName () {
        return this.network_name;
    }

    getId () {
        return this.id;
    }

    getRoutingTable () {
        return this.routing_table;
    }

    shutDown () {
        this.on = false;
    }

    startUp () {
        for (var c in this.tick_counter) {
            this.tick_counter[c] = 0;
        }
        this.on = true;
    }

    receivePacket (link_state_package, forward_router_id) {
        if (!this.on) {
            return null;
        }
        if (link_state_package.getOriginate() == this.id) {
            return null;
        }

        this.tick_counter[link_state_package.getOriginate()] = 0;

        var sn = link_state_package.getSequenceNum();
        if (this.sequence_num_map[link_state_package.getOriginate()] != null && this.sequence_num_map[link_state_package.getOriginate() >= sn]) {
            return null;
        }

        this.sequence_num_map[link_state_package.getOriginate()] = sn;

        link_state_package.visit();

        var network = link_state_package.getPrivateNetwork();
        for (var router_a in network) {
            if (this.private_network[router_a]) {
                var costs = this.private_network[router_a];
                costs[router_a] = 0;
                this.private_network[router_a] = costs;
            } else {
                var costs = {};
                costs[router_a] = 0;
                this.private_network[router_a] = costs;
            }
            for (var router_b in network[router_a]) {
                var costs = {};
                if (this.private_network[router_a]) {
                    costs = this.private_network[router_a];
                } else {
                    costs = {};
                }
                costs[router_b] = network[router_a][router_b];
                this.private_network[router_a] = costs;
            }
        }

        this.generateRoutingTable();

        if (link_state_package.getTtl() <= 0) {
            return null;
        }
        var receivers = [];
        for (var router in this.private_network[this.id]) {
            if (this.private_network[this.id][router]) {
                receivers.push(router);
            }
        }
        link_state_package.setReceiver(receivers);
        link_state_package.setForwardBy(this.id);
        return link_state_package;
    }

    generateRoutingTable () {
        var v = this.private_network; //MARK
        // console.log(v);
        var distance = {};
        var path = {};

        for (var route_id in this.private_network[this.id]) {
            distance[route_id] = this.private_network[this.id][route_id];
            if (distance[route_id]) {
                var route = [];
                route.push(route_id);
                path[route_id] = route
            }
        }

        delete v[this.id];
        while (!this.isEmptyObject(v)) {
            var nearest = null;
            var nearest_distance = null;
            for (var router in distance) {
                if (!v[router]) {
                    continue;
                }
                var d = distance[router];
                if (d == null) {
                    continue;
                }
                if (nearest_distance == null || nearest_distance > d) {
                    nearest_distance = d;
                    nearest = router;
                }
            }

            if (nearest == null) {
                break;
            }

            delete v[nearest];
            var sub_distance = this.private_network[nearest];
            var distance_to = distance[nearest];
            var path_to = path[nearest];
            for (var router in sub_distance) {
                if (sub_distance[router] == null) {
                    continue;
                }
                var current_distance = distance[router];
                var new_distance = distance_to + sub_distance[router];
                if (current_distance == null || current_distance > new_distance) {
                    distance[router] = new_distance;
                    var new_path = path_to;
                    new_path.push(router);
                    path[router] = new_path;
                }
            }
        }

        this.routing_table = {}
        for (var router in path) {
            this.routing_table[router] = path[router][0];
        }
        //console.log(this.routing_table);
    }

    originatePacket () {
        if (!this.on) return null;
        this.sequence_num++;
        for (var router_id in this.connections) {
            if (router_id == this.id) continue;
            var ticks = this.tick_counter[router_id] + 1;
            this.tick_counter[router_id] = ticks;
            if (ticks >= 2) {
                var disconnectedRouterCosts = this.private_network[router_id];
                for (var routerId1 in disconnectedRouterCosts) {
                    disconnectedRouterCosts[router_id] = null;
                    var networkCost = this.private_network[routerId1];
                    networkCost[router_id] = null;
                    this.private_network[routerId1] = networkCost;
                }
                this.private_network[router_id] = disconnectedRouterCosts;
            }
        }

        var receivers = [];
        for (var router in this.private_network[this.id]) {
            if (this.private_network[this.id][router] != null) receivers.push(router);
        }
        var lsp = new LinkStatePackage(this.id, this.sequence_num, this.private_network, receivers);
        return lsp;
    }

    isEmptyObject (obj) {
        for (var n in obj) {
            return false;
        }
        return true;
    }
}

class LinkStatePackage {
    constructor (originate, sequence_num, private_network, receiver) {
        this.originate = originate;  //string
        this.forward_by = originate; //string
        this.sequence_num = sequence_num;   //int
        this.private_network = private_network; //Map<String, Map<String, Integer>>
        this.ttl = 10;  //int
        this.receiver = receiver;   //List<String>
    }

    getForwardBy () {
        return this.forward_by;
    }

    setForwardBy (forward_by) {
        this.forward_by = forward_by;
    }

    getReceiver () {
        return this.receiver;
    }

    setReceiver (receiver) {
        this.receiver = receiver;
    }

    getTtl () {
        return this.ttl;
    }

    getSequenceNum () {
        return this.sequence_num;
    }

    getPrivateNetwork () {
        return this.private_network;
    }

    getOriginate () {
        return this.originate;
    }

    visit () {
        this.ttl--;
    }
}

function main()
{
    var netWork = new NetWork();
    var isContinue = true;

    while (isContinue)
    {
        var command = readline_sync.question("Command: ");
        //console.log(command);
        switch (command[0]) 
        {
            case "C":
                netWork.con();
                //console.log(netWork.network);
                break;
            case "Q":
                isContinue = 0;
                break;
            case "P":        
                if (command.length == 1) {               
                    break;
                }
                netWork.printRoutingTable(command[1]);
                //console.log(command[1]);
                break;
            case "S":
                if (command.length == 1) {                
                    break;
                }
                netWork.shutDownRouter(command[1]);
                break;
            case "T":
                if (command.length == 1) {
                    break;
                }
                netWork.startUpRouter(command[1]);
                break;
            default:
                break;
        }
    }
}

main();