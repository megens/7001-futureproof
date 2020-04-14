import React, { Component } from "react";
import CourseMenu from "../CourseMenu/CourseMenu.jsx";
import { connect } from "react-redux";
import {
  refreshCriteriaSet,
  refreshCourseSettings,
  refreshUnRead,
} from "../Utilities/utilities.js";

const deepCopy = require("rfdc")(); // a really fast deep copy function

class CourseSettings extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log("MOUNT CourseSettings");
  };

  componentWillUnmount = () => {
    //TO DO ... write this to server on UnMount
    console.log("UNMOUNT CourseSettings");
    let subscriptionSettingsCopy = deepCopy(this.props.subscriptionSettings);
    subscriptionSettingsCopy[this.props.liveCourse.courseCode] = deepCopy(
      this.props.liveCourseSettings
    );
    console.log(subscriptionSettingsCopy);
    this.props.dispatch({
      type: "UPDATE-SUBSCRIPTIONSETTINGS",
      payload: { subscriptionSettings: subscriptionSettingsCopy },
    });
    console.log("ok");
  };

  capitalize = (word) => {
    return word[0].toUpperCase() + word.substr(1);
  };

  handleChange = (evt) => {
    const liveCourse = this.props.liveCourse;
    let liveCourseSettingsCopy = deepCopy(this.props.liveCourseSettings);
    liveCourseSettingsCopy[evt.target.name] = evt.target.checked;

    const unReadARRAY = refreshUnRead(
      this.props.liveCourse,
      this.props.criteriaTypes,
      liveCourseSettingsCopy,
      this.props.liveStudentHistory
    );
    let liveStudentUnRead = unReadARRAY[0];
    let filteredUnReadQs = unReadARRAY[1];

    // update this for change
    let newQNum;
    let currentQuestion;
    if (filteredUnReadQs.length > 0) {
      newQNum =
        this.props.liveCourse.courseCode + "/" + filteredUnReadQs[0].qNum;
      currentQuestion = filteredUnReadQs[0];
    } else {
      newQNum = this.props.liveStudentHistory[
        this.props.liveStudentHistory.length - 1
      ].qNum;
      currentQuestion = this.props.liveStudentHistory[
        this.props.liveStudentHistory.length - 1
      ];
    }
    // TO DO CHECK THIS IS WORKING!!!!
    this.props.dispatch({
      type: "UPDATE-LIVE-COURSE-SETTINGS",
      payload: {
        liveCourseSettings: liveCourseSettingsCopy,
      },
    });
    this.props.dispatch({
      type: "UPDATE-UNREADQS",
      payload: {
        filteredUnReadQs: filteredUnReadQs,
        liveStudentUnRead: liveStudentUnRead,
      },
    });
    this.props.dispatch({
      type: "UPDATE-NEWQNUM",
      payload: { newQNum: newQNum },
    });
    this.props.dispatch({
      type: "SET-CURRENT-QUESTION",
      payload: { currentQuestion: currentQuestion, elapsedTime: 0 },
    });
  };

  render = () => {
    console.log("render CourseSettings");
    console.log(
      this.props.subscriptionSettings[this.props.liveCourse.courseCode]
    );

    return (
      <div className="course-container">
        <CourseMenu />

        <div className="wide">
          <br />
          <div className="question-box">
            <b>Specify what to include on your quiz settings.</b>
            <br />
            <br />
            <div className="indent">
              {this.props.criteriaTypes.map((cType) => {
                return (
                  <div key={cType}>
                    <b>{this.capitalize(cType)}</b>
                    {this.props.criteriaSet.map((criterion) => {
                      return criterion.includes(cType) ? (
                        <div key={criterion}>
                          <input
                            type="checkbox"
                            name={criterion}
                            onChange={this.handleChange}
                            checked={this.props.liveCourseSettings[criterion]}
                          />
                          {this.capitalize(criterion.replace(cType + "_", ""))}
                        </div>
                      ) : (
                        ""
                      );
                    })}
                    <br />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    liveCourse: state.liveCourse,
    liveCourseSettings: state.liveCourseSettings,
    subscriptionSettings: state.subscriptionSettings,
    liveStudentHistory: state.liveStudentHistory,
    criteriaTypes: state.criteriaTypes,
    criteriaSet: state.criteriaSet,
  };
};

export default connect(mapStateToProps)(CourseSettings);
