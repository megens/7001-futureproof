import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class CourseRun extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    console.log("MOUNT courseRun");
  };

  componentDidUpdate = () => {
    console.log("UPDATE CourseRun");
  };

  render = () => {
    console.log("render CourseRun");

    console.log("liveCourseQuestions");

    let courseCode = this.props.liveCourseQuestions[0].courseCode;
    let nextQ;
    if (
      this.props.currentQuestion.complete === false &&
      this.props.currentQuestion.skipped === false
    ) {
      nextQ =
        this.props.currentQuestion.courseCode +
        "/" +
        this.props.currentQuestion.qNum;
    } else {
      nextQ = this.props.newQNum;
    }
    return (
      <div>
        {/*
        {chapterList.map(chapter => {
          return <div>chapter : {<input type="checkbox" />}</div>;
        })}
        */}
        <br />
        <Link to={"/myProfile/" + this.props.username}>
          <button className="icon-btn long">
            <i className="fas fa-home"></i>
            <span> Home</span>
          </button>
        </Link>
        <br />

        <Link to={"/courseRun/" + courseCode}>
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
        <Link to={"/archive/" + this.props.courseCode}>
          <button className="icon-btn long">
            <i className="fas fa-archive"></i> <span> Archive</span>
          </button>
        </Link>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    username: state.username,
    liveCourseQuestions: state.liveCourseQuestions,
    liveStudentUnRead: state.liveStudentUnRead,
    liveStudentHistory: state.liveStudentHistory,
    currentQuestion: state.currentQuestion,
    newQNum: state.newQNum
  };
};

export default connect(mapStateToProps)(CourseRun);
