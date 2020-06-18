const canvasWidth = 600;
const canvasHeight = 600;

let dataset = [];

const xValue = (d) => d.PC1;
const yValue = (d) => d.PC2;
let xScale;
let yScale;
const colorValue = (d) => d.continent;
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
let mid = d3.select("body")
            .append("div")
            .attr("id", "mid");

let svg = mid.append("svg")
            .attr("id", "canvas")
            .attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight)
            .append("g");

let side = mid.append("div")
            .attr("id", "side");

let interactivity_div = side.append("div")
                        .attr("id", "filters_canvas");

let tooltip = side.append("div")
                .attr("id", "tooltip");
tooltip.append("h2")
    .text("Tooltip");
tooltip = tooltip.append("div");

function loadData() {
    d3.text('data/processed_cars.csv', (error, raw) => {
        dataset = d3.csvParse(raw, CSVDataParser([...setOfEngineCharIndices]));

        if (dataset.length > 0) {
            // Computing scales
            xScale = d3.scaleLinear()
                // avoid data to overlap axis
                .domain([d3.min(dataset, xValue) - 2.0, d3.max(dataset, xValue) + 2.0])
                .range([0, canvasWidth]);
            yScale = d3.scaleLinear()
                .domain([d3.min(dataset, yValue) - 2.0, d3.max(dataset, yValue) + 2.0])
                .range([canvasHeight, 0]);
            colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        }

        draw();
    });
}

loadData();

// Interactivity
// FIXME: Remove that panel when interactivity panel is finished
interactivity_div.append("h2").text("Filters for visualisation:")
engineSpecs.forEach((spec) => {
    let zone = interactivity_div.append("div");
    zone.append("input")
        .attr("type", "checkbox")
        .attr("id", spec)
        .attr("name", spec)
        .property("checked", setOfEngineCharIndices.has(engineSpecs.indexOf(spec)))
        .on("change", () => {
            if (setOfEngineCharIndices.has(engineSpecs.indexOf(spec))) {
                setOfEngineCharIndices.delete(engineSpecs.indexOf(spec));
            } else {
                setOfEngineCharIndices.add(engineSpecs.indexOf(spec));
            }
            if (setOfEngineCharIndices.size === 2) {
                setOfEngineCharIndices.forEach((i_spec) => {
                    d3.select("#" + engineSpecs[i_spec]).property("disabled", true);
                });
            } else {
                setOfEngineCharIndices.forEach((i_spec) => {
                    d3.select("#" + engineSpecs[i_spec]).property("disabled", false);
                });
            }
            loadData();
        });
    zone.append("label")
        .attr("for", spec)
        .text(spec);
});


function draw() {
    // draw data as dots
    let data =  svg.selectAll(".dot")
                    .data(dataset);

    // New data
    data.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("fill", (d) => colorScale(colorValue(d)))
        // tooltip with smooth transitions when hovered
        .on("mouseover", function(d) {
            tooltip.transition()
            .duration(300)
            .style("opacity", 1);
            tooltip.html("Model: " + d.car + "<br>Year: 19" + d.year + "<br>Origin: " + d.continent);
        })
        .on("mouseout", function(d) {
            tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        })
        .attr("cx", (d) => Math.floor(Math.random() * Math.floor(canvasWidth)))
        .attr("cy", (d) => Math.floor(Math.random() * Math.floor(canvasHeight)))
        .attr("opacity", (d) => (xValue(d) === 0.0 || yValue(d) === 0.0) ? 0.0 : 1.0)
        .transition()
        .duration(2000)
        .attr("cx", (d) => (xValue(d) === 0.0 || yValue(d) === 0.0) ? Math.floor(Math.random() * Math.floor(canvasWidth)) : xScale(xValue(d)))
        .attr("cy", (d) => (xValue(d) === 0.0 || yValue(d) === 0.0) ? Math.floor(Math.random() * Math.floor(canvasHeight)) : yScale(yValue(d)));

    // Updated data
    data.attr("fill", (d) => colorScale(colorValue(d)))
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
        })
        .transition()
        .duration(1000)
        .attr("cx", (d) => (xValue(d) === 0.0 || yValue(d) === 0.0) ? Math.floor(Math.random() * Math.floor(canvasWidth)) : xScale(xValue(d)))
        .attr("cy", (d) => (xValue(d) === 0.0 || yValue(d) === 0.0) ? Math.floor(Math.random() * Math.floor(canvasHeight)) : yScale(yValue(d)))
        .attr("opacity", (d) => (d.PC1 === 0.0 || d.PC2 === 0.0) ? 0.0 : 1.0);

    // FIXME: Show axis when only 2 variables displayed
    // // x axis
    // svg.append("g")
    // .attr("class", "x axis")
    // .attr("transform", "translate(0, " + canvasHeight + ")")
    // .call(d3.axisBottom(xScale))
    
    // // x axis label
    // svg.append("text")
    // .attr("class", "label")
    // .attr("x", canvasWidth/2)
    // .attr("y", canvasHeight + margin.bottom - 4)
    // .attr("text-anchor", "middle")
    // .text("component 1");

    // // y axis
    // svg.append("g")
    // .attr("class", "y axis")
    // .call(d3.axisRight(yScale));
    
    // // y axis label
    // svg.append("text")
    // .attr("class", "label")
    // .attr("transform", "rotate(-90)")
    // .attr("y", -margin.left)
    // .attr("x", -(canvasHeight/2))
    // .attr("dy", "1.5em")
    // .attr("text-anchor", "middle")
    // .text("component 2");
   
   // legend
    let legend = svg.selectAll(".legend")
                    .data(colorScale.domain())
                    .enter()
                    .append("g")
                    .attr("class", "legend")
                    .attr("transform", (d, i) => "translate(0," + (i * 20 + 40) +")" );

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
