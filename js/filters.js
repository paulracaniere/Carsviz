const handlers = [
    function(h) {
        console.log("MPG: [" + h.begin + ", " + h.end + "]");
    },
    function(h) {
        console.log("Cylinder: [" + h.begin + ", " + h.end + "]");
    },
    function(h) {
        console.log("Displacement: [" + h.begin + ", " + h.end + "]");
    },
    function(h) {
        console.log("Horse power: [" + h.begin + ", " + h.end + "]");
    },
    function(h) {
        console.log("Weight: [" + h.begin + ", " + h.end + "]");
    },
    function(h) {
        console.log("Acceleration: [" + h.begin + ", " + h.end + "]");
    },
    function(h) {
        console.log("Model: [" + h.begin + ", " + h.end + "]");
    },
];


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
        slider.onChange(function(range) {
            value_disp.html("[ " + range.begin + ", " + range.end + "]");
            handlers[k](range);
        });
        sliders.push(slider);
    }
}

function updateSliders() {
    for (let k = 0 ; k < engineSpecs.length; k++) {
        d3.select("#filter_" + engineSpecs[k] + ">p").text("[ " + mins[k] + ", " + maxs[k] + "]");
        sliders[k].range(mins[k], maxs[k]);
    }
}
