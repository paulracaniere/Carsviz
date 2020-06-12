//FIXME:
//TODO: for each attr. find the max and the min

{
    const min = 5;
    const max = 15;
    const attr = [("MPG", min, max, function(h) {
        handle.attr("cx", x(h));
        console.log(h);
    })];
    const handlers = [ function(h) {
        handle.attr("cx", x(h));
        console.log(h);
    }];

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
            .on("start drag", function() { handlers[0](x.invert(d3.event.x)); }));

    const handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    slider.transition() // Gratuitous intro
        .duration(750)//duration of the intro
        .tween("hue", function() {
            var i = d3.interpolate(0, 70); //range
            return function(t) { handlers[0](i(t)); };
        });
}
