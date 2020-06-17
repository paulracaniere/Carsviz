//FIXME:
//TODO: for each attr. find the max and the min

{
    const min = 5;
    const max = 15;
    const attr = [("MPG", min, max), ("Cylinder", min, max), ("Displacement", min, max)];
    const handlers = [
        function(h) {
            console.log("MPG: " + h);
        },
        function(h) {
            console.log("Cylinder: " + h);
        },
        function(h) {
            console.log("Displacement: " + h);
        }];


    for(let k = 0 ; k<attr.length; k++) {

        const filters_div = d3.select("body").append("svg");
        const svg = filters_div.append("svg")
            .attr("id", "filters_canvas")
            .attr("width","300")
            .attr("height", "200");

        const margin = {right: 50, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height");

        const x = d3.scaleLinear()
            .domain([0, 180])//depend on the attribute
            .range([0, width])// size on the screen
            .clamp(true);

        const slider = svg.append("g")
            .attr("class", "slider")
            .attr("transform", "translate(" + margin.left + "," + height / 2 + ")");

        slider.append("line")
            .attr("class", "track")
            .attr("x1", x.range()[0])
            .attr("x2", x.range()[1])
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-inset")
            .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("class", "track-overlay")
            .call(d3.drag()
                .on("start.interrupt", function() { slider.interrupt(); })
                .on("start drag", function() { handlers[k](x.invert(d3.event.x)); }));

        const handle = slider.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("r", 9);

        slider.transition() // Gratuitous intro
            .duration(750)//duration of the intro
            .tween("hue", function() {
                var i = d3.interpolate(0, 70); //range
                return function(t) {handle.attr("cx", x(i(t)));
                    handlers[k](i(t));
                };
            });
    }
}
