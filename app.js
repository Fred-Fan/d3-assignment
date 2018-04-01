'use strict';
$(function(){
  // Setting up the chart area
  var margin = {
    top: 40,
    right: 20,
    bottom: 30,
    left: 40
  };

  function colors(i){
    switch(i) {
      case 'Normal':
        return "red";
        break;
      case 'Chaotic':
        return "blue";
        break;
    };
  };

  var canvasWidth = 400;
  var canvasHeight = 300;
  var width = canvasWidth - margin.left - margin.right;
  var height = canvasHeight - margin.top - margin.bottom;
  var svg = d3.select('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight);

  //title
  svg.append("text")
        .attr("x", (canvasWidth / 2))
        .attr("y", margin.top/2 )
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .text("D3-assignment");

  //x-axis
  svg.append("text")
        .attr("x", (canvasWidth / 2))
        .attr("y", canvasHeight)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text("X");

  //y-axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x",0 - (canvasHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("Y")

  //add legend
// var svg2 = d3.select("#legend")
//   .append("svg")
//   .attr("width", 30)
//   .attr("height", 20);

// var legend = svg2.append("g")
//                 .attr("class", "legend1")
//                 .attr('transform', 'translate(-20,50)')


// legend.selectAll('rect')
//   .data(dataset)
//   .enter()
//   .append("rect")
//   .attr("x", 30)
//   .attr("y", function(d, i){ return (i-1) *  20;})
//   .attr("width", 5)
//   .attr("height", 5)
//   .style("fill", function(d) { return colors[d];
//   })

// legend.selectAll('text')
//   .data(dataset)
//   .enter()
//   .append("text")
//   .attr("x", 40)
//   .attr("width", 5)
//   .attr("height", 5)
//   .attr("y", function(d, i){ return (i-1) *  20 + 5;})
//   .text(function(d) {
//     var text = color_hash[dataset.indexOf(d)][0];
//     return text;
//   });

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
        d['xValue_2012'] = +d['xValue_2012'];
        d['yValue_2012'] = +d['yValue_2012'];
        });
    var xmax = 2 + +d3.max(data,function (d){return d['xValue_2012']})
    var ymax = 2 + +d3.max(data,function (d){return d['yValue_2012']})
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
           .attr('cx', function(d) {return d['xValue_2012']*width/xmax})
           .attr('cy', function(d) {return height-d['yValue_2012']*height/ymax})
           .attr("r", 6)
           .attr("fill", function(d) {return colors(d['category'])})
           .on("mouseover", function(d) {
              div.transition()
                 .duration(200)
                 .style("opacity", .9);
              div.html(d['xValue_2012'] + "," + d['yValue_2012'])
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
    $("#year").text('Year: ' + String(year));
    var xColumn = 'xValue_' + String(year);
    var yColumn = 'yValue_' + String(year);
    // Step 4: Animate changing the points shown by year here


    d3.csv('data.csv', function(data) {
      data.forEach(function(d) {
        d[xColumn] = +d[xColumn];
        d[yColumn] = +d[yColumn];
        });
      var xmax = 2 + +d3.max(data,function (d){return d[xColumn]})
      var ymax = 2 + +d3.max(data,function (d){return d[yColumn]})
      console.log(+d3.max(data,function(d){return d[xColumn]}))
      console.log(ymax)
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
               .attr("fill", function(d) {return colors(d['category'])});

      graphArea.selectAll('circle')
               .data(data)
               .on("mouseover", function(d) {
                  div.transition()
                    .duration(200)
                    .style("opacity", .9);
                  div.html(d[xColumn] + "," + d[yColumn])
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

