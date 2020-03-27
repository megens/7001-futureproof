import React, { Component } from "react";
import CourseRun from "../CourseRun/CourseRun.jsx";
import { connect } from "react-redux";
const deepCopy = require("rfdc")(); // a really fast deep copy function

class CourseSettings extends Component {
  constructor() {
    super();
  }

  render = () => {
    return (
      <div className="course-container">
        <CourseRun />
        <div className="wide">Choose your poison</div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    username: state.username,
    subscriptions: state.subscriptions,
    subscriptionSettings: state.subscriptionSettings
  };
};

export default connect(mapStateToProps)(CourseSettings);
