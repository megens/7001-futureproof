import React, { Component } from "react";
import { connect } from "react-redux";
import SelectQTemplate from "../SelectQTemplate/SelectQTemplate.jsx";
import AnswerTemplate from "../AnswerTemplate/AnswerTemplate.jsx";
import QTimer from "../QTimer/QTimer.jsx";

class TestQ extends Component {
  constructor(props) {
    super(props);
    this.state = { completed: false };
  }

  render = () => {
    console.log("TestQ.jsx");
    console.log(this.props.currentQuestion);
    return <>Hi there</>;
  };
}

export default TestQ;
