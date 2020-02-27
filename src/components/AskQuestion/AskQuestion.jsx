import React, { Component } from "react";
import { connect } from "react-redux";
import QTimer from "../QTimer/QTimer.jsx";
import { Link } from "react-router-dom";

class AskQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: ""
    };
  }

  question = "How many ways are there to skin a cat?";
  response_a = "one";
  response_b = "more than one";
  response_c = "i don't know";
  response_correct = "b";

  handleOptionChange = changeEvent => {
    console.log(changeEvent.target.value);
    this.setState({
      selectedOption: changeEvent.target.value
    });
  };

  submitHandler = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    const isCorrect = this.state.selectedOption === this.response_correct;
    console.log("You have submitted:", this.state.selectedOption);
    console.log("correct? " + isCorrect);
    this.props.dispatch({
      type: "UPDATE-STUDENT-HISTORY",
      payload: {
        studentHistory: this.props.studentHistory,
        newHistoryItem: {
          questionCode: this.props.qNumber,
          responseCorrect: isCorrect,
          elapsedTime: this.props.elapsedTime,
          dateStamp: new Date().toLocaleString()
        }
      }
    });
    this.props.rD.history.push(
      "/answer-submitted/" + this.props.qNumber + "/" + isCorrect
    );
  };

  render = () => {
    return (
      <div className="question template">
        <form onSubmit={this.submitHandler}>
          <b>{this.question}</b>
          <br />
          <input
            type="radio"
            id="a"
            name="question"
            className="form-check-input"
            checked={this.state.selectedOption === "a"}
            onChange={this.handleOptionChange}
            value="a"
          />
          <label> {this.response_a}</label>
          <br />
          <input
            type="radio"
            id="b"
            name="question"
            className="form-check-input"
            checked={this.state.selectedOption === "b"}
            onChange={this.handleOptionChange}
            value="b"
          />
          <label> {this.response_b}</label>
          <br />
          <input
            type="radio"
            id="c"
            name="question"
            className="form-check-input"
            checked={this.state.selectedOption === "c"}
            onChange={this.handleOptionChange}
            value="c"
          />
          <label> {this.response_c}</label>
          <br />
          <input type="submit" />
        </form>
        <br />
        <QTimer />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    courseHistory: state.courseHistory,
    studentHistory: state.studentHistory,
    elapsedTime: state.elapsedTime
  };
};

export default connect(mapStateToProps)(AskQuestion);
