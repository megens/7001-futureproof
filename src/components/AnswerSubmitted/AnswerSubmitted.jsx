import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class AnswerSubmitted extends Component {
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

    return (
      <div>
        <div>Question: {this.props.qNumber}</div>
        <div>Response: {this.props.isCorrect ? "Correct" : "Incorrect"}</div>
        <br />

        <Link to={"/question/" + this.props.qNumber}>
          <button className="icon-btn short">
            End <i className="fas fa-fast-backward"></i>
          </button>
        </Link>

        <Link to={"/question/" + this.props.qNumber}>
          <button className="icon-btn short">
            -10 <i className="fas fa-backward"></i>
          </button>
        </Link>

        <Link to={"/question/" + this.props.qNumber}>
          <button className="icon-btn short">
            -1 <i className="fas fa-step-backward"></i>
          </button>
        </Link>

        <Link to={"/question/" + this.props.qNumber}>
          <button className="icon-btn short">
            <i className="fas fa-step-forward"></i> +1
          </button>
        </Link>

        <Link to={"/question/" + this.props.qNumber}>
          <button className="icon-btn short">
            <i className="fas fa-forward"></i> +10
          </button>
        </Link>

        <Link to={"/question/" + this.props.nextQuestion}>
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
    nextQuestion: state.nextQuestion
  };
};

export default connect(mapStateToProps)(AnswerSubmitted);
