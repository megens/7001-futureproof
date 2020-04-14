import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class CourseMenu extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    console.log("MOUNT CourseMenu");
  };

  componentDidUpdate = () => {
    console.log("UPDATE CourseMenu");
  };

  render = () => {
    // TO DO: if currentQuestion doesn't pass courseSettings filter, reset currentQuestion and nextQ
    console.log("render CourseMenu");
    let courseCode = this.props.liveCourse.courseCode;
    let nextQ;
    if (this.props.currentQuestion) {
      // if current question was not completed, the nextQ remains the current one
      console.log("nextQ remains the currentQuestion");
      nextQ =
        this.props.liveCourse.courseCode +
        "/" +
        this.props.currentQuestion.qNum;
    } else {
      console.log("new nextQ");
      nextQ = this.props.newQNum;
    }
    return (
      <div>
        <br />
        <Link to={"/myProfile/" + this.props.username}>
          <button className="icon-btn long">
            <i className="fas fa-home"></i>
            <span> Home</span>
          </button>
        </Link>
        <br />

        <Link to={"/CourseMenu/" + courseCode}>
          <button className="icon-btn long" id="switch-color">
            <i className="fas fa-compass"></i>
            <span> C# {courseCode}</span>
          </button>
          <br />
        </Link>

        <Link to={"/settings/" + this.props.username}>
          <button className="icon-btn long">
            <i className="fas fa-cogs"></i>
            <span> Settings</span>
          </button>
        </Link>
        <br />
        {/*
         */}
        <Link to={"/study/"}>
          <button className="icon-btn long">
            <i className="fas fa-chalkboard-teacher"></i>
            <span> Study</span>
          </button>
        </Link>
        <br />

        <Link to={"/question/" + nextQ}>
          <button className="icon-btn long">
            <i className="fas fa-question"></i>
            <span> Quiz Me</span>
          </button>
        </Link>

        <br />

        <Link to={"/dashboard/"}>
          <button className="icon-btn long">
            <i className="fas fa-chart-line"></i> <span> Results</span>
          </button>
        </Link>

        <br />
        <Link to={"/admin"}>
          <button className="icon-btn long">
            <i className="fas fa-archive"></i> <span> Admin</span>
          </button>
        </Link>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    username: state.username,
    liveCourse: state.liveCourse,
    liveCourseSettings: state.liveCourseSettings,
    liveStudentUnRead: state.liveStudentUnRead,
    liveStudentHistory: state.liveStudentHistory,
    currentQuestion: state.currentQuestion,
    newQNum: state.newQNum,
  };
};

export default connect(mapStateToProps)(CourseMenu);
