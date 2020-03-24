import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
const deepCopy = require("rfdc")(); // a really fast deep copy function

class AnswerTemplate extends Component {
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
      newLiveStudentHistory.splice(this.props.indexOfQ, 1); // removes this element

      let studentHistoryCopy = deepCopy(this.props.studentHistory);
      studentHistoryCopy[courseCode] = newLiveStudentHistory;
      console.log("dispatch to REMOVE-Q");
      console.log(newLiveStudentHistory);
      this.props.dispatch({
        type: "REMOVE-Q",
        payload: {
          studentHistory: studentHistoryCopy,
          liveStudentHistory: newLiveStudentHistory,
          currentQuestion: {}
        }
      });

      // TO DO: update on server here ... currently will update on server at Logout anyway, but just in case

      console.log("go to /");
      this.props.rD.history.push("/");
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
        {!this.props.currentQuestion.skipped ? (
          <div>
            <div className="red">
              <b>
                Response:{" "}
                {this.props.currentQuestion.response_submitted ===
                this.props.currentQuestion.response_correct
                  ? "Correct"
                  : "Incorrect"}
              </b>
            </div>
            <div>Correct: {this.props.currentQuestion.response_correct}</div>
            <div>
              Submitted: {this.props.currentQuestion.response_submitted}
            </div>
          </div>
        ) : (
          <div className="skipped">Skipped</div>
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

export default connect(mapStateToProps)(AnswerTemplate);
