import React, { Component } from "react";
import CourseMenu from "../CourseMenu/CourseMenu.jsx";
import { connect } from "react-redux";
import {
  buildBarChart_v515,
  buildPieChart,
  linePlusBarChart,
} from "../Utilities/utilities.js";

//const d3 = require("d3");
//d3 instead being brought in by script in index.html
const deepCopy = require("rfdc")(); // a really fast deep copy function

class Dashboard extends Component {
  constructor() {
    super();
    this.state = { includeCompare: true };
    // TO DO: substitute state for Redux, and user profile for relevant course, so stays the same.
  }

  createPieObject = () => {
    let singleObject = { Correct: 0, Incorrect: 0, Skipped: 0 };
    let pieObject = {
      Chapter1: deepCopy(singleObject),
      Chapter2: deepCopy(singleObject),
      Chapter3: deepCopy(singleObject),
    };
    this.props.liveStudentHistory.forEach((x) => {
      console.log(x);
      let chapter = "Chapter" + x.chapter;
      console.log(chapter);
      let result = x.skipped
        ? "Skipped"
        : x.response_correct === x.response_submitted
        ? "Correct"
        : "Incorrect";
      //console.log(result);
      pieObject[chapter][result] = pieObject[chapter][result] + 1;
    });
    console.log(pieObject);
    let chapterVec = ["1", "2", "3"];
    let outcomeVec = ["Correct", "Incorrect", "Skipped"];
    // force format to array used in example ... TO DO... make graph read from my object instead
    let pieArray = chapterVec.map((chapter) => {
      let chapterArray = outcomeVec.map((outcome) => {
        let outcomeObject = {
          key: outcome,
          y: pieObject["Chapter" + chapter][outcome],
        };
        return outcomeObject;
      });
      return chapterArray;
    });
    console.log(pieArray);
    return pieArray;
  };

  componentDidMount = () => {
    console.log("MOUNT Dashboard");

    // build pie charts by chapter TO DO: generalize for additional chapters
    let pieArray = this.createPieObject();
    console.log("pieArray");
    console.log(pieArray);
    var height = 250;
    var width = 250;
    const colorsBlueRedWhite = ["#4169e1", "#ff4040", "#f5f5f5"];
    const elementId = ["#test1", "#test2", "#test3"];
    buildPieChart(elementId[0], pieArray[0], height, width, colorsBlueRedWhite);
    buildPieChart(elementId[1], pieArray[1], height, width, colorsBlueRedWhite);
    buildPieChart(elementId[2], pieArray[2], height, width, colorsBlueRedWhite);

    // build bar chart for progress over time
    let liveStudentHistoryCopy = deepCopy(this.props.liveStudentHistory);
    // adds the key stat "daysToExam"
    liveStudentHistoryCopy = this.addDaysToExam(liveStudentHistoryCopy);
    // how many days have you studied?
    let onlyDaysToExam = liveStudentHistoryCopy.map((x) => x.daysToExam);
    console.log(onlyDaysToExam);
    let minDaysToExam = Math.min(...onlyDaysToExam);
    let maxDaysToExam = Math.max(...onlyDaysToExam);
    console.log(minDaysToExam);
    console.log(maxDaysToExam);

    let incrementalDaysToExam = [];
    for (let i = maxDaysToExam; i >= minDaysToExam; i--) {
      incrementalDaysToExam.push({ x: i, y: 0 }); // array of Objects to count (y) questions seen
    }
    console.log("incrementalDaysToExam");
    console.log(incrementalDaysToExam);
    liveStudentHistoryCopy.forEach((question) => {
      // iterate ONCE through history rather than loop of loop
      let indexMatch = incrementalDaysToExam.findIndex(
        (entry) => entry.x === question.daysToExam
      );
      if (!question.skipped) {
        // not counting skipped toward progress
        console.log("adding an increment");
        incrementalDaysToExam[indexMatch].y =
          incrementalDaysToExam[indexMatch].y + 1; // a quesion that matches
      }
    });
    let cumulativeDaysToExam = deepCopy(incrementalDaysToExam);
    for (let i = 1; i < incrementalDaysToExam.length; i++) {
      // note starting at i=1 NOT i=0 ... at index 0, already equals the incremental
      console.log("adding a cumulative");
      cumulativeDaysToExam[i].y =
        cumulativeDaysToExam[i - 1].y + incrementalDaysToExam[i].y;
    }
    console.log("cumulativeDaysToExam");
    console.log(cumulativeDaysToExam);
    this.buildLinePlusBarChart();

    // TO DO: make this automatic for loop or forEach
    /*
    let chapter1History = liveStudentHistoryCopy.filter((x) => {
      x.chapter === "1";
    });
    let chapter2History = liveStudentHistoryCopy.filter((x) => {
      x.chapter === "2";
    });
    let chapter3History = liveStudentHistoryCopy.filter((x) => {
      x.chapter === "3";
    });
    */

    /*
    studentBallast.forEach((x, i) => {
      
      studentBallast[i].today = today;
    });
    console.log("studentBallast");
    console.log(studentBallast);
  };
  */

    //this.buildBarChart_Chapter(); // this is now out of action, if I use NVD3, as it relies on a more recent version of D3
    /*var testdata1 = [
      { key: "Correct", y: 5 }, //color: "#5F5"
      { key: "Incorrect", y: 2 },
      { key: "Skipped", y: 9 },
    ];
    */
  };

  componentDidUpdate = () => {
    console.log("UPDATE Dashboard");
  };

  addDaysToExam = (history) => {
    let enhancedHistory = history.map((x) => {
      let newx = deepCopy(x);
      let d = new Date(x.dateStamp); // q answer date
      let year = d.getFullYear();
      let month = d.getMonth();
      let day = d.getDate();
      let examDate = new Date("5/15/2020"); // TO DO: set this at Course Level ... logic to adjust for new
      let today = new Date(year, month, day);
      let secondsToExam = examDate - today;
      let daysToExam = secondsToExam / (1000 * 60 * 60 * 24);
      newx.examDate = examDate;
      newx.day = day; // q answer date
      newx.month = month;
      newx.year = year;
      newx.daysToExam = daysToExam;
      return newx;
    });
    return enhancedHistory;
  };

  buildLinePlusBarChart = () => {
    var builddata = [
      {
        key: "Progress",
        bar: true,
        values: [
          [1, 0],
          [2, 0],
          [3, 0],
          [4, 5],
          [5, 12],
          [6, 25],
          [7, 35],
          [8, 51],
          [9, 62],
          [10, 77],
          [11, 89],
          [12, 0],
          [13, 0],
        ],
      },
      {
        key: "Peer Cohort",
        values: [
          [1, 5],
          [2, 10],
          [3, 20],
          [4, 35],
          [5, 42],
          [6, 55],
          [7, 65],
          [8, 71],
          [9, 92],
          [10, 97],
          [11, 109],
          [12, 109],
          [13, 109],
        ],
      },
    ].map((series) => {
      series.values = series.values.map(function (d) {
        return { x: d[0], y: d[1] };
      });
      return series;
    });

    console.log("buildData");
    console.log(builddata);
    let colorVec = [
      "#4169e1",
      "#ff4040",
      "#6e80e7",
      //"#8f98ec","#aeb1f1","#cacaf6","#e5e4fb","#919191","#f5f5f5","#ffffff",
    ];
    let yAxisTitle = "Questions Answered";
    let xAxisTitle = "Days to Exam";
    let elementId = "#chart1 svg";
    linePlusBarChart(builddata, colorVec, xAxisTitle, yAxisTitle, elementId);
  };

  round = (value, precision) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

  handleChange = (evt) => {
    console.log("checked is " + evt.target.checked);
    console.log("state was " + this.state.includeCompare);
    this.setState({ includeCompare: evt.target.checked });
  };

  toggleAxis = () => {
    chart.switchYAxisOrder(!chart.switchYAxisOrder());
    chart.update();
  };

  toggleFocus = () => {
    chart.focusEnable(!chart.focusEnable());
    chart.update();
  };

  render = () => {
    console.log("liveStudentHistory");
    console.log(this.props.liveStudentHistory);

    const questionsAnswered = this.props.liveStudentHistory;
    const questionsCorrect = this.props.liveStudentHistory.filter((q) => {
      return q.response_submitted === q.response_correct;
    });
    const questionsIncorrect = this.props.liveStudentHistory.filter((q) => {
      return !(q.response_submitted === q.response_correct);
    });

    return (
      <div className="course-container">
        <CourseMenu />
        <div className="wide">
          <br />
          <div className="question-box">
            <b>Results Dashboard</b>
            <br />
            <br />
            {/*}
            <div>
              <input
                type="checkbox"
                name="includeCompare"
                onChange={this.handleChange}
                checked={this.state.includeCompare}
              />{" "}
              Include Peer Comparison?
            </div>
            */}
            <br />
            You have seen {questionsAnswered.length} questions.
            <p>
              Correct: {questionsCorrect.length} (
              {this.round(
                (100 * questionsCorrect.length) / questionsAnswered.length,
                2
              ).toFixed(1)}{" "}
              %)
            </p>
            <p>Avg Time </p>
            <p>%ile Rank </p>
            <p>Question Type</p>
            <div className="pie-container">
              <div className="with-3d-shadow with-transitions pie-tin">
                <b>Chapter 1</b>
                <svg id="test1" className="mypiechart"></svg>
              </div>
              <div className="with-3d-shadow with-transitions pie-tin">
                <b>Chapter 2</b>
                <svg id="test2" className="mypiechart"></svg>
              </div>
              <div className="with-3d-shadow with-transitions pie-tin">
                <b>Chapter 3</b>
                <svg id="test3" className="mypiechart"></svg>
              </div>
            </div>
            {/*
              THIS IS WHERE linePlusBarChart is placed
              <div style="position:absolute; top: 0; left: 0;">           
            */}
            {/*
            <div>
              <button
                onClick={() => {
                  chart.switchYAxisOrder(!chart.switchYAxisOrder());
                  chart.update();
                }}
              >
                toggle axis
              </button>
              <button
                onClick={() => {
                  chart.focusEnable(!chart.focusEnable());
                  chart.update();
                }}
              >
                toggle focus
              </button>
            </div>
            */}
            <div
              id="chart1"
              className="with-3d-shadow with-transitions pie-tin"
            >
              <b>Questions Completed Over Time</b>
              <svg id="chart1"> </svg>
            </div>
            <div className="wide plots">
              <div>
                <svg className="plot1"></svg>
              </div>
              <div className="plot2">
                <svg></svg>
              </div>
            </div>
            <div id="chart">
              <svg></svg>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    studentHistory: state.studentHistory,
    liveStudentHistory: state.liveStudentHistory,
    liveAllResponses: state.liveAllResponses,
  };
};

export default connect(mapStateToProps)(Dashboard);
