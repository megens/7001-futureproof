import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  refreshCriteriaSet,
  refreshCourseSettings,
  refreshUnRead,
} from "../Utilities/utilities.js";

const deepCopy = require("rfdc")(); // a really fast deep copy function

class NavQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = { qFlagged: false };
  }

  flagQuestion = (evt) => {
    evt.preventDefault();
    console.log("question flagged");
    this.setState({ qFlagged: !this.state.qFlagged });
  };

  removeQFromHistory = (evt) => {
    evt.preventDefault();
    console.log("remove Q from History");
    const courseCode = this.props.currentQuestion.courseCode;
    let deleteConfirmed = confirm(
      "This response will be permanently deleted from your history. Are you sure?"
    );
    if (deleteConfirmed) {
      let newLiveStudentHistory = deepCopy(this.props.liveStudentHistory);
      let lengthWas = newLiveStudentHistory.length;
      let indexOfQWas = this.props.indexOfQ;

      let goToIndex =
        (lengthWas === 1) * 0 +
        (lengthWas !== 1) *
          ((indexOfQWas === lengthWas - 1) * (indexOfQWas - 1) +
            (indexOfQWas !== lengthWas - 1) * (indexOfQWas + 1));
      console.log("goToIndex is " + goToIndex);
      console.log(newLiveStudentHistory);
      console.log(newLiveStudentHistory[goToIndex]);
      console.log(newLiveStudentHistory[goToIndex].qNum);
      let goToQ;
      if (lengthWas !== 1) {
        goToQ = newLiveStudentHistory[goToIndex].qNum;
      }
      if (lengthWas === 1) {
        goToQ = "-99";
      } // removing last Q => push to somewhere else
      console.log("goToQ is " + goToQ);

      newLiveStudentHistory.splice(this.props.indexOfQ, 1); // removes this element

      let studentHistoryCopy = deepCopy(this.props.studentHistory);
      studentHistoryCopy[courseCode] = newLiveStudentHistory;

      const unReadARRAY = refreshUnRead(
        this.props.liveCourse,
        this.props.criteriaTypes,
        this.props.liveCourseSettings,
        newLiveStudentHistory
      );
      let liveUnReadQs = unReadARRAY[0];
      let filteredUnReadQs = unReadARRAY[1];

      // TO DO: move the following into refreshUnRead if it's consistent
      let currentQuestion;
      if (filteredUnReadQs.length === 0) {
        //no new question left, so render last answered
        currentQuestion =
          newLiveStudentHistory[newLiveStudentHistory.length - 1];
      } else {
        currentQuestion = filteredUnReadQs[0];
      }

      let newQ = filteredUnReadQs[1]; // a default POTENTIAL next Q if requested
      if (!newQ) {
        newQ = newLiveStudentHistory[newLiveStudentHistory.length - 1];
      }
      const newQNum = "" + newQ.courseCode + "/" + newQ.qNum;
      ////////

      console.log("dispatch to REMOVE-Q");
      console.log(newLiveStudentHistory);
      console.log("length " + newLiveStudentHistory.length);
      this.props.dispatch({
        type: "REMOVE-Q",
        payload: {
          studentHistory: studentHistoryCopy,
          liveStudentHistory: newLiveStudentHistory,
          currentQuestion: currentQuestion,
          newQNum: newQNum,
        },
      });

      this.props.dispatch({
        type: "UPDATE-UNREADQS",
        payload: {
          filteredUnReadQs: filteredUnReadQs,
          liveStudentUnRead: liveUnReadQs,
        },
      });

      // TO DO: update on server here ... currently will update on server at Logout anyway, but just in case

      console.log("go to prev Q or /");
      console.log("length was " + lengthWas);
      console.log("index of Q was" + indexOfQWas);
      console.log(this.props.liveStudentHistory[Math.max(0, indexOfQWas)].qNum);

      if (lengthWas <= 1) {
        this.props.rD.history.push("/CourseMenu/" + courseCode);
      } else {
        this.props.rD.history.push("/question/" + courseCode + "/" + goToQ);
      }
    }
  };

  render = () => {
    console.log("answer submitted");
    console.log("isCorrect: " + this.props.isCorrect);
    const courseCode = this.props.currentQuestion.courseCode;
    const qNum = this.props.currentQuestion.qNum;
    const indexOfQ = this.props.indexOfQ;

    return (
      <div>
        <Link
          to={
            "/question/" +
            courseCode +
            "/" +
            this.props.liveStudentHistory[0].qNum
          }
        >
          <button className="icon-btn short">
            <i className="fas fa-fast-backward"></i> End
          </button>
        </Link>

        <Link
          to={
            "/question/" +
            courseCode +
            "/" +
            this.props.liveStudentHistory[Math.max(0, indexOfQ - 10)].qNum
          }
        >
          <button className="icon-btn short">
            <i className="fas fa-backward"></i> -10
          </button>
        </Link>

        <Link
          to={
            "/question/" +
            courseCode +
            "/" +
            this.props.liveStudentHistory[Math.max(0, indexOfQ - 1)].qNum
          }
        >
          <button className="icon-btn short">
            <i className="fas fa-step-backward"></i> -1
          </button>
        </Link>

        <Link
          to={
            "/question/" +
            courseCode +
            "/" +
            this.props.liveStudentHistory[
              Math.min(this.props.liveStudentHistory.length - 1, indexOfQ + 1)
            ].qNum
          }
        >
          <button className="icon-btn short">
            <i className="fas fa-step-forward"></i> +1
          </button>
        </Link>

        <Link
          to={
            "/question/" +
            courseCode +
            "/" +
            this.props.liveStudentHistory[
              Math.min(this.props.liveStudentHistory.length - 1, indexOfQ + 10)
            ].qNum
          }
        >
          <button className="icon-btn short">
            <i className="fas fa-forward"></i> +10
          </button>
        </Link>

        <Link
          to={
            "/question/" +
            courseCode +
            "/" +
            this.props.liveStudentHistory[
              this.props.liveStudentHistory.length - 1
            ].qNum
          }
        >
          <button className="icon-btn short">
            <i className="fas fa-fast-forward"></i> End
          </button>
        </Link>

        <br />
        <Link to={"/question/" + "101/101-0001"}>
          <button className="icon-btn short">
            <i className="fas fa-search"></i> Search
          </button>
        </Link>

        <br />
        <br />
        <button className="icon-btn short" onClick={this.removeQFromHistory}>
          <i className="fas fa-trash-alt"></i> Remove
        </button>

        <button className="icon-btn short" onClick={this.flagQuestion}>
          <i className="fas fa-exclamation-triangle"></i>{" "}
          {this.state.qFlagged ? "Clear" : "Flag"}
        </button>

        {this.state.qFlagged ? (
          <form onSubmit={this.submitFlagComment}>
            <b>Input concerns about question / answer</b>
            <input type="text"></input>
            <input type="submit" />
          </form>
        ) : (
          ""
        )}
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    liveCourse: state.liveCourse,
    criteriaTypes: state.criteriaTypes,
    liveCourseSettings: state.liveCourseSettings,
    studentHistory: state.studentHistory,
    liveStudentHistory: state.liveStudentHistory,
    currentQuestion: state.currentQuestion,
    liveStudentUnRead: state.liveStudentUnRead,
    filteredUnReadQs: state.filteredUnReadQs,
  };
};

export default connect(mapStateToProps)(NavQuiz);
