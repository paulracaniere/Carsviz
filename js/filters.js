//FIXME:
//TODO: for each attr. find the max and the min

{
    const min = 5;
    const max = 15;
    const maxs = [ max, max, max, max, max, max, max];
    const mins = [ min, min, min, min, min, min, min];
    const names = [ "MPG", "Cylinder", "Displacement", "Horse power", "Weight", "Acceleration", "Model"];

    const handlers = [
        function(h) {
            console.log("MPG: " + h);
        },
        function(h) {
            console.log("Cylinder: " + h);
        },
        function(h) {
            console.log("Displacement: " + h);
        },
        function(h) {
            console.log("Horse power: " + h);
        },
        function(h) {
            console.log("Weight: " + h);
        },
        function(h) {
            console.log("Acceleration: " + h);
        },
        function(h) {
            console.log("Model: " + h);
        }];

    const filters_section = d3.select("body").append("section")

    for(let k = 0 ; k<names.length; k++) {

        const filter_div = filters_section.append("div");
        filter_div.html("<h3>" + names[k] + "</h3>");
        const svg = filter_div.append("svg")
            .attr("id", "filters_canvas")
            .attr("width","300")
            .attr("height", "100");
       const value_disp = filter_div.append("p");

        const margin = {right: 50, left: 50},
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height");

        const x = d3.scaleLinear()
            .domain([mins[k], maxs[k]])//depend on the attribute
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
                .on("start drag", function() { const val = x.invert(d3.event.x);
                    handle.attr("cx", x(val));
                    value_disp.html(String(Math.round(val)));
                    handlers[k](val); }));

        const handle = slider.insert("circle", ".track-overlay")
            .attr("class", "handle")
            .attr("r", 9)

        slider.transition() // Gratuitous intro
            .duration(750)//duration of the intro
            .tween("hue", function() {
                var i = d3.interpolate(0, (mins[k] + maxs[k])/2); //range
                return function(t) {handle.attr("cx", x(i(t)));
                    value_disp.html(String(Math.round(i(t))));
                    handlers[k](i(t));
                };
            });
    }
}
