import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class AnswerSubmitted extends Component {
  constructor(props) {
    super(props);
  }

  flagQuestion = () => {
    console.log("question flagged");
  };

  render = () => {
    console.log("answer submitted");
    console.log("isCorrect: " + this.props.isCorrect);

    return (
      <div>
        <div>Question: {this.props.qNumber}</div>
        <div>Response: {this.props.isCorrect ? "Correct" : "Incorrect"}</div>
        <br />
        <Link to={"/question/" + this.props.nextQuestion}>
          <button>Ask next question</button>
        </Link>
        <form onSubmit={this.flagQuestion}>
          <b>Concerns about question / answer</b>
          <br />
          Comments:<input type="text"></input>
          <br />
          <button>Flag Question</button>
        </form>
      </div>
    );
  };
}

/*
qNumber={qNumber}
isCorrect={isCorrect}
rD={routerData}
*/

const mapStateToProps = state => {
  return {
    courseHistory: state.courseHistory,
    studentHistory: state.studentHistory,
    nextQuestion: state.nextQuestion
  };
};

export default connect(mapStateToProps)(AnswerSubmitted);
