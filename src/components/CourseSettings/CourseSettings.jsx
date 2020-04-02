import React, { Component } from "react";
import CourseRun from "../CourseRun/CourseRun.jsx";
import { connect } from "react-redux";
const deepCopy = require("rfdc")(); // a really fast deep copy function

class CourseSettings extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log("MOUNT CourseSettings");
  };

  componentWillUnmount = () => {
    console.log("UNMOUNT CourseSettings");
    let subscriptionSettingsCopy = deepCopy(this.props.subscriptionSettings);
    subscriptionSettingsCopy[this.props.liveCourseCode] = deepCopy(
      this.props.liveQuizFilterObj
    );
    console.log(subscriptionSettingsCopy);
    this.props.dispatch({
      type: "UPDATE-SUBSCRIPTIONSETTINGS",
      payload: { subscriptionSettings: subscriptionSettingsCopy }
    });
    console.log("ok");
  };

  capitalize = word => {
    return word[0].toUpperCase() + word.substr(1);
  };

  handleChange = evt => {
    this.props.dispatch({
      type: "UPDATE-LIVE-QUIZ-FILTER",
      payload: { criterion: evt.target.name, checked: evt.target.checked }
    });
  };
  render = () => {
    console.log("render CourseSettings");
    console.log("liveQuizFilterObj");
    console.log(this.props.liveQuizFilterObj);
    let allCriteria = Object.keys(this.props.liveQuizFilterObj);
    let criteriaTypes = this.props.criteriaTypes.slice();
    console.log("criteria " + allCriteria);

    return (
      <div className="course-container">
        <CourseRun />
        <div className="wide">
          <br />
          <div className="question-box">
            {criteriaTypes.map(cType => {
              return (
                <div key={cType}>
                  <b>{this.capitalize(cType)}</b>
                  {allCriteria.map(criterion => {
                    return criterion.includes(cType) ? (
                      <div key={criterion}>
                        <input
                          type="checkbox"
                          name={criterion}
                          onChange={this.handleChange}
                          checked={this.props.liveQuizFilterObj[criterion]}
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
    );
  };
}

const mapStateToProps = state => {
  return {
    username: state.username,
    subscriptions: state.subscriptions,
    subscriptionSettings: state.subscriptionSettings,
    liveCourseCode: state.liveCourseCode,
    liveCourseChapters: state.liveCourseChapters,
    liveQuizFilterObj: state.liveQuizFilterObj,
    criteriaTypes: state.criteriaTypes
  };
};

export default connect(mapStateToProps)(CourseSettings);
