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

    const filters_section = d3.select("body").append("section")

    for(let k = 0 ; k<names.length; k++) {
        const filter_div = filters_section.append("div").attr("class", "filter_div");
        filter_div.html("<p> " + names[k] + " </p>");


        const slider_div = filter_div.append("div")
            .attr("id", "slider-container-" +String(k))
            .attr("class", "slider_m");

        const value_disp = filter_div.append("p");
        value_disp.html("[ " + mins[k] + ", " + maxs[k] + "]");
        const slider = createD3RangeSlider(mins[k], maxs[k], "#slider-container-" + String(k));
        slider.range(mins[k], maxs[k]); //initial values
        slider.onChange(function(range) {
            value_disp.html("[ " + range.begin + ", " + range.end + "]");
            handlers[k](range); //handler
        });
    }

}
