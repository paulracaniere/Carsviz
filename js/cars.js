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



let correlation = [
    {
        name: "MPG",
        x: 29.5,
        y: 30.2
    },
    {
        name:"Cylinders",
        x: -40.2,
        y: 10.4
    }

]

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


let coorelationCircle = d3.select("body")
                            .append("svg")
                            .attr("id", "correlation")
                            .attr("width", canvasWidth/2 + margin.left + margin.right)
                            .attr("height", canvasHeight/2 + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.text('data/processed_cars.csv', (error, raw) => {
    dataset = d3.csvParse(raw, (d) => {
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

    // TODO: Compute correlation en fonction des data choisis 


    //TODO: faire scale pour cercle des correlations

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


    //Correlations Circle

    coorelationCircle.append("defs")
    .append("marker")
    .attr("id", "arrow")
    .attr("viewBox", "0 0 10 10")
    .attr("refX", "5")
    .attr("refY", "5")
    .attr("markerWidth", "6")
    .attr("markerHeight", "6")
    .attr("orient", "auto-start-reverse")
    .append("path")
    .attr("d", "M 0 0 L 10 5 L 0 10 z")
    
    
    
    
    
    /*
    <marker id='arrow' viewBox='0 0 10 10' refX='5' refY='5' markerWidth='6' markerHeight='6'
            orient='auto-start-reverse'>
          <path d='M 0 0 L 10 5 L 0 10 z' />
        </marker>");*/


    //Draw the circle
    coorelationCircle.append("g")
    .attr("class", "corrCircle")
    .append("circle")
    .attr("cx", 150)
    .attr("cy", 150)
    .attr("r", 120)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill","white")

    //Draw arrows for features
    coorelationCircle.selectAll(".feature")
    .data(correlation)
    .enter()
    .append("line")
    .attr("class", "feature")
    //.attr("r", 20)
    .attr("x1", 150)
    .attr("y1", 150)
    .attr("x2", (d)=> 150+d.x)
    .attr("y2", (d)=> 150+d.y)
    .attr("stroke-width", "2")
    .attr("stroke", "black")
    .attr("marker-end", "url(#arrow)");




    /*
    marker-end="url(#arrow)"
    <line xmlns="http://www.w3.org/2000/svg" x1="20" y1="100" x2="100" y2="20" stroke="black" stroke-width="2"/>
    
        .append("defs").html("    <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5"
            markerWidth="6" markerHeight="6"
            orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
    ")*/





    // tooltip with smooth transitions when hovered



}
