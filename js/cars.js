const canvasWidth = 600;
const canvasHeight = 600;

const axisMargins = {
    left: 100,
    bottom: 50,
};

let dataset = [];

const xValue = (d) => d.PC1;
const yValue = (d) => d.PC2;
let xScale;
let yScale;
const colorValue = (d) => d.continent;
const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

const engineSpecs = [
    "MPG",
    "Cylinders",
    "Displacement",
    "Horsepower",
    "Weight",
    "Acceleration",
];
let mins = [],
    maxs = [];
let setOfEngineCharIndices = new Set([0, 1, 2, 3, 4, 5]);

let previousFilters = [];

function CSVDataParser(listOfIndices) {
    let k1 = "",
        k2 = "";
    if (listOfIndices.length < 2) {
        console.error("CSVDataParser: Should not have less than 2 values.");
        return;
    } else if (listOfIndices.length === 2) {
        k1 = engineSpecs[listOfIndices[0]];
        k2 = engineSpecs[listOfIndices[1]];
    } else {
        listOfIndices.sort();
        k1 = "PC1_" + listOfIndices.join("");
        k2 = "PC2_" + listOfIndices.join("");
    }

    return (d, i) => {
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

            filtered_in: (previousFilters[i] === undefined) ? true : previousFilters[i],
        };
    };
}

// create SVG canvas
let mid = d3.select("body").append("div").attr("id", "mid");

let svg = mid
    .append("svg")
    .attr("id", "canvas")
    .attr("viewBox", "0 0 " + canvasWidth + " " + canvasHeight)
    .append("g");

// Axis
let xAxis = svg
    .append("g")
    .attr("class", "x axis")
    .attr(
        "transform",
        "translate(0, " + (canvasHeight - 0.7 * axisMargins.bottom) + ")"
    );
let xAxisText = svg
    .append("text")
    .attr("class", "label")
    .attr("x", canvasWidth / 2)
    .attr("y", canvasHeight)
    .attr("text-anchor", "middle");
let yAxis = svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + 0.7 * axisMargins.left + ", 0)");
let yAxisText = svg
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", -canvasHeight / 2)
    .attr("dy", "1.5em")
    .attr("text-anchor", "middle");

let side = mid.append("div").attr("id", "side");

let interactivity_div = side.append("div").attr("id", "filters_canvas");

let tooltip = side.append("div").attr("id", "tooltip");
tooltip.append("h2").text("Tooltip");
tooltip = tooltip.append("div");

function computeScales() {
    xScale = d3
        .scaleLinear()
        // avoid data to overlap axis
        .domain([
            d3.min(dataset, (d) =>
                (xValue(d) === 0 || !d.filtered_in) ? undefined : xValue(d)
            ),
            d3.max(dataset, (d) =>
                (xValue(d) === 0 || !d.filtered_in) ? undefined : xValue(d)
            ),
        ])
        .range([axisMargins.left, canvasWidth - 50]);
    yScale = d3
        .scaleLinear()
        .domain([
            d3.min(dataset, (d) =>
                (yValue(d) === 0 || !d.filtered_in) ? undefined : yValue(d)
            ),
            d3.max(dataset, (d) =>
                (yValue(d) === 0 || !d.filtered_in) ? undefined : yValue(d)
            ),
        ])
        .range([canvasHeight - axisMargins.bottom, 50]);
}

function loadData() {
    if (dataset.length > 0) {
        for (let i = 0; i < dataset.length; i++) {
            previousFilters[i] = dataset[i].filtered_in;
        }
    }
    d3.text("data/processed_cars.csv", (error, raw) => {
        dataset = d3.csvParse(raw, CSVDataParser([...setOfEngineCharIndices]));

        if (dataset.length > 0) {

            // Computing scales
            computeScales();

            maxs = [
                d3.max(dataset, (d) => d.mpg === 0 ? undefined : d.mpg),
                d3.max(dataset, (d) => d.cylinders === 0 ? undefined : d.cylinders),
                d3.max(dataset, (d) => d.displacement === 0 ? undefined : d.displacement),
                d3.max(dataset, (d) => d.hp === 0 ? undefined : d.hp),
                d3.max(dataset, (d) => d.weight === 0 ? undefined : d.weight),
                d3.max(dataset, (d) => d.acceleration === 0 ? undefined : d.acceleration),
            ];
            mins = [
                d3.min(dataset, (d) => d.mpg === 0 ? undefined : d.mpg),
                d3.min(dataset, (d) => d.cylinders === 0 ? undefined : d.cylinders),
                d3.min(dataset, (d) => d.displacement === 0 ? undefined : d.displacement),
                d3.min(dataset, (d) => d.hp === 0 ? undefined : d.hp),
                d3.min(dataset, (d) => d.weight === 0 ? undefined : d.weight),
                d3.min(dataset, (d) => d.acceleration === 0 ? undefined : d.acceleration),
            ];
        }

        if (sliders.length === 0) initSliders();
        draw();
    });
}

loadData();

// Interactivity
interactivity_div.append("h2").text("Filters for visualisation:");
engineSpecs.forEach((spec) => {
    let zone = interactivity_div.append("div")
        .attr("id", "filter_" + spec)
        .append("div");
    zone.append("input")
        .attr("type", "checkbox")
        .attr("id", spec)
        .attr("name", spec)
        .property(
            "checked",
            setOfEngineCharIndices.has(engineSpecs.indexOf(spec))
        )
        .on("change", () => {
            if (setOfEngineCharIndices.has(engineSpecs.indexOf(spec))) {
                setOfEngineCharIndices.delete(engineSpecs.indexOf(spec));
            } else {
                setOfEngineCharIndices.add(engineSpecs.indexOf(spec));
            }
            if (setOfEngineCharIndices.size === 2) {
                setOfEngineCharIndices.forEach((i_spec) => {
                    d3.select("#" + engineSpecs[i_spec]).property(
                        "disabled",
                        true
                    );
                });
            } else {
                setOfEngineCharIndices.forEach((i_spec) => {
                    d3.select("#" + engineSpecs[i_spec]).property(
                        "disabled",
                        false
                    );
                });
            }
            loadData();
        });
    zone.append("label").attr("for", spec).text(spec);
});

function draw() {
    // draw data as dots
    let data = svg.selectAll(".dot").data(dataset);

    // New data
    data.enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 3)
        .attr("fill", (d) => colorScale(colorValue(d)))
        // tooltip with smooth transitions when hovered
        .on("mouseover", function (d) {
            tooltip.transition().duration(300).style("opacity", 1);
            tooltip.html(
                "Model: " +
                    d.car +
                    "<br>Year: 19" +
                    d.year +
                    "<br>Origin: " +
                    d.continent
            );
        })
        .on("mouseout", function (d) {
            tooltip.transition().duration(500).style("opacity", 0);
        })
        .attr("cx", (d) => Math.floor(Math.random() * Math.floor(canvasWidth)))
        .attr("cy", (d) => Math.floor(Math.random() * Math.floor(canvasHeight)))
        .attr("opacity", (d) =>
            xValue(d) === 0.0 || yValue(d) === 0.0 ? 0.0 : 1.0
        )
        .transition()
        .duration(2000)
        .attr("cx", (d) =>
            xValue(d) === 0.0 || yValue(d) === 0.0
                ? Math.floor(Math.random() * Math.floor(canvasWidth))
                : xScale(xValue(d))
        )
        .attr("cy", (d) =>
            xValue(d) === 0.0 || yValue(d) === 0.0
                ? Math.floor(Math.random() * Math.floor(canvasHeight))
                : yScale(yValue(d))
        );

    // Updated data
    data
        // tooltip with smooth transitions when hovered
        .on("mouseover", function (d) {
            tooltip.transition().duration(300).style("opacity", 1);
            tooltip.html(
                "Model: " +
                    d.car +
                    "<br>Year: " +
                    d.year +
                    "<br>Origin: " +
                    d.continent
            );
        })
        .on("mouseout", function (d) {
            tooltip.transition().duration(500).style("opacity", 0);
        })
        .transition()
        .duration(1000)
        .attr("cx", (d) =>
            xValue(d) === 0.0 || yValue(d) === 0.0
                ? Math.floor(Math.random() * Math.floor(canvasWidth))
                : xScale(xValue(d))
        )
        .attr("cy", (d) =>
            xValue(d) === 0.0 || yValue(d) === 0.0
                ? Math.floor(Math.random() * Math.floor(canvasHeight))
                : yScale(yValue(d))
        )
        .attr("opacity", (d) => (d.PC1 === 0.0 || d.PC2 === 0.0 || !d.filtered_in ? 0.05 : 1.0));

    // x axis
    xAxis
        .transition()
        .duration(1000)
        .call(d3.axisBottom(xScale))
        .attr("opacity", setOfEngineCharIndices.size === 2 ? 1 : 0);
    xAxisText
        .transition()
        .duration(1000)
        .attr("opacity", setOfEngineCharIndices.size === 2 ? 1 : 0)
        .text(engineSpecs[[...setOfEngineCharIndices][0]]);
    // y axis
    yAxis
        .transition()
        .duration(1000)
        .call(d3.axisLeft(yScale))
        .attr("opacity", setOfEngineCharIndices.size === 2 ? 1 : 0);
    yAxisText
        .transition()
        .duration(1000)
        .attr("opacity", setOfEngineCharIndices.size === 2 ? 1 : 0)
        .text(engineSpecs[[...setOfEngineCharIndices][1]]);

    // legend
    let legend = svg
        .selectAll(".legend")
        .data(colorScale.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => "translate(0," + (i * 20 + 40) + ")");

    // legend shapes
    legend
        .append("circle")
        .attr("cx", canvasWidth - 18)
        .attr("r", 6)
        .style("fill", colorScale)
        .attr("stroke", "black");

    // legend labels
    legend
        .append("text")
        .attr("x", canvasWidth - 27)
        .attr("y", 6)
        .style("text-anchor", "end")
        .text((d) => d);
}
