import React, { Component } from "react";
import { connect } from "react-redux";
import TestQ from "../AskQuestion/TestQ.jsx";
import Template001 from "./Template001.jsx";
import Template002 from "./Template002.jsx";

class SelectQTemplate extends Component {
  constructor() {
    super();
  }

  componentDidUpdate = () => {
    console.log("MOUNT SelectQTemplate");
  };

  render = () => {
    const templateType = this.props.currentQuestion.template;
    console.log("SelectQTemplate this.props.currentQuestion");
    console.log(this.props.currentQuestion);
    console.log("templateType");
    console.log(templateType);

    switch (templateType) {
      case "Template001": {
        console.log("template001");

        return <Template001 rD={this.props.rD} />;
      }

      case "Template002": {
        console.log("template002");
        return <Template002 rD={this.props.rD} />;
      }

      default:
        return "Template not recognized";
    }
  };
}

const mapStateToProps = state => {
  return {
    currentQuestion: state.currentQuestion
  };
};
export default connect(mapStateToProps)(SelectQTemplate);
