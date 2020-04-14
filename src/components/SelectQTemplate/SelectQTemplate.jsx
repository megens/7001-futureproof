import React, { Component } from "react";
import { connect } from "react-redux";
import Template001 from "./Template001.jsx";
import Template002 from "./Template002.jsx";
import Template003 from "./Template003.jsx";

class SelectQTemplate extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log("MOUNT SelectQTemplate");
  };

  componentDidUpdate = () => {
    console.log("UPDATE SelectQTemplate");
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

        return (
          <Template001 rD={this.props.rD} indexOfQ={this.props.indexOfQ} />
        );
      }

      case "Template002": {
        console.log("template002");
        return (
          <Template002 rD={this.props.rD} indexOfQ={this.props.indexOfQ} />
        );
      }

      case "Template003": {
        console.log("template003");
        return (
          <Template003 rD={this.props.rD} indexOfQ={this.props.indexOfQ} />
        );
      }

      default:
        return "Template not recognized";
    }
  };
}

const mapStateToProps = (state) => {
  return {
    currentQuestion: state.currentQuestion,
  };
};
export default connect(mapStateToProps)(SelectQTemplate);
