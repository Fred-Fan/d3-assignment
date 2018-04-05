'use strict';
$(function(){
  // Setting up the chart area
  var margin = {
    top: 40,
    right: 20,
    bottom: 40,
    left: 50
  };

  function colors(i){
    switch(i) {
      case 'Asia':
        return "red";
        break;
      case 'Europe':
        return "blue";
        break;
      case 'North America':
        return "green";
        break;
    };
  };

  var canvasWidth = 800;
  var canvasHeight = 600;
  var width = canvasWidth - margin.left - margin.right;
  var height = canvasHeight - margin.top - margin.bottom;
  var svg = d3.select('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight);

  //title
  //http://www.d3noob.org/2013/01/adding-title-to-your-d3js-graph.html
  svg.append("text")
        .attr("x", (canvasWidth / 2))
        .attr("y", margin.top/2 )
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("How did tourists enter Brazil?");

  //x-axis
  svg.append("text")
        .attr("x", (canvasWidth / 2))
        .attr("y", canvasHeight - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("By Land");

  //y-axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x",0 - (canvasHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("By Sea")

  //add legend
  //http://www.competa.com/blog/d3-js-part-7-of-9-adding-a-legend-to-explain-the-data/
  var legendRectSize = 10
  var legendSpacing = 6

  var color = d3.scaleOrdinal()
    .domain(["Asia", "Europe", 'North America'])
    .range(["red", "blue", "green"]);

  var legend = d3.select('svg')
    .append("g")
    .selectAll("g")
    .data(color.domain())
    .enter()
    .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d, i) {
        var x = width - 50;
        var y = 50 + i*legendRectSize*2;
        return 'translate(' + x + ',' + y + ')';
    });

  legend.append('circle')
    .attr("r", 3)
    .style('fill', color)
    .style('stroke', color);

  legend.append('text')
    .attr('x', legendRectSize)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d; });


  // Add area for points
  var graphArea = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var xScale;

  var yScale;

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  // Step 1: edit data.csv to include the data you want to show
  d3.csv('data.csv', function(data) {
    // Step 2: Create x and y scales (scaleLinear) to draw points.
    // Set xScale and yScale to the scales so you can use them outside this function.

    // Add code here

    // Step 3: Add code to color the points by category (add code here or above)

    // // Add axes (uncomment this code to add axes)

  });

  // Animate points
  var originalYear = 2012;
  var maxYear = 2015;
  var year = originalYear;
  $("#year").text('Year: ' + String(year));

  d3.csv('data.csv', function(data) {
    // initialize the scatterplot for 2012
    // convert string to integer, otherwise d3.max has issues
    data.forEach(function(d) {
        d['Land_2012'] = +d['Land_2012'];
        d['Sea_2012'] = +d['Sea_2012'];
        });
    var xmax = d3.max(data,function (d){return d['Land_2012']})*1.1
    var ymax = d3.max(data,function (d){return d['Sea_2012']})*1.1
    xScale = d3.scaleLinear()
      .domain([0, xmax])
      .range([0, width])
      .nice();
    // +a : convert a to integer
    yScale = d3.scaleLinear()
      .domain([ymax, 0])
      .range([0, height])
      .nice();

    graphArea.append('g')
       .attr('class', 'x axis')
       .attr('transform', 'translate(0,' + (height) + ')')
       .call(d3.axisBottom(xScale));

    graphArea.append('g')
       .attr('class', 'y axis')
       .call(d3.axisLeft(yScale));
    graphArea.selectAll('circle')
           .data(data)
           .enter()
           .append('circle')
           .attr('cx', function(d) {console.log(d['Land_2012']); return d['Land_2012']*width/xmax})
           .attr('cy', function(d) {return height-d['Sea_2012']*height/ymax})
           .attr("r", 6)
           .attr("fill", function(d) {return colors(d['Continent'])})
           // add toottip
           // http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
           .on("mouseover", function(d) {
              div.transition()
                 .duration(200)
                 .style("opacity", .9);
              div.html('Country:' + d['Country'] + "<br/>" +
                       ' By land:' + d['Land_2012'] + "<br/>" +
                       " By Sea:" + d['Sea_2012'])
                 .style("left", (d3.event.pageX) + "px")
                 .style("top", (d3.event.pageY - 28) + "px");
             })
          .on("mouseout", function(d) {
              div.transition()
                .duration(500)
                .style("opacity", 0);
              });
    //console.log(data)
  });

  d3.select('#nextButton').on('click', function(event) {
    if (year == maxYear) {
      year = originalYear;
    } else {
      year = year + 1;
    }
    //return current year to index.html
    $("#year").text('Year: ' + String(year));

    var xColumn = 'Land_' + String(year);
    var yColumn = 'Sea_' + String(year);
    // Step 4: Animate changing the points shown by year here


    d3.csv('data.csv', function(data) {
      data.forEach(function(d) {
        d[xColumn] = +d[xColumn];
        d[yColumn] = +d[yColumn];
        });

      //autoscale axis
      //https://bl.ocks.org/HarryStevens/678935d06d4601c25cb141bacd4068ce
      var xmax = d3.max(data,function (d){return d[xColumn]})*1.1
      var ymax = d3.max(data,function (d){return d[yColumn]})*1.1
      //console.log(+d3.max(data,function(d){return d[xColumn]}))
      //console.log(ymax)

      xScale.domain([0, xmax])
      yScale.domain([ymax, 0])
      var t = d3.transition()
            .duration(500)
      graphArea.select(".x")
          .transition(t)
          .call(d3.axisBottom(xScale));
      graphArea.select(".y")
        .transition(t)
        .call(d3.axisLeft(yScale));

    // Add code here
      //console.log(data)
      graphArea.selectAll('circle')
               .data(data)
               .transition()
               .duration(600)
               .attr('cx', function(d) {return d[xColumn]*width/xmax})
               .attr('cy', function(d) {return height-d[yColumn]*height/ymax})
               .attr("r", 6)
               .attr("fill", function(d) {return colors(d['Continent'])});

      graphArea.selectAll('circle')
               .data(data)
               .on("mouseover", function(d) {
                  div.transition()
                    .duration(200)
                    .style("opacity", .9);
                  div.html('Country:' + d['Country'] + "<br/>" +
                      ' By land:' + d[xColumn] + "<br/>" +
                       " By Sea:" + d[yColumn])
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
                  })
               .on("mouseout", function(d) {
                  div.transition()
                    .duration(500)
                    .style("opacity", 0);
                  });


      //console.log(d3.selectAll('circle'))

    });
  });


});

// Step 5: make some other change to the graph

