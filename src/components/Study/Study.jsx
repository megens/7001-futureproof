import React, { Component } from "react";
import CourseMenu from "../CourseMenu/CourseMenu.jsx";
import { connect } from "react-redux";

//const d3 = require("d3");
// d3 being brought in by script in index.html
const deepCopy = require("rfdc")(); // a really fast deep copy function

class Study extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log("MOUNT Study");
  };

  componentDidUpdate = () => {
    console.log("UPDATE Study");
  };

  render = () => {
    console.log("render Study");

    return (
      <div className="course-container">
        <CourseMenu />
        Put in a Study Module of ref materials here.
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    studentHistory: state.studentHistory,
    liveStudentHistory: state.liveStudentHistory,
  };
};

export default connect(mapStateToProps)(Study);
