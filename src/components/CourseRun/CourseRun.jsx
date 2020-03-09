import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class CourseRun extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    console.log("courseCode");
    console.log(this.props.courseCode);
    console.log("subscribedCourses");
    console.log(this.props.subscribedCourses);

    const liveCourse = this.props.subscribedCourses[this.props.courseCode]; // select the relevant object
    const liveStudentHistory = this.props.studentHistory[this.props.courseCode]; // work with relevant object
    this.props.dispatch({
      type: "LOAD-LIVE-COURSE",
      payload: {
        liveCourseQuestions: liveCourse.questionVec,
        liveStudentHistory: liveStudentHistory
      }
    });
    console.log("liveCourseQuestions");
    console.log(liveCourse.questionVec);
  };

  componentDidUpdate = () => {
    console.log("CourseRun");
  };

  render = () => {
    console.log("courseRun" + this.props.courseCode);

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

        <Link
          to={
            "/question/" +
            this.props.courseCode +
            "/" +
            this.props.liveCourseQuestions[0].qNum // change this ref!
          }
        >
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
    subscribedCourses: state.subscribedCourses,
    liveCourseQuestions: state.liveCourseQuestions,
    studentHistory: state.studentHistory
  };
};

export default connect(mapStateToProps)(CourseRun);
