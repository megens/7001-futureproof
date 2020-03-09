import React, { Component } from "react";
import { connect } from "react-redux";
import SelectQTemplate from "../SelectQTemplate/SelectQTemplate.jsx";
import AnswerTemplate from "../AnswerTemplate/AnswerTemplate.jsx";
import QTimer from "../QTimer/QTimer.jsx";
import TestQ from "../AskQuestion/TestQ.jsx";

class AskQ extends Component {
  constructor() {
    super();
  }

  componentDidUpdate = () => {
    console.log("MOUNT AskQ.jsx");
  };

  render = () => {
    console.log(this.props.currentQuestion);
    return (
      <div>
        <b>{this.props.currentQuestion.qNum}</b>
        <br />
        <br />
        <SelectQTemplate
          template={this.props.currentQuestion.template}
          rD={this.props.rD}
        />
        <QTimer />
        {this.props.currentQuestion.complete ? <AnswerTemplate /> : ""}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    currentQuestion: state.currentQuestion
  };
};
export default connect(mapStateToProps)(AskQ);
