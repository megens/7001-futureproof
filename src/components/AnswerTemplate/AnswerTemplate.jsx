import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

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

  render = () => {
    console.log("answer submitted");
    console.log("isCorrect: " + this.props.isCorrect);
    let courseCode = this.props.currentQuestion.courseCode;
    let qNum = this.props.currentQuestion.qNum;

    return (
      <div>
        <div>Question: {this.props.currentQuestion.qNum}</div>
        <div>
          Response:{" "}
          {this.props.currentQuestion.response_submitted ===
          this.props.currentQuestion.response_correct
            ? "Correct"
            : "Incorrect"}
        </div>
        <br />

        <Link to={"/question/" + this.props.currentQuestion.qNum}>
          <button className="icon-btn short">
            <i className="fas fa-fast-backward"></i> End
          </button>
        </Link>

        <Link to={"/question/" + this.props.currentQuestion.qNum}>
          <button className="icon-btn short">
            <i className="fas fa-backward"></i> -10
          </button>
        </Link>

        <Link to={"/question/" + this.props.currentQuestion.qNum}>
          <button className="icon-btn short">
            <i className="fas fa-step-backward"></i> -1
          </button>
        </Link>

        <Link to={"/question/" + this.props.currentQuestion.qNum}>
          <button className="icon-btn short">
            <i className="fas fa-step-forward"></i> +1
          </button>
        </Link>

        <Link to={"/question/" + this.props.currentQuestion.qNum}>
          <button className="icon-btn short">
            <i className="fas fa-forward"></i> +10
          </button>
        </Link>

        <Link to={"/question/" + "101/101-0002"}>
          <button className="icon-btn short">
            <i className="fas fa-fast-forward"></i> End
          </button>
        </Link>

        <br />
        <br />
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

/*
qNumber={qNumber}
isCorrect={isCorrect}
rD={routerData}
*/

const mapStateToProps = state => {
  return {
    subscriptions: state.subscriptions,
    studentHistory: state.studentHistory,
    currentQuestion: state.currentQuestion
  };
};

export default connect(mapStateToProps)(AnswerTemplate);
