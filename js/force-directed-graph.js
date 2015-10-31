var width = $('#graph-canvas').width(),
    height = $('#graph-canvas').height();

var color = d3.scale.category20();

var force = d3.layout.force()
    .linkDistance(150)
    .linkStrength(2)
    .charge(-500)
    .size([width, height]);

var svg;
svg = d3.select("#graph-canvas").append("svg")
    .attr("width", width)
    .attr("height", height);

var removeGraphSvg = function() {
    d3.select("#graph-canvas").select("svg").remove();
    svg = d3.select("#graph-canvas").append("svg")
        .attr("width", width)
        .attr("height", height);
}

function drawGraph(graph) {

    var radius = 30;

    force
        .nodes(graph.nodes)
        .links(graph.links)
        .start();

    var link = svg.selectAll(".link")
        .data(graph.links)
        .enter()
        .append("g")
        .attr("class", "link")
        .append("line")
        .attr("class", "link-line")
        .style("stroke-width", function(d) {
            return 4;
        });

    var linkText = svg.selectAll(".link")
        .append("title")
        .attr("class", "link-label")
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 20px Arial")
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("x", function(d) {
            return ((d.source.x + d.target.x) / 2);
        })
        .attr("y", function(d) {
            return ((d.source.y + d.target.y) / 2);
        })
        .text(function(d) {
            return ("Distance: " + d.value);
        });

    var gnodes = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
        .append('g')
        .classed('gnode', true);

    var node = gnodes.append("circle")
        .attr("class", "node")
        .attr("r", radius - 2)
        .style("fill", function(d) {
            return color(d.group);
        })
        .call(force.drag);

    gnodes.append("title")
        .text(function(d) {
            return d.name;
        });

    var label = gnodes.append("text")
        .attr("text-anchor", "middle")
        .attr("font-family", "Arial, Helvetica, sans-serif")
        .attr("fill", "Black")
        .style("font", "normal 14px Arial")
        .attr("dx", 0)
        .attr("dy", ".35em")
        .text(function(d) {
            return d.name.substring(0, 3);
        });

    force.on("tick", function() {

        link
            .attr("x1", function(d) {
              return d.source.x;
            })
            .attr("y1", function(d) {
                return d.source.y;
            })
            .attr("x2", function(d) {
                return d.target.x;
            })
            .attr("y2", function(d) {
                return d.target.y;
            });

        gnodes
            .attr("cx", function(d) { return d.x = Math.max(radius, Math.min(width - radius, d.x)); })
            .attr("cy", function(d) { return d.y = Math.max(radius, Math.min(height - radius, d.y)); })
            .attr("transform", function(d) {
              return 'translate(' + [d.x, d.y] + ')';
            });
    });
}