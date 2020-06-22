{
dd = [{"Car":"Ford", "Model": 1900},
    {"Car":"Ford", "Model": 1902},
    {"Car":"Citroen", "Model": 1904},
    {"Car":"Catroen", "Model": 1904},
    {"Car":"Citroen", "Model": 1906}];

min = 0;
max = 15;

function slider_handler(k) {
    console.log(k);
}

function select_handler() {
    console.log(dd[select.property('selectedIndex')]);
}

research_div = d3.select("body").append("div");

const select = research_div.append("select").on("change", select_handler);
options = select.selectAll('option').data(dd);
options.enter().append("option").text(function(d) { return d["Car"] + " " + d["Model"]; });


const svg = research_div.append("svg")
    .attr("id", "filters_canvas")
    .attr("width","300")
    .attr("height", "100");
const value_disp = research_div.append("p");

const margin = {right: 50, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height");

const x = d3.scaleLinear()
    .domain([min, max])//depend on the attribute
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
            slider_handler(val); }));

const handle = slider.insert("circle", ".track-overlay")
    .attr("class", "handle")
    .attr("r", 9)

slider.transition() // Gratuitous intro
    .duration(750)//duration of the intro
    .tween("hue", function() {
        var i = d3.interpolate(0, (min + max)/2); //range
        return function(t) {handle.attr("cx", x(i(t)));
            value_disp.html(String(Math.round(i(t))));
            slider_handler(i(t));
        };
    });
}
