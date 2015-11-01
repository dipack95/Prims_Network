var graphDetails;

// Represents an edge from source to sink with capacity
var Edge = function(source, sink, capacity) {
    this.source = source;
    this.sink = sink;
    this.capacity = capacity;
};

// Main class to manage the network
var Graph = function() {
    this.edges = {};
    this.nodes = [];
    this.nodeMap = {};
    this.adjmat;

    // Add a node to the graph
    this.addNode = function(node) {
        this.nodes.push(node);
        this.nodeMap[node] = this.nodes.length - 1;
        this.edges[node] = [];
    };

    // Add an edge from source to sink with capacity
    this.addEdge = function(source, sink, capacity) {
        // Create the two edges = one being the reverse of the other    
        this.edges[source].push(new Edge(source, sink, capacity));
        this.edges[sink].push(new Edge(sink, source, capacity));
    };

    this.addSingularEdge = function(source, sink, capacity) {
        this.edges[source].push(new Edge(source, sink, capacity));
    };

    this.deleteEdge = function(source, sink, capacity) {
        var flag = 0;
        for (var i = 0; i < this.edges[source].length; i++) {
            if (this.edges[source][i].sink == sink && this.edges[source][i].capacity == capacity) {
                this.edges[source].splice(i, 1);
                flag = 1;
            }
        }
        for (var i = 0; i < this.edges[sink].length; i++) {
            if (this.edges[sink][i].sink == source && this.edges[sink][i].capacity == capacity) {
                this.edges[sink].splice(i, 1);
                flag = 1;
            }
        }
        return flag;
    };

    this.updateEdgeWeight = function(source, sink, capacity) {
        for (var i = 0; i < this.edges[source].length; i++) {
            if (this.edges[source][i].sink == sink) {
                this.edges[source][i].capacity = capacity;
            }

            if (this.edges[sink][i].sink == source) {
                this.edges[sink][i].capacity = capacity;
            }
        }
    }

    // Does edge from source to sink exist?
    this.edgeExists = function(source, sink) {
        if (this.edges[source] !== undefined) {
            for (var i = 0; i < this.edges[source].length; i++) {
                if (this.edges[source][i].sink == sink) {
                    return this.edges[source][i];
                }
            }
        }
        return null;
    };

    this.populateAdjacencyMatrix = function(){
        this.adjmat = new Array(this.nodes.length);
        for(var i = 0; i < this.nodes.length; i++){
            this.adjmat[i] = new Array(this.nodes.length);
        }

        for(var i = 0; i < this.nodes.length; i++){
            for(var j = 0; j < this.nodes.length; j++){
                this.adjmat[i][j] = 0;
            }
        }
        var names = this.nodes;

        for(var i = 0; i < this.nodes.length; i++){
            for(var j = 0; j < this.edges[names[i]].length; j++){
                this.adjmat[this.nodes.indexOf(this.edges[names[i]][j].source)][this.nodes.indexOf(this.edges[names[i]][j].sink)] += 1;
            }
        }
    }

    this.calculateComponents = function (){
        this.populateAdjacencyMatrix();
        var stack = [];
        var visited = [];
        var node;
        var current = 0;
        console.log(this.adjmat);
        stack.push(current);
        visited[current] = true;
        while (stack.length) {
            node = stack.pop();

            for (var i = 0 ; i < this.adjmat[node].length ; i += 1) {
                if (this.adjmat[node][i] && !visited[i]) {
                    stack.push(i);
                    visited[i] = true;
                }
            }
      
        }
        
        for(var j = 0; j < visited.length; j++) {
            if(!visited[j])
                return 0;
        }
        return visited.length;
    }
};

function Prim(graph) {
    var mst = new Graph();
    var nodesInPath = [];
    var completeTree = [];
    var usedNodes = {};

    function findMin(g) {

        var min = [999999, null, 999999];
        for (var i = 0; i < nodesInPath.length; i++) {
            for (var n = 0; n < g.edges[nodesInPath[i]].length; n++) {
                if (g.edges[nodesInPath[i]][n].capacity < min[0] && usedNodes[g.edges[nodesInPath[i]][n].sink] === undefined) {
                    min = [nodesInPath[i], g.edges[nodesInPath[i]][n].sink, g.edges[nodesInPath[i]][n].capacity];
                }
            }
        }
        return min;
    }

    var node = graph.nodes[0];
    nodesInPath.push(node);
    usedNodes[node] = true;

    var min = findMin(graph);
    while (min[1] != null) {
        if(mst.nodes.indexOf(min[0]) < 0) mst.addNode(min[0]);
        if(mst.nodes.indexOf(min[1]) < 0) mst.addNode(min[1]);
        mst.addSingularEdge(min[0], min[1], min[2]);
        completeTree.push(min);
        nodesInPath.push(min[1]);
        usedNodes[min[1]] = true;
        min = findMin(graph);
    }

    return {
        nodesInPath: nodesInPath,
        mst: mst,
        edges: completeTree
    };
};

function populateGraphDetails(graph) {
    graphDetails = { "nodes": [], "links": [] };
    for (var i = 0 ; i < graph.nodes.length ; i++) {
        graphDetails['nodes'].push({
            "name": graph.nodes[i],
            "group": Math.floor(Math.random() * (20) + 1)
        });
    }

    for(var i = 0; i < graph.nodes.length; i++) {
        for (var j = 0; j < graph.edges[graph.nodes[i]].length; j++) {
            graphDetails['links'].push({
                "source": graph.nodes.indexOf(graph.edges[graph.nodes[i]][j].source),
                "target": graph.nodes.indexOf(graph.edges[graph.nodes[i]][j].sink),
                "value": graph.edges[graph.nodes[i]][j].capacity
            });
        }
    }
}

function isInputValid(graph){
    if(graph.calculateComponents() < graph.nodes.length){
        return 0;
    }
    return 1;
}

function populateAndDrawGraph(graph) {
    graph.populateAdjacencyMatrix();
    removeGraphSvg();
    populateGraphDetails(graph);
    drawGraph(graphDetails);
}

function init(g) {
    g.addNode('Rampur');
    g.addNode('Sholapur');
    g.addNode('Kolhapur');
    g.addNode('Palampur');
    g.addNode('Sonapur');
    g.addNode('Ratnagiri');
    g.addNode('Milan');

    g.addEdge('Sholapur', 'Palampur', 2);
    g.addEdge('Milan', 'Rampur', 423);
    g.addEdge('Rampur', 'Palampur', 4);
    g.addEdge('Rampur', 'Sholapur', 1);
    g.addEdge('Sholapur', 'Kolhapur', 3);
    g.addEdge('Rampur', 'Palampur', 3);
    g.addEdge('Palampur', 'Sonapur', 3);
    g.addEdge('Sholapur', 'Sonapur', 6);
    g.addEdge('Sholapur', 'Ratnagiri', 5);
    g.addEdge('Kolhapur', 'Sonapur', 4);
    g.addEdge('Sonapur', 'Ratnagiri', 2);
    g.addEdge('Kolhapur', 'Ratnagiri', 4);

}