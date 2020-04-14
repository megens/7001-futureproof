import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class AnswerTemplate extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    console.log("answer submitted");
    console.log("isCorrect: " + this.props.isCorrect);

    return (
      <div>
        {!this.props.currentQuestion.skipped ? (
          <div>
            <div className="red">
              <b>
                Response:{" "}
                {this.props.currentQuestion.response_submitted ===
                this.props.currentQuestion.response_correct ? (
                  <div>
                    <i className="fas fa-thumbs-up"></i> Correct
                  </div>
                ) : (
                  <div>
                    <i className="fas fa-thumbs-down"></i> Incorrect
                  </div>
                )}
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

const mapStateToProps = (state) => {
  return {
    currentQuestion: state.currentQuestion,
  };
};

export default connect(mapStateToProps)(AnswerTemplate);
