const margin = {top: 20, right: 20, bottom: 40, left: 40};
const canvasWidth = 600 - margin.left - margin.right;
const canvasHeight = 600 - margin.top - margin.bottom;

let dataset = [];

let xValue;
let yValue;
let xScale;
let yScale;
let colorValue;
let colorScale;

const engineSpecs = ["MPG", "Cylinders", "Displacement", "Horsepower", "Weight", "Acceleration"]
let setOfEngineCharIndices = new Set([0, 1, 2, 3, 4, 5]);

function CSVDataParser(listOfIndices) {
    let k1 = "", k2 = "";
    if (listOfIndices.length < 2) {
        console.error("CSVDataParser: Should not have less than 2 values.");
        return;
    } else if (listOfIndices.length === 2) {
        k1 = engineSpecs[listOfIndices[0]];
        k2 = engineSpecs[listOfIndices[1]];
    } else {
        listOfIndices.sort();
        k1 = "PC1_" + listOfIndices.join('');
        k2 = "PC2_" + listOfIndices.join('');
    }

    return (d) => {
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

            mpg_norm: +d.MPG_norm,
            cylinders_norm: +d.Cylinders_norm,
            displacement_norm: +d.Displacement_norm,
            hp_norm: +d.Horsepower_norm,
            weight_norm: +d.Weight_norm,
            acceleration_norm: +d.Acceleration_norm,

            PC1: +d[k1],
            PC2: +d[k2],
        };
    };
}

// create SVG canvas
let svg = d3.select("body")
            .append("svg")
            .attr("id", "canvas")
            .attr("width", canvasWidth + margin.left + margin.right)
            .attr("height", canvasHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// text area for the tooltip
let tooltip = d3.select("body")
                .append("div");


d3.text('data/processed_cars.csv', (error, raw) => {
    dataset = d3.csvParse(raw, CSVDataParser([...setOfEngineCharIndices]));
    console.log("Loaded " + dataset.length + " rows.");

    if (dataset.length > 0) {
        // test data loading
        console.log("First row: ", dataset[0]);
        console.log("Second row: ", dataset[1]);
        console.log("Last row: ", dataset[dataset.length - 1]);

        // x, y setup
        xValue = (d) => d.acceleration;
        yValue = (d) => d.displacement;

        xScale = d3.scaleLinear()
            // avoid data to overlap axis
            .domain([d3.min(dataset, xValue)-2, d3.max(dataset, xValue)+2])
            .range([0, canvasWidth]);
        yScale = d3.scaleLinear()
            .domain([d3.min(dataset, yValue)-2, d3.max(dataset, yValue)+2])
            .range([canvasHeight, 0]);

        // color setup
        colorValue = (d) => d.continent;
        colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    }

    draw();
})


function draw() {
    // draw data as dots
    svg.selectAll(".dot")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 3)
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("fill", (d) => colorScale(colorValue(d)))
    .attr("stroke", "black")
    // tooltip with smooth transitions when hovered
    .on("mouseover", function(d) {
        tooltip.transition()
        .duration(300)
        .style("opacity", .8);
        tooltip.html("Model: " + d.car + "<br>Year: " + d.year + "<br>Origin: " + d.continent);
    })
    .on("mouseout", function(d) {
        tooltip.transition()
        .duration(500)
        .style("opacity", 0);
    });

    // x axis
    svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0, " + canvasHeight + ")")
    .call(d3.axisBottom(xScale))
    
    // x axis label
    svg.append("text")
    .attr("class", "label")
    .attr("x", canvasWidth/2)
    .attr("y", canvasHeight + margin.bottom - 4)
    .attr("text-anchor", "middle")
    .text("component 1");

    // y axis
    svg.append("g")
    .attr("class", "y axis")
    .call(d3.axisRight(yScale));
    
    // y axis label
    svg.append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left)
    .attr("x", -(canvasHeight/2))
    .attr("dy", "1.5em")
    .attr("text-anchor", "middle")
    .text("component 2");
   
   // legend
    var legend = svg.selectAll(".legend")
    .data(colorScale.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(0," + i * 20 + ")" );

    // legend shapes
    legend.append("circle")
    .attr("cx", canvasWidth - 18)
    .attr("r", 6)
    .style("fill", colorScale)
    .attr("stroke", "black");

    // legend labels
    legend.append("text")
    .attr("x", canvasWidth - 27)
    .attr("y", 6)
    .style("text-anchor", "end")
    .text( (d) => d );
}
