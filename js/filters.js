function filterOutAndIn() {
    dataset.forEach((d) => {
        d.filtered_in = (
            sliders[0].range().begin <= d.mpg && d.mpg <= sliders[0].range().end &&
            sliders[1].range().begin <= d.cylinders && d.cylinders <= sliders[1].range().end &&
            sliders[2].range().begin <= d.displacement && d.displacement <= sliders[2].range().end &&
            sliders[3].range().begin <= d.hp && d.hp <= sliders[3].range().end &&
            sliders[4].range().begin <= d.weight && d.weight <= sliders[4].range().end &&
            sliders[5].range().begin <= d.acceleration && d.acceleration <= sliders[5].range().end
        );
    });
    if (d3.sum(dataset, (d) => d.filtered_in && d.in_range ? 1 : 0) !== 0) computeScales();
    draw();
}

let sliders = [];
function initSliders() {
    for (let k = 0 ; k < engineSpecs.length; k++) {
        const filter_div = d3.select("#filter_" + engineSpecs[k])
            .append("div")
            .attr("class", "filter_div");
        const slider_div = filter_div.append("div")
            .attr("id", "slider-container-" + k)
            .attr("class", "slider_m");

        const value_disp = filter_div.append("p");
        value_disp.text("[ " + mins[k] + ", " + maxs[k] + "]");
        slider = createD3RangeSlider(mins[k], maxs[k], "#slider-container-" + k);
        slider.range(mins[k], maxs[k]);
        slider.onChange(function(range) {
            value_disp.html("[ " + range.begin + ", " + range.end + "]");
            filterOutAndIn();
        });
        sliders.push(slider);
    }
}
