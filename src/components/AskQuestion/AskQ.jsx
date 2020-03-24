import React, { Component } from "react";
import { connect } from "react-redux";
import CourseRun from "../CourseRun/CourseRun.jsx";
import SelectQTemplate from "../SelectQTemplate/SelectQTemplate.jsx";
import AnswerTemplate from "../AnswerTemplate/AnswerTemplate.jsx";
import QTimer from "../QTimer/QTimer.jsx";
import NavQuiz from "../NavQuiz/NavQuiz.jsx";
import TestQ from "../AskQuestion/TestQ.jsx";

class AskQ extends Component {
  constructor(props) {
    super(props);
    this.state = { favourite: false };
  }

  componentDidMount = () => {
    console.log("MOUNT AskQ");
  };

  componentDidUpdate = () => {
    console.log("UPDATE AskQ");
  };

  setFavourite = () => {
    this.setState({ favourite: !this.state.favourite });
  };

  newQuestion = () => {
    console.log("new Question");
    let liveStudentUnReadCopy = this.props.liveStudentUnRead.slice();
    let newQ = this.props.liveStudentUnRead[0];
    const newQNum = "" + newQ.courseCode + "/" + newQ.qNum;
    console.log(newQNum);
    // in case we change the index from 0 to something more general ...
    let idx = liveStudentUnReadCopy.findIndex(question => {
      return question.qNum === newQ.qNum;
    });
    liveStudentUnReadCopy.splice(idx, 1);
    this.props.dispatch({
      type: "UPDATE-UNREAD-Q",
      payload: { liveStudentUnRead: liveStudentUnReadCopy }
    });
    this.props.rD.history.push("/question/" + newQNum);
  };

  render = () => {
    console.log("render AskQ");
    console.log(this.props.currentQuestion);
    return (
      <div className="course-container">
        <CourseRun />
        <div className="wide">
          <br />
          <div className="question-box">
            <b>
              {this.props.indexOfQ + 1} of{" "}
              {this.props.liveStudentHistory.length}
            </b>
            <br />
            <b>Q#: </b>
            {this.props.currentQuestion.qNum}
            <br />
            <div onClick={this.setFavourite} key={this.state.favourite}>
              {this.state.favourite ? (
                <i className="fas fa-star"></i>
              ) : (
                <i className="far fa-star"></i>
              )}
            </div>
            <br />
            <br />
            <SelectQTemplate rD={this.props.rD} />
            {this.props.indexOfQ === this.props.liveStudentHistory.length - 1 &&
            this.props.liveStudentUnRead.length !== 0 &&
            (this.props.currentQuestion.complete ||
              this.props.currentQuestion.skipped) ? (
              <button className="icon-btn long" onClick={this.newQuestion}>
                <i className="fas fa-arrow-alt-circle-right"></i> New
              </button>
            ) : (
              ""
            )}
            {this.props.indexOfQ === this.props.liveStudentHistory.length - 1 &&
            this.props.liveStudentUnRead.length === 0 &&
            (this.props.currentQuestion.complete ||
              this.props.currentQuestion.skipped)
              ? "You have answered all questions for this course."
              : ""}

            <QTimer />
          </div>

          {this.props.currentQuestion.complete ||
          this.props.currentQuestion.skipped ? (
            <div className="question-box">
              <AnswerTemplate
                rD={this.props.rD}
                indexOfQ={this.props.indexOfQ}
              />
            </div>
          ) : (
            ""
          )}

          {this.props.currentQuestion.complete ||
          this.props.currentQuestion.skipped ? (
            <div className="question-box">
              <NavQuiz rD={this.props.rD} indexOfQ={this.props.indexOfQ} />
            </div>
          ) : (
            " "
          )}
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    currentQuestion: state.currentQuestion,
    liveStudentHistory: state.liveStudentHistory,
    liveStudentUnRead: state.liveStudentUnRead
  };
};
export default connect(mapStateToProps)(AskQ);
