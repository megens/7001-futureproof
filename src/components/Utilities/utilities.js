const refreshCriteriaSet = (liveCourse, criteriaTypes) => {
  // Because the possible criteriaSet may have changed since last login, rebuild this
  // (new questions becoming available on DB), update this at every "courseLoad"
  let criteriaSet = []; // list of all possible criteriaSet values
  criteriaTypes.forEach((cType) => {
    liveCourse.questionVec.forEach((question) => {
      criteriaSet.push(cType + "_" + question[cType]);
    });
  });
  criteriaSet = [...new Set(criteriaSet)]; // remove the many duplicates
  criteriaSet = Array.from(criteriaSet).sort((a, b) => {
    return a.localeCompare(b, "en", { sensitivity: "base" }); // sort
  });
  return criteriaSet;
};

const refreshCourseSettings = (
  courseCode,
  criteriaSet,
  subscriptionSettingsCopy
) => {
  // populate from prev saved settings, if avail.
  // not just this.props.subscriptionSettings[courseCode] because new criteria possibilities
  // may have developed if Admin has added any further criteria or categories on q's
  let liveCourseSettings = {};
  criteriaSet.forEach((criterion) => {
    console.log("criterion " + criterion);
    if (
      true === subscriptionSettingsCopy[courseCode][criterion] ||
      false === subscriptionSettingsCopy[courseCode][criterion]
    ) {
      //criterion is true
      console.log("criterion is either true or false (i.e. not undefined)");
      liveCourseSettings[criterion] =
        subscriptionSettingsCopy[courseCode][criterion];
    } else {
      console.log("neither true nor false ... new criterion since last time");
      liveCourseSettings[criterion] = true; // default to True for now ... maybe let user decide
      // TO DO: have option that User selects ALL all the time, or that User selects how to handle new categories
      // TO DO: alert user that new categories have emerged since Settings were set, and force them to that page.
    }
  });
  subscriptionSettingsCopy[courseCode] = liveCourseSettings;
  return [liveCourseSettings, subscriptionSettingsCopy];
};

const refreshUnRead = (
  liveCourse,
  criteriaTypes,
  liveCourseSettings,
  liveStudentHistory
) => {
  let liveStudentUnRead = liveCourse.questionVec.slice();
  for (let i = 0; i <= liveStudentHistory.length - 1; i++) {
    //console.log("unread ", liveStudentUnRead);
    let indexOfQ = liveStudentUnRead.findIndex((question) => {
      return question.qNum === liveStudentHistory[i].qNum;
    });
    liveStudentUnRead.splice(indexOfQ, 1);
  }

  let filteredUnReadQs = liveStudentUnRead.filter((question) => {
    let cTypesMap = criteriaTypes.map((cType) => {
      return liveCourseSettings[cType + "_" + question[cType]];
    });
    return cTypesMap.every((x) => x); // same as x => x===true
  });

  // assign currentQuesiton and newQ however you like after running this function

  return [liveStudentUnRead, filteredUnReadQs];
};

const buildBarChart_v515 = (
  data,
  h,
  w,
  margin,
  elementClass,
  chartTitle,
  xLabelTitle,
  yLabelTitle
) => {
  console.log("buildBarChart");
  // so, this uses a more recent version (5.15) of D3 than can be used by NVD3, so I have to make a choice
  // ... use all old D3, and use just NVD3 tools, or build everything in D3
  // ... or find a more up to date package, but NVD3 looks pretty cool
  let height = h - margin;
  let width = w - margin;

  let svg = d3
    .select(elementClass)
    .select("svg")
    .attr("width", w)
    .attr("height", h);

  let xScale = d3.scaleBand().range([0, width]).padding(0.4),
    yScale = d3.scaleLinear().range([height, 0]);

  let g = svg
    .append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")");

  xScale.domain(
    data.map(function (d) {
      return d.year;
    })
  );
  yScale.domain([
    0,
    d3.max(data, function (d) {
      return d.value;
    }),
  ]);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  g.append("g")
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat(function (d) {
          return d; // was return "$" + d;
        })
        .ticks(10)
    )
    .append("text")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .attr("text-anchor", "end")
    .text("value");

  g.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return xScale(d.year);
    })
    .attr("y", function (d) {
      return yScale(d.value);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function (d) {
      return height - yScale(d.value);
    })
    .attr("fill", "royalblue");

  svg
    .append("text")
    .attr("transform", "translate(100,0)")
    .attr("x", 0)
    .attr("y", 50)
    .attr("stroke", "black")
    .attr("fill", "black")
    .attr("font-family", "sans-serif")
    .attr("font-size", "24px")
    .attr("font-weight", 300)
    .text(chartTitle);

  g.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .append("text")
    .attr("y", height * 0.0 + 50)
    .attr("x", width * 0.9)
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("fill", "black")
    .attr("font-family", "sans-serif")
    .attr("font-weight", 200)
    .attr("font-size", "16px") // RfM added
    .text(xLabelTitle);

  g.append("g")
    .call(
      d3
        .axisLeft(yScale)
        .tickFormat(function (d) {
          return d; //was return "$" + d;
        })
        .ticks(10)
    )
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-5.1em")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("fill", "black")
    .attr("font-family", "sans-serif")
    .attr("font-weight", 200)
    .attr("font-size", "16px") // RfM added
    .text(yLabelTitle);
};

const buildPieChart = (elementId1, data1, height, width, myColors) => {
  nv.addGraph(function () {
    var chart = nv.models
      .pieChart()
      .x(function (d) {
        return d.key;
      })
      .y(function (d) {
        return d.y;
      })
      //.legendPosition("right")
      //.showLabels(true)
      .color(myColors.slice(0, data1.length)) //.color(myColors.slice(8))
      .width(width)
      .height(height)
      .showTooltipPercent(true);

    d3.select(elementId1)
      //.select("svg")
      .datum(data1)
      .transition()
      .duration(1200)
      .attr("width", width)
      .attr("height", height)
      .call(chart);

    /*    d3.select(elementId1)
      //.select("svg")
      .append("text")
      .attr("transform", "translate(100,0)")
      .attr("x", 0)
      .attr("y", 0)
      .attr("stroke", "black")
      .attr("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("font-size", "24px")
      .attr("font-weight", 300)
      .text("Try this Title");
      */

    // update chart data values randomly
    /*
    setInterval(function () {
      testdata2[0].y = Math.floor(Math.random() * 10);
      testdata2[1].y = Math.floor(Math.random() * 10);
      chart.update();
    }, 4000);
*/
    return chart;
  });

  /*
  nv.addGraph(function () {
    var chart = nv.models
      .pieChart()
      .x(function (d) {
        return d.key;
      })
      .y(function (d) {
        return d.y;
      })
      //.labelThreshold(.08)
      //.showLabels(false)
      .color(myColors.slice(0, data1.length)) //.color(myColors.slice(8))
      //.color(d3.scale.category20().range().slice(8))
      .growOnHover(false)
      .labelType("value")
      .width(width)
      .height(height);

    // make it a half circle
    chart.pie
      .startAngle(function (d) {
        return d.startAngle / 2 - Math.PI / 2;
      })
      .endAngle(function (d) {
        return d.endAngle / 2 - Math.PI / 2;
      });

    // MAKES LABELS OUTSIDE OF PIE/DONUT
    //chart.pie.donutLabelsOutside(true).donut(true);

    // LISTEN TO CLICK EVENTS ON SLICES OF THE PIE/DONUT
    // chart.pie.dispatch.on('elementClick', function() {
    //     code...
    // });

    // chart.pie.dispatch.on('chartClick', function() {
    //     code...
    // });

    // LISTEN TO DOUBLECLICK EVENTS ON SLICES OF THE PIE/DONUT
    // chart.pie.dispatch.on('elementDblClick', function() {
    //     code...
    // });

    // LISTEN TO THE renderEnd EVENT OF THE PIE/DONUT
    // chart.pie.dispatch.on('renderEnd', function() {
    //     code...
    // });

    // OTHER EVENTS DISPATCHED BY THE PIE INCLUDE: elementMouseover, elementMouseout, elementMousemove
    // @see nv.models.pie

    d3.select(elementId2)
      .datum(data2)
      .transition()
      .duration(1200)
      .attr("width", width)
      .attr("height", height)
      .call(chart);

    // disable and enable some of the sections
    var is_disabled = false;
    setInterval(function () {
      chart.dispatch.changeState({
        disabled: { 2: !is_disabled, 4: !is_disabled },
      });
      is_disabled = !is_disabled;
    }, 3000);

    return chart;
    
  });
  */
};

const myColorsBlue = [
  "#4169e1",
  "#1B4F72",
  "#21618C",
  "#2874A6",
  "#2E86C1",
  "#3498DB",
  "#5DADE2",
  "#85C1E9",
  "#AED6F1",
  // "#D6EAF8",
];

const myColorsBlueWhite = [
  "#4169e1",
  "#6e80e7",
  "#8f98ec",
  "#aeb1f1",
  "#cacaf6",
  "#e5e4fb",
  "#919191",
  "#f5f5f5",
  "#ffffff",
];

const myColorsRedWhite = [
  "#ff4040",
  "#ff695d",
  "#ff8a7c",
  "#ffa89b",
  "#ffc6bb",
  "#ffe3dd",
  "#919191",
  "#f5f5f5",
  "#ffffff",
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const linePlusBarChart = (
  testdata,
  colorVec,
  xAxisTitle,
  yAxisTitle,
  elementId
) => {
  var chart;
  nv.addGraph(function () {
    chart = nv.models
      .linePlusBarChart()
      .margin({ top: 50, right: 80, bottom: 30, left: 80 })
      .legendRightAxisHint("") // here is where you would add text to the legend e.g. "[RHS]"
      //.color(d3.scale.category10().range());
      .color(colorVec)
      .focusEnable(false); // toggle button is not working, so just set this to false, and remove button

    chart.xAxis
      .axisLabel(xAxisTitle)
      .axisLabelDistance(-50)
      .tickFormat(function (d) {
        return 100 - d;
      })
      .showMaxMin(false);

    chart.y2Axis
      .tickFormat(function (d) {
        return d;
        //return "$" + d3.format(",f")(d);
      })
      .showMaxMin(false); // RfM ... i added this, but ?
    chart.bars.forceY([0, 120]).padData(true); // forcing inclusion of min max in order to match scales

    // add this paragraph
    chart.y1Axis
      .axisLabel(yAxisTitle)
      .axisLabelDistance(-20)
      .tickFormat(function (d) {
        return d;
      })
      .showMaxMin(false); // RfM ... i added this, but ?
    chart.bars.forceY([0, 120]).padData(true);

    chart.x2Axis
      .tickFormat(function (d) {
        return d3.time.format("%x")(new Date(d));
      })
      .showMaxMin(false);

    d3.select(elementId).datum(testdata).transition().duration(500).call(chart);

    nv.utils.windowResize(chart.update);

    chart.dispatch.on("stateChange", function (e) {
      nv.log("New State:", JSON.stringify(e));
    });

    return chart;
  });
};

const buildBarChart_Chapter = () => {
  console.log("chapter");
  let tempData = [
    { year: 2014, value: 45 },
    { year: 2015, value: 37 },
    { year: 2016, value: 42 },
    { year: 2017, value: 33 },
    { year: 2018, value: 50 },
    { year: 2019, value: 42 },
  ];
  let h = 350;
  let w = 400;
  let margin = 200;
  let elementClass = ".plot1";
  let chartTitle = "Charlotte and Isabelle";
  let xLabelTitle = "Year";
  let yLabelTitle = "Stock Price";
  buildBarChart(
    tempData,
    h,
    w,
    margin,
    elementClass,
    chartTitle,
    xLabelTitle,
    yLabelTitle
  );
  buildBarChart(
    tempData,
    h,
    w,
    margin,
    ".plot2",
    "Title 2",
    xLabelTitle,
    yLabelTitle
  );
};

export {
  refreshCriteriaSet,
  refreshCourseSettings,
  refreshUnRead,
  buildBarChart_v515,
  buildPieChart,
  linePlusBarChart,
};
