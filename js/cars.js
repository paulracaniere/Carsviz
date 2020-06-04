const w = 600;
const h = 600;
let dataset = [];

// Create SVG canvas
let svg = d3.select("body")
            .append("svg")
            .attr("id", "canvas")
            .attr("width", w)
            .attr("height", h);

d3.text('data/cars.csv', (error, raw) => {
    let dsv = d3.dsvFormat(';')
    dataset = dsv.parse(raw, (d) => {
        return {
            car: d.Car,
            mpg: +d.MPG,
            cylinders: +d.Cylinders,
            displacement: +d.Displacement,
            hp: +d.Horsepower,
            weight: +d.Weight,
            acceleration: +d.Acceleration,
            year: +d.Model,
            continent: d.Origin,
        };
    });
    dataset.splice(0, 1);

    console.log("Loaded " + dataset.length + " rows.");

    draw();
})


function draw() {
    
}
