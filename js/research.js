let researchBuilt = false;

let targetIndex = -1;

function buildResearch() {
    let min = 0.01;
    let max = 15;

    function slider_handler(value_slider) {
        if (targetIndex < 0) return;
        dataset.forEach((d) => {
            d.in_range = (
                Math.sqrt(
                    (d.PC1 - dataset[targetIndex].PC1) *
                    (d.PC1 - dataset[targetIndex].PC1) + 
                    (d.PC2 - dataset[targetIndex].PC2) * 
                    (d.PC2 - dataset[targetIndex].PC2)) <= value_slider
            );
        });
        if (d3.sum(dataset, (d) => d.filtered_in && d.in_range ? 1 : 0) !== 0) computeScales();
        draw(); 
    }

    function select_handler() {
        if (targetIndex >= 0) dataset[targetIndex].researched = false;
        targetIndex = select.node().selectedIndex;
        dataset[targetIndex].researched = true;
        max = Math.floor(100 * d3.max(dataset, (d) => Math.sqrt(
            (d.PC1 - dataset[targetIndex].PC1) *
            (d.PC1 - dataset[targetIndex].PC1) + 
            (d.PC2 - dataset[targetIndex].PC2) * 
            (d.PC2 - dataset[targetIndex].PC2)))) / 100;
        x.domain([min, max]);
        value_disp.text(x.invert(value_disp.attr("x")));
        maxText.text(max);

        slider_handler(x.invert(value_disp.attr("x")))
    }

    let research_div = side.append("div").attr("id", "research");
    research_div.append("h2").text("Research");

    const select = research_div.append("select").on("change", select_handler);
    let options = select.selectAll('option').data(dataset);
    select.append("optgroup").attr("label", "All cars");
    options.enter().append("option").text(d => d.car + " " + d.year);

    research_div.append("br");
    const svg = research_div.append("svg")
        .attr("id", "filters_canvas")
        .attr("width", "300")
        .attr("height", "50");

    const margin = {
            right: 50,
            left: 50
        },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height");

    const x = d3.scaleLinear()
        .domain([min, max]) //depend on the attribute
        .range([0, width]) // size on the screen
        .clamp(true);

    const slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + 20 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true));})
        .attr("class", "track-inset")
        .select(function() { return this.parentNode.appendChild(this.cloneNode(true));})
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", () => slider.interrupt())
            .on("start drag", function() {
                const val = x.invert(d3.event.x);
                handle.attr("cx", x(val));
                value_disp.text(String(Math.round(val * 100) / 100));
                value_disp.attr("x", x(val));
                slider_handler(val);
            }));

    const handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9).attr("cx", x((min + max) / 2.0));

    const value_disp = slider.append("text")
        .attr("x", x((min + max) / 2.0))
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .text((min + max) / 2.0);

    const minText = svg.append("text")
        .attr("x", 20)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .text(min);

    const maxText = svg.append("text")
        .attr("x", 280)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .text(max);

    select_handler();

    researchBuilt = true;
}
