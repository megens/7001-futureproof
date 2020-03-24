import React, { Component } from "react";
import CourseRun from "../CourseRun/CourseRun.jsx";
import { connect } from "react-redux";
const deepCopy = require("rfdc")(); // a really fast deep copy function

class Dashboard extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log("MOUNT Dashboard");
  };

  componentDidUpdate = () => {
    console.log("UPDATE Dashboard");
  };

  round = (value, precision) => {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  };

  render = () => {
    console.log("liveStudentHistory");
    console.log(this.props.liveStudentHistory);

    const questionsAnswered = this.props.liveStudentHistory;
    const questionsCorrect = this.props.liveStudentHistory.filter(q => {
      return q.response_submitted === q.response_correct;
    });
    const questionsIncorrect = this.props.liveStudentHistory.filter(q => {
      return !(q.response_submitted === q.response_correct);
    });

    return (
      <div className="course-container">
        <CourseRun />
        <div className="wide">
          <br />
          <div className="question-box">
            {this.props.username ? this.props.username : "browsing"}

            <p>You have answered {questionsAnswered.length} questions.</p>
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
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    username: state.username,
    studentHistory: state.studentHistory,
    liveStudentHistory: state.liveStudentHistory
  };
};

export default connect(mapStateToProps)(Dashboard);
