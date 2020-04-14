import React, { Component } from "react";
import CourseMenu from "../CourseMenu/CourseMenu.jsx";
import { connect } from "react-redux";

const deepCopy = require("rfdc")(); // a really fast deep copy function
//const d3 = require("d3");
// d3 being brought in by script in index.html

class Admin extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log("MOUNT Admin");
  };

  componentDidUpdate = () => {
    console.log("UPDATE Admin");
  };

  studentBallast = [];
  chapterVec = ["1", "2", "3"];
  q_1 = {
    question: "question example",
    response_a: "answer a",
    response_b: "answer b",
    response_c: "answer c",
    response_correct: "c",
    qNum: "101-9999",
    template: "Template001",
    qType: "MC",
    complete: true,
    skipped: false,
    courseCode: "101",
    response_submitted: "b", // a wrong answer ... important in following logic
    chapter: "2",
    elapsedTime: 2,
    setter: "Charlotte",
    username: "dd",
    dateStamp: "4/12/2020, 9:24:27 AM",
  };

  getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  };

  getRandom = () => {
    return Math.random();
  };

  probSkipped = 0.05; // used 0.2 for username "dd"
  probCorrect = 0.7; // of those that are not skipped, logic suggests

  buildStudenBallast_1 = () => {
    console.log("buildStudenBallast_1");
    let todayDate = new Date();
    let year = todayDate.getFullYear();
    let month = todayDate.getMonth();
    let day = todayDate.getDate();
    let today = new Date(year, month, day);
    // generate previous x days of history
    let numberOfDays = 10;

    for (let i = numberOfDays; i > 0; i--) {
      // for each of last i days, generate j questions for history
      let questionDate = new Date(year, month, day - i);
      let dailyQuestionNumber = this.getRandomInt(5, 10);
      for (let j = 0; j < dailyQuestionNumber; j++) {
        let correctQ = deepCopy(this.q_1);
        let randomNum = this.getRandom();
        if (randomNum < this.probSkipped) {
          correctQ.skipped = true;
          correctQ.complete = false;
        } else {
          correctQ.complete = true;
          correctQ.skipped = false;
          let newRandomNum =
            (randomNum - this.probSkipped) / (1 - this.probSkipped);
          if (newRandomNum < this.probCorrect) {
            correctQ.response_submitted = correctQ.response_correct;
          } else {
          }
        }
        correctQ.dateStamp = questionDate;
        correctQ.elapsedTime = this.getRandomInt(30, 90);
        let randomChapter = this.getRandomInt(1, 4);
        correctQ.chapter = this.chapterVec[randomChapter - 1];

        correctQ.username = this.props.username;
        this.studentBallast.push(correctQ);
      }
    }
    console.log(this.studentBallast);
  };

  updateStudentHistory = () => {
    let courseCode = this.props.liveCourse.courseCode;
    let liveStudentHistoryCopy = deepCopy(this.props.liveStudentHistory);
    let studentHistoryCopy = deepCopy(this.props.studentHistory);
    let liveAllResponsesCopy = deepCopy(this.props.liveAllResponses);
    let subscribedAllResponsesCopy = deepCopy(
      this.props.subscribedAllResponses
    );
    console.log(liveStudentHistoryCopy);
    liveStudentHistoryCopy = this.studentBallast.concat(liveStudentHistoryCopy);
    console.log(liveStudentHistoryCopy);
    studentHistoryCopy[courseCode] = liveStudentHistoryCopy;
    liveAllResponsesCopy = this.studentBallast.concat(liveAllResponsesCopy);
    subscribedAllResponsesCopy[courseCode] = liveAllResponsesCopy;

    this.props.dispatch({
      type: "BULK-ADD-HISTORY",
      payload: {
        liveStudentHistory: liveStudentHistoryCopy,
        studentHistory: studentHistoryCopy,
        liveAllResponses: liveAllResponsesCopy,
        subscribedAllResponses: subscribedAllResponsesCopy,
      },
    });
  };

  render = () => {
    console.log("render Study");

    return (
      <>
        <div className="course-container">
          <CourseMenu />
          <div className="wide">
            <br />
            <div className="question-box">
              Admin - bespoke functions
              <br />
              <button type="button" onClick={this.buildStudenBallast_1}>
                build Ballast 1
              </button>
              <br />
              <button type="button" onClick={this.updateStudentHistory}>
                update Student History
              </button>
              <br />
            </div>
          </div>
        </div>
      </>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    liveCourse: state.liveCourse,
    liveStudentHistory: state.liveStudentHistory,
    studentHistory: state.studentHistory,
    liveAllResponses: state.liveAllResponses,
    subscribedAllResponses: state.subscribedAllResponses,
  };
};

export default connect(mapStateToProps)(Admin);
