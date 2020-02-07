'use strict';

(function() {

  let data = "no data";
  let pokemonData = "no data";
  let svgScatterPlot = "";
  let func  = "";
  let mydropdown1 = "";
  let mydropdown2 = "";
  let legend= "";

  let currentL = "All";
  let currentG = "All";

  const m = {
    width: 800,
    height: 600,
    marginAll: 50
  }

const colors = [
    "#4E79A7",
    "#A0CBE8",
    "#F28E2B",
    "#FFBE&D",
    "#59A14F",
    "#8CD17D",
    "#B6992D",
    "#499894",
    "#86BCB6",
    "#86BCB6",
    "#E15759",
    "#FF9D9A",
    "#79706E",
    "#BAB0AC",
    "#D37295"
]
    window.onload = function() {
        svgScatterPlot = d3.select('#svg')
          .append('svg')
          .attr('width', m.width)
          .attr('height', m.height);
        mydropdown1 = d3.select("#legendary")
          .append('svg')
          .attr('width', 100)
          .attr('height', 50);
        mydropdown2 = d3.select("#generation")
          .append('svg')
          .attr('width', 100)
          .attr('height', 50);
        legend = d3.select("#legend")
          .append('svg')
          .attr('width', 500)
          .attr('height', 500);

        d3.csv("data/pokemon.csv", function (csvData){
            data = csvData;
            makeScatterPlot();
          });
      }

  function makeScatterPlot() {
    svgScatterPlot.html("");

    let sp_def_data = data.map((row) => parseFloat(row["Sp. Def"]));
    let total_data = data.map((row) => parseFloat(row["Total"]));

    let dropDownG = d3.select("#generation").append("select")
    .attr("name", "Generation");
    let dropDownL = d3.select("#legendary").append("select")
    .attr("name", "Legendary");
    let axesLimits = findMinMax(sp_def_data, total_data);
    let mapFunctions = drawAxes(axesLimits, "Sp. Def", "Total", svgScatterPlot,{min: 50, max: 750}, {min: 50, max: 550});
    plotData(mapFunctions,data);
    makeLabels();
    let generation = [...new Set(data.map(d => d["Generation"]))];
    generation.push("All");

    let legendary = [...new Set(data.map(d => d["Legendary"]))];
    legendary.push("All");


    dropDownL.selectAll("option")
        .data(legendary)
        .enter()
        .append("option")
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })
        .attr("selected", function(d){ return d == "All"; });

    dropDownG.selectAll("option")
        .data(generation)
        .enter()
        .append("option")
        .text(function (d) { return d; })
        .attr("value", function (d) { return d; })
        .attr("selected", function(d){ return d == 1; });

    dropDownG.on("change", function() {
        currentG = this.value;
        changeGenerationCircles(this);
    });

    dropDownL.on("change", function() {
        currentL = this.value;
        changeLegendaryCircles(this);
    });

  }

  function changeGenerationCircles(generationDropDown) {
    let currentGeneration = generationDropDown.value;
    console.log(currentL);
    let displayOthers = currentGeneration.checked ? "display" : "none";
    let display = generationDropDown.checked ? "none" : "display";

    svgScatterPlot.selectAll(".circles")
        .data(data)
        .filter(function(d) {
            if(currentL != "All") {
                return currentGeneration != d["Generation"] || currentL != d["Legendary"];
            } else {
            return currentGeneration != d["Generation"] ;
            }
        })
        .attr("display", displayOthers)
    svgScatterPlot.selectAll(".circles")
        .data(data)
        .filter(function(d) {
            if(currentL != "All") {
                return currentGeneration == d["Generation"] && currentL == d["Legendary"];
            } else {
            return currentGeneration == d["Generation"] ;
            }
        })
        .attr("display", display);

        if(currentGeneration == "All" && currentL == "All") {
            svgScatterPlot.selectAll(".circles")
            .data(data)
            .attr("display", display);
        }

        if(currentGeneration == "All" && currentL != "All") {
            svgScatterPlot.selectAll(".circles")
            .data(data)
            .filter(function(d) {return currentL == d["Legendary"];
                                })
            .attr("display", display);
        }
  }

  function changeLegendaryCircles(legendaryDropDown) {
    let currentLegend = legendaryDropDown.value;
    console.log(currentG);
    console.log(currentLegend);
    let displayOthers = currentLegend.checked ? "display" : "none";
    let display = legendaryDropDown.checked ? "none" : "display";
    svgScatterPlot.selectAll(".circles")
        .data(data)
        .filter(function(d) {
            if(currentG != "All") {
                return currentLegend != d["Legendary"] || currentG != d["Generation"];
            } else {
            return currentLegend != d["Legendary"] ;
            }
        })
        .attr("display", displayOthers);
    svgScatterPlot.selectAll(".circles")
        .data(data)
        .filter(function(d) {
            if(currentG != "All") {
                return currentLegend == d["Legendary"] && currentG == d["Generation"];
            } else {
            return currentLegend == d["Legendary"] ;
            }
        })
        .attr("display", display);

        if(currentLegend == "All" && currentG == "All") {
            svgScatterPlot.selectAll(".circles")
            .data(data)
            .attr("display", display);
        }

        if(currentLegend == "All" && currentG != "All") {
            svgScatterPlot.selectAll(".circles")
            .data(data)
            .filter(function(d) {return currentG == d["Generation"];})
            .attr("display", display);
        }
  }

  function makeLabels() {
    svgScatterPlot.append('text')
      .attr('x', 170)
      .attr('y', 30)
      .style('font-size', '14pt')
      .text("Pokmeon: Special Defense vs. Total Stats");

    mydropdown1.append('text')
      .attr('x', 30)
      .attr('y', 46)
      .style('font-size', '10pt')
      .text('Legendary:');

    mydropdown2.append('text')
      .attr('x', 30)
      .attr('y', 46)
      .style('font-size', '10pt')
      .text('Generation:');

    legend.append('text')
      .attr('x', 30)
      .attr('y', 46)
      .style('font-size', '10pt')
      .text('Legend:');

    svgScatterPlot.append('text')
      .attr('x', 300)
      .attr('y', 580)
      .style('font-size', '10pt')
      .text('Special Defense');


    svgScatterPlot.append('text')
      .attr('transform', 'translate(15, 350)rotate(-90)')
      .style('font-size', '10pt')
      .text('Total Stats');
  }

  function plotData(map) {

    console.log(map)
    let pop_data = data.map((row) => +row["Sp. Def"]);
    let pop_limits = d3.extent(pop_data);
    let type1 = data.map((row) => row["Type 1"]);
    var color = d3.scaleOrdinal()
    .domain(Array.from(new Set(type1)))
    .range(colors)


    legend.selectAll('mycircles')
        .data([...new Set(data.map((row) => row['Type 1']))])
        .enter()
        .append("circle")
        .attr("cx", 100)
        .attr("cy", function(d,i){ return 100 + i*20})
        .attr("r", 5)
        .style("fill", function(d){ return color(d)});

    legend.selectAll('mylabels')
        .data([...new Set(data.map((row) => row['Type 1']))])
        .enter()
        .append("text")
        .attr("x", 120)
        .attr("y", function(d,i){ return 100 + i*20})
        .style("fill", "black")
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

    let xMap = map.x;
    let yMap = map.y;

    let div = d3.select("#svg").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0)

    let toolChart = div.append('svg')
        .attr('width', 50)
        .attr('height', 50)

    svgScatterPlot.selectAll('.dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', xMap)
        .attr('cy', yMap)
        .attr('stroke-width', 2)
        .attr("class", "circles")
        .attr('r', 7)
        .style("fill", function(d) { return color((d["Type 1"]));})
        .on("mouseover", (d) => {
            toolChart.selectAll("*").remove()
            div.transition()
                .duration(200)
                .style("opacity", .9);
                div.html("" + "<b>" + d["Name"] + "</b>" + "<br/>" +
                        "" + d["Type 1"] + "<br/>" +
                        "" + d["Type 2"])

        })
        .on("mouseout", (d) => {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
  }

  function drawAxes(limits, x, y, svg, rangeX, rangeY) {

    let xValue = function(d) { return +d[x]; }


    let xScale = d3.scaleLinear()
      .domain([limits.xMin - 0.5, limits.xMax + 0.5])
      .range([rangeX.min, rangeX.max]);


    let xMap = function(d) { return xScale(xValue(d)); };


    let xAxis = d3.axisBottom().scale(xScale);
    svg.append("g")
      .attr('transform', 'translate(0, ' + rangeY.max + ')')
      .call(xAxis);


    let yValue = function(d) { return +d[y]}


    let yScale = d3.scaleLinear()
      .domain([limits.yMax + 5, limits.yMin - 5])
      .range([rangeY.min, rangeY.max]);


    let yMap = function (d) { return yScale(yValue(d)); };

    let yAxis = d3.axisLeft().scale(yScale);
    svg.append('g')
      .attr('transform', 'translate(' + rangeX.min + ', 0)')
      .call(yAxis);

    return {
      x: xMap,
      y: yMap,
      xScale: xScale,
      yScale: yScale
    };
  }

  function findMinMax(x, y) {

    let xMin = d3.min(x);
    let xMax = d3.max(x);

    let yMin = d3.min(y);
    let yMax = d3.max(y);

    return {
      xMin : xMin,
      xMax : xMax,
      yMin : yMin,
      yMax : yMax
    }
  }

})();
