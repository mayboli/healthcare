var svgWidth = 750;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

//  Import data
d3.csv("data.csv")
  .then(function(healthData) {
    console.log(healthData);
    //  Since d3 reads data as a string, cast data as numbers
    healthData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    //  Create scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)])
      .range([height, 0]);

    //  Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
      .data(healthData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "lightblue")
      .attr("opacity", ".5");
  
    // circlesGroup.append("text")
    //   .data(healthData)
    //   .enter()
    //   .text(function(d) { return d.abbr; })
    //   .attr("font-size", "12px")
    //   .attr("color", "black")
    //   .attr("cx", d => xLinearScale(d.poverty))
    //   .attr("cy", d => yLinearScale(d.healthcare));
    
    chartGroup.append("text")
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .selectAll("tspan")
      .data(healthData)
      .enter()
      .append("tspan")
        .attr("x", function(d) {
          return xLinearScale(d.poverty);
        })
        .attr("y", function(d) {
          return yLinearScale(d.healthcare) +4;
        })
        .text(function(d) {
          return d.abbr
        });


    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return(`${d.state}<br>In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`);
      });
      
    chartGroup.call(toolTip);

    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create y-axis label
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 50)
      .attr("x", 0 - (height/1.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width/2 - 40}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
    
    // const textElem = chartGroup.append("g")
    //   .selectAll("text")
    //   .data(healthData)
    //   .enter()
    //   .append("text")
    //   .text(d => d.abbr)
    //   .attr("font-size", 8)
    //   .attr("dx", 20)
    //   .attr("dy", 40)

    // for (var i = 0; i < circlesGroup.length; i++)
    // circlesGroup.append("text")
      // .data(healthData)
      // .enter()
      // .append("text")
      // .attr("dx", function(d) {return 20})
      // .attr("dy", function(d) {return 20})
      // .text(function(d) {return 20});
      
    // var text = svgContainer.selectAll("text")
    //   .data(healthData)
    //   .enter()
    //   .append("text");

    // var textLabels = text
    //   .text(function(d) {return ${d.abbr}});


  });

