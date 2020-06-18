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

        const filter_div = filters_section.append("div")
            .attr("id", "slider-container-" +String(k));
        const slider = createD3RangeSlider(0, 100, "#slider-container-" + String(k));
        slider.range(1,10);
        slider.onChange(function(newRange){
            console.log(newRange);
        });
    }

}
