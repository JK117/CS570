const file_stream = require('fs');

class Graph {
    constructor(input_stream) {
        this.input_array = input_stream.split('\n');
        this.node_num = this.input_array[0].split(' ')[0];
        this.edge_num = this.input_array[0].split(' ')[1];
        this.input_array.splice(0, 1);

        this.graph_list = {};
        for(var i=0; i < this.node_num; i++) {
            this.graph_list[i] = [];
        }
        for (var j in this.input_array) {
            var start_node = this.input_array[j].split(" ")[0];
            var end_node = this.input_array[j].split(" ")[1];
            this.graph_list[start_node].push(end_node);
        }
    }

    sort_func1() {
        var graph = {};
        for(var i in this.graph_list){
            graph[i] = this.graph_list[i];
        }
        
        var topo_table = [null];
        var topo_index = 0;
        while(!this.isGraphEmpty(graph)){
            var in_degree_table = {};
            var delete_set = [];
            
            for(var i in graph){
                    in_degree_table[i] = 0;
            }
            for(var i in graph){
                for(var j in graph[i]){
                    in_degree_table[graph[i][j]] ++;
                }
            }
            
            for(var i in in_degree_table){
                if(in_degree_table[i]===0){
                    delete_set.push(i); 
                }
            }
            if(delete_set.length==0){
                throw "this Graph is not acyclic";
            }
            topo_index++;

            //select the last node whose in-degree is zero
            topo_table[topo_index] = delete_set[delete_set.length-1];
            
            //delete node
            delete(graph[delete_set[delete_set.length-1]]);
            for(var i in graph){
                for(var j in graph[i]){
                    if(graph[i][j] === delete_set[delete_set.length-1]){
                        graph[i].splice(j,1);
                    }
                }
            }
        }
        topo_table.splice(0, 1);
        return topo_table;
    }

    sort_func2() {
        var graph = {};
        for(var i in this.graph_list){
            graph[i] = this.graph_list[i];
        }
        
        var topo_table = [null];
        var topo_index = 0;
        while(!this.isGraphEmpty(graph)){
            var in_degree_table = {};
            var delete_set = [];
            
            for(var i in graph){
                    in_degree_table[i] = 0;
            }
            for(var i in graph){
                for(var j in graph[i]){
                    in_degree_table[graph[i][j]] ++;
                }
            }
            
            for(var i in in_degree_table){
                if(in_degree_table[i]===0){
                    delete_set.push(i); 
                }
            }
            if(delete_set.length==0){
                throw "this Graph is not acyclic";
            }
            topo_index++;
            //select the first node whose in-degree is zero
            topo_table[topo_index] = delete_set[0];
            //delete node
            delete(graph[delete_set[0]]);
            for(var i in graph){
                for(var j in graph[i]){
                    if(graph[i][j] === delete_set[0]){
                        graph[i].splice(j,1);
                    }
                }
            }
        }
        topo_table.splice(0, 1);
        return topo_table;
    }

    isGraphEmpty(graph) {
        var count = 0;
        for(var i in graph) {
            count++;
        }
        if(count==0) {
            return true;
        } else {
            return false;
        }
    }
}

const input_file = file_stream.readFileSync('infile.dat', {encoding: 'utf8'});
var g = new Graph(input_file);
console.log('First type of topological ordering: ' + g.sort_func1());
console.log('Second type of topological ordering: ' + g.sort_func2());