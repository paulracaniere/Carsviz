//FIXME:
//TODO: for each attr. find the max and the min

{
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
        }];
}

function loadSliders() {
    for (let k = 0 ; k < engineSpecs.length; k++) {
        const filter_div = d3.select("#filter_" + engineSpecs[k]).append("div").attr("class", "filter_div");
        const slider_div = filter_div.append("div")
            .attr("id", "slider-container-" + k)
            .attr("class", "slider_m");

        const value_disp = filter_div.append("p");
        value_disp.text("[ " + mins[k] + ", " + maxs[k] + "]");
        const slider = createD3RangeSlider(mins[k], maxs[k], "#slider-container-" + String(k));
        slider.range(mins[k], maxs[k]); //initial values
        slider.onChange(function(range) {
            value_disp.html("[ " + range.begin + ", " + range.end + "]");
            handlers[k](range); //handler
        });
    }
}