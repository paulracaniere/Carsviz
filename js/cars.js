const margin = {top: 20, right: 20, bottom: 40, left: 40};
const canvasWidth = 600 - margin.left - margin.right;
const canvasHeight = 600 - margin.top - margin.bottom;

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


let correlation = [
    /*{
        name: "MPG",
        x: 0.5,
        y: 0.2
    },
    {
        name:"Cylinders",
        x: -0.2,
        y: 0.4
    }*/

]

// create SVG canvas
let svg = d3.select("body")
            .append("svg")
            .attr("id", "canvas")
            .attr("width", canvasWidth + margin.left + margin.right)
            .attr("height", canvasHeight + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let coorelationCircle = d3.select("body")
            .append("svg")
            .attr("id", "correlation")
            .attr("width", canvasWidth/2 + margin.left + margin.right + 30)
            .attr("height", canvasHeight/2 + margin.top + margin.bottom+30)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// text area for the tooltip
let tooltip = d3.select("body")
                .append("div");

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
        correlation = correlation_generation([...setOfEngineCharIndices]);
        draw();
        console.log(correlation);
    });
}


loadData();

// Interactivity
// FIXME: Remove that panel when interactivity panel is finished
let interactivity_div = d3.select("body").append("div");
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
    // TODO: Compute correlation en fonction des data choisis 


    //TODO: faire scale pour cercle des correlations


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
            .style("opacity", .8);
            tooltip.html("Model: " + d.car + "<br>Year: " + d.year + "<br>Origin: " + d.continent);
        })
        .on("mouseout", function(d) {
            tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        })
        .attr("cx", (d) => Math.floor(Math.random() * Math.floor(canvasWidth)))
        .attr("cy", (d) => Math.floor(Math.random() * Math.floor(canvasHeight)))
        .attr("opacity", (d) => (d.PC1 === 0.0 || d.PC2 === 0.0) ? 0.0 : 1.0)
        .transition()
        .duration(2000)
        .attr("cx", (d) => xScale(xValue(d)))
        .attr("cy", (d) => yScale(yValue(d)));

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
        .attr("cx", (d) => xScale(xValue(d)))
        .attr("cy", (d) => yScale(yValue(d)))
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
    //draw axis

        //Draw the circle
        coorelationCircle
        .data(correlation)
        .enter()
        .append("g")
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
    .attr("x2", (d)=> 150+d.x*120)
    .attr("y2", (d)=> 150+d.y*120)
    .attr("stroke-width", "2")
    .attr("stroke", "red")
    .attr("marker-end", "url(#arrow)");

    coorelationCircle.selectAll(".Featname")
    .data(correlation)
    .enter()
    .append("text")
    .attr("class", "Featname")
    .attr("x", (d)=> 150+d.x * 120 + 10)
    .attr("y", (d)=> 150+ d.y *120+ 10)
    .text((d)=>d.name);


    // tooltip with smooth transitions when hovered


    coorelationCircle.append("g")
    .append("line")
    .attr("x1", 150)
    .attr("y1", 150)
    .attr("x2", 150)
    .attr("y2", 0)
    .attr("stroke-width", "2")
    .attr("stroke", "black")
    .attr("marker-end", "url(#arrow)");

    coorelationCircle.append("g")
    .append("line")
    .attr("x1", 150)
    .attr("y1", 150)
    .attr("x2", 300)
    .attr("y2", 150)
    .attr("stroke-width", "2")
    .attr("stroke", "black")
    .attr("marker-end", "url(#arrow)");


    coorelationCircle.append("text")
    .text("Circle of correlation");

}


function correlation_generation(listOfIndices){
    //setOfEngineCharIndices
    //dataset
    listOfIndices.sort();
    let correlations = [];
    for(let indice = 0; indice < listOfIndices.length; indice++){
        let corPC1 = 0;
        let corPC2 =0;
        let data_revelant = dataset.length;
        let name = engineSpecs[listOfIndices[indice]];
        for(let id_data = 0; id_data < dataset.length; id_data++){

            if( !(dataset[id_data].PC1 === 0.0 && dataset[id_data].PC2===0.0) ){
                switch(name){
                    //["MPG", "Cylinders", "Displacement", "Horsepower", "Weight", "Acceleration"]
                    case "MPG":
                        corPC1 += dataset[id_data].PC1 * dataset[id_data].mpg_norm;
                        corPC2 += dataset[id_data].PC2 * dataset[id_data].mpg_norm ;
                        break;
                    case "Cylinders":
                        corPC1 += dataset[id_data].PC1 * dataset[id_data].cylinders_norm;
                        corPC2 += dataset[id_data].PC2 * dataset[id_data].cylinders_norm ;
                        break;
                    case "Displacement":
                        corPC1 += dataset[id_data].PC1 * dataset[id_data].displacement_norm;
                        corPC2 += dataset[id_data].PC2 * dataset[id_data].displacement_norm;
                        break;
                    case "Horsepower":
                        corPC1 += dataset[id_data].PC1 * dataset[id_data].hp_norm;
                        corPC2 += dataset[id_data].PC2 * dataset[id_data].hp_norm ;    
                        break;
                    case "Weight":
                        corPC1 += dataset[id_data].PC1 * dataset[id_data].weight_norm;
                        corPC2 += dataset[id_data].PC2 * dataset[id_data].weight_norm ;
                        break;
                    case "Acceleration":
                        corPC1 += dataset[id_data].PC1 * dataset[id_data].acceleration_norm;
                        corPC2 += dataset[id_data].PC2 * dataset[id_data].acceleration_norm ;
                        break;
                }
            }
            else{
                data_revelant -= 1;
            }

            
            
        }

        sig = sigma_PC();
        corPC1 /= (data_revelant*sig[0]);
        corPC2 /= (data_revelant*sig[1]);
        

        correlations.push({
        name: name,
        x: corPC1, //correlation avec PC1
        y: corPC2 //correlation with PC2
            
        });
    }
    return correlations;
}


function sigma_PC(){
    moyPC1 = 0
    moyPC2 = 0
    nb_data = dataset.length
    for(let id_data = 0; id_data < dataset.length; id_data++){
        if( dataset[id_data].PC1 !=0){
            moyPC1 += dataset[id_data].PC1;
            moyPC2 += dataset[id_data].PC2;

        }
        else{
            nb_data -= 1;
        }
    }
    moyPC1 /= nb_data;
    moyPC2 /= nb_data;
    varPC1 =0;
    varPC2= 0;
    for(let id_data = 0; id_data < dataset.length; id_data++){
        if( dataset[id_data].PC1 !=0){
            varPC1 += Math.pow(moyPC1 - dataset[id_data].PC1, 2);
            varPC2 += Math.pow(moyPC2 - dataset[id_data].PC2,2);
        }
    }



    sigmaPC1 = Math.sqrt(varPC1/nb_data);
    sigmaPC2 = Math.sqrt(varPC2/nb_data);
    return [sigmaPC1, sigmaPC2]
}
