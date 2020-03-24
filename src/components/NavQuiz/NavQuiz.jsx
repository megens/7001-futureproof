import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
const deepCopy = require("rfdc")(); // a really fast deep copy function

class NavQuiz extends Component {
  constructor(props) {
    super(props);
    this.state = { qFlagged: false };
  }

  flagQuestion = evt => {
    evt.preventDefault();
    console.log("question flagged");
    this.setState({ qFlagged: !this.state.qFlagged });
  };

  removeQFromHistory = evt => {
    evt.preventDefault();
    console.log("remove Q from History");
    const courseCode = this.props.currentQuestion.courseCode;
    let deleteConfirmed = confirm(
      "This response will be permanently deleted from your history. Are you sure?"
    );
    if (deleteConfirmed) {
      let newLiveStudentHistory = this.props.liveStudentHistory.slice();
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
      console.log("dispatch to REMOVE-Q");
      console.log(newLiveStudentHistory);
      console.log("length " + newLiveStudentHistory.length);
      this.props.dispatch({
        type: "REMOVE-Q",
        payload: {
          studentHistory: studentHistoryCopy,
          liveStudentHistory: newLiveStudentHistory,
          currentQuestion: {}
        }
      });

      // TO DO: update on server here ... currently will update on server at Logout anyway, but just in case

      console.log("go to prev Q or /");
      console.log("length was " + lengthWas);
      console.log("index of Q was" + indexOfQWas);
      console.log(this.props.liveStudentHistory[Math.max(0, indexOfQWas)].qNum);

      if (lengthWas <= 1) {
        this.props.rD.history.push("/courseRun/" + courseCode);
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
        <Link to={"/question/" + "101/101-0001"}>
          <button className="icon-btn short">
            <i className="fas fa-plus"></i> New Q
          </button>
        </Link>

        <br />

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

const mapStateToProps = state => {
  return {
    studentHistory: state.studentHistory,
    liveStudentHistory: state.liveStudentHistory,
    currentQuestion: state.currentQuestion
  };
};

export default connect(mapStateToProps)(NavQuiz);
