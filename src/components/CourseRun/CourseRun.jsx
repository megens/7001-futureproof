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

  newQuestion = () => {
    console.log("new Question");
    let liveStudentUnReadCopy = this.props.liveStudentUnRead.slice();
    let newQ;
    let newQNum;
    if (this.props.liveStudentUnRead.length === 0) {
      console.log("UnRead is empty ... take new Q from history");
      newQ = this.props.liveStudentHistory[
        this.props.liveStudentHistory.length - 1
      ];
      newQNum = "" + newQ.courseCode + "/" + newQ.qNum;
    } else {
      console.log("taking new Q from UnRead");
      newQ = this.props.liveStudentUnRead[0];
      newQNum = "" + newQ.courseCode + "/" + newQ.qNum;
      console.log(newQNum);
      // in case we change the index from 0 to something more general ...
      let idx = liveStudentUnReadCopy.findIndex(question => {
        return question.qNum === newQ.qNum;
      });
      liveStudentUnReadCopy.splice(idx, 1);
      this.props.dispatch({
        type: "UPDATE-UNREAD-Q",
        payload: { liveStudentUnRead: liveStudentUnReadCopy }
      });
    }
    this.props.rD.history.push("/question/" + newQNum);
  };

  render = () => {
    console.log("render CourseRun");

    console.log("liveCourseQuestions");
    console.log(this.props.liveCourseQuestions);
    console.log(this.props.liveCourseQuestions[0]);
    console.log(this.props.liveCourseQuestions[1]);

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

        <button className="icon-btn long" id="switch-color">
          <i className="fas fa-compass"></i>
          <span> {this.props.liveCourseQuestions[0].courseCode}</span>
        </button>
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

        <button className="icon-btn long" onClick={this.newQuestion}>
          <i className="fas fa-question"></i>
          <span> Quiz Me</span>
        </button>

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
    liveStudentHistory: state.liveStudentHistory
  };
};

export default connect(mapStateToProps)(CourseRun);
