import React, { Component } from "react";
import { connect } from "react-redux";
import CourseMenu from "../CourseMenu/CourseMenu.jsx";
import SelectQTemplate from "../SelectQTemplate/SelectQTemplate.jsx";
import AnswerTemplate from "../AnswerTemplate/AnswerTemplate.jsx";
import QTimer from "../QTimer/QTimer.jsx";
import NavQuiz from "../NavQuiz/NavQuiz.jsx";
import { Link } from "react-router-dom";

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

  render = () => {
    console.log("render AskQ");
    console.log(this.props.currentQuestion);

    return (
      <div className="course-container">
        <CourseMenu />
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
            this.props.filteredUnReadQs.length !== 0 &&
            (this.props.currentQuestion.complete ||
              this.props.currentQuestion.skipped) ? (
              <Link to={"/question/" + this.props.newQNum}>
                <button className="icon-btn long">
                  <i className="fas fa-arrow-alt-circle-right"></i> New
                </button>
              </Link>
            ) : (
              ""
            )}
            {this.props.indexOfQ === this.props.liveStudentHistory.length - 1 &&
            this.props.filteredUnReadQs.length === 0 &&
            (this.props.currentQuestion.complete ||
              this.props.currentQuestion.skipped)
              ? "You have answered all questions for this course."
              : ""}
            <br />

            {this.props.indexOfQ === this.props.liveStudentHistory.length - 1 &&
            this.props.filteredUnReadQs.length === 0 &&
            this.props.liveStudentUnRead.length > 0 &&
            (this.props.currentQuestion.complete ||
              this.props.currentQuestion.skipped)
              ? "Additional Questions are available if you change settings."
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

const mapStateToProps = (state) => {
  return {
    currentQuestion: state.currentQuestion,
    liveStudentHistory: state.liveStudentHistory,
    liveStudentUnRead: state.liveStudentUnRead,
    filteredUnReadQs: state.filteredUnReadQs,
    newQNum: state.newQNum,
  };
};
export default connect(mapStateToProps)(AskQ);
