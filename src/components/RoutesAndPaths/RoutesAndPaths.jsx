import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import CourseShelf from "../CourseShelf/CourseShelf.jsx";
import CourseDetail from "../CourseDetail/CourseDetail.jsx";
import CourseRun from "../CourseRun/CourseRun.jsx";
import CourseSettings from "../CourseSettings/CourseSettings.jsx";
import AskQ from "../AskQuestion/AskQ.jsx";
import TestQ from "../AskQuestion/TestQ.jsx";
import AnswerSubmitted from "../AnswerSubmitted/AnswerSubmitted.jsx";
import Advertising from "../Advertising/Advertising.jsx";
import Checkout from "../Checkout/Checkout.jsx";
import SideBanner from "../SideBanner/SideBanner.jsx";
import Login from "../Login/Login.jsx";
import Signup from "../Signup/Signup.jsx";
import Logout from "../Logout/Logout.jsx";
import MyProfile from "../MyProfile/MyProfile.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";

let isEqual = require("lodash.isequal");
const deepCopy = require("rfdc")(); // a really fast deep copy function

class Routes extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log("MOUNT Routes and Paths");
  };

  /*
  componentDidUpdate = () => {
    console.log("UPDATE Routes and Paths");
  };
  */

  arraysMatch = (arr1, arr2) => {
    // Check if the arrays are the same length
    if (!arr1.length === arr2.length) return false;
    // Check if all items exist and are in the same order // SHOULD USE LODASH ISEQUAL?
    for (var i = 0; i < arr1.length; i++) {
      if (!isEqual(arr1[i], arr2[i])) return false;
    }
    // Otherwise, return true
    return true;
  };

  renderLoginSignup = routerData => {
    console.log("route LoginSignup");
    if (this.props.username === undefined) {
      return (
        <>
          <Login rD={routerData} />
          <Signup rD={routerData} />
        </>
      );
    }
    return (
      <>
        <Logout />
      </>
    );
  };

  renderLogout = routerData => {
    console.log("route Logout");
    return <Logout rD={routerData} />;
  };

  renderHomePage = () => {
    if (this.props.loggedIn) {
      return <SideBanner />;
    } else {
      return <Advertising />;
    }
  };

  renderAdvertising = () => {
    return <Advertising />;
  };

  renderCart = () => {
    console.log("route cart");
    return <Cart />;
  };

  renderCheckout = routerData => {
    console.log("route checkout");
    return <Checkout rD={routerData} />;
  };

  renderCourseShelf = routerData => {
    console.log("route shop");
    return <CourseShelf rD={routerData} />;
  };

  renderCourseDetail = routerData => {
    let courseCode = routerData.match.params.courseCode;
    console.log("route CourseDetail with " + courseCode);
    return <CourseDetail courseCode={courseCode} rD={routerData} />;
  };

  renderMyProfile = routerData => {
    console.log("route MyProfile");
    let userId = routerData.match.params.username;
    return <MyProfile rD={routerData} />;
  };

  renderCourseRun = routerData => {
    let proceed = false;
    let setup = () => {
      let courseCode = routerData.match.params.courseCode;
      console.log("route courseRun " + courseCode);
      const liveCourse = this.props.subscribedCourses[courseCode]; // select the relevant object
      console.log(liveCourse);
      const liveStudentHistory = this.props.studentHistory[courseCode]; // work with relevant object
      console.log(liveStudentHistory);
      const liveAllResponses = this.props.subscribedAllResponses[courseCode];
      console.log(liveAllResponses);
      let subscriptionSettingsCopy = deepCopy(this.props.subscriptionSettings);
      let liveUnReadQs = liveCourse.questionVec.slice();
      for (let i = 0; i <= liveStudentHistory.length - 1; i++) {
        console.log("unread ", liveUnReadQs);
        let indexOfQ = liveUnReadQs.findIndex(question => {
          return question.qNum === liveStudentHistory[i].qNum;
        });
        liveUnReadQs.splice(indexOfQ, 1);
      }
      // define filter possibilities for new CourseLoad

      let criteriaTypes = this.props.criteriaTypes;
      let criteriaSet = [];
      criteriaTypes.forEach(cType => {
        liveCourse.questionVec.forEach(question => {
          criteriaSet.push(cType + "_" + question[cType]);
        });
      });
      // remove the many duplicates
      criteriaSet = [...new Set(criteriaSet)];
      //sort
      criteriaSet = Array.from(criteriaSet).sort((a, b) => {
        return a.localeCompare(b, "en", { sensitivity: "base" });
      });
      console.log("criteriaSet " + criteriaSet);
      let courseSettingsObj = {};
      // populate from prev saved settings, if avail.
      // this is reloaded in case the Admin has added any further criteria or categories
      criteriaSet.forEach(criterion => {
        console.log("criterion " + criterion);
        if (
          true === this.props.subscriptionSettings[courseCode][criterion] ||
          false === this.props.subscriptionSettings[courseCode][criterion]
        ) {
          //criterion is true
          console.log("criterion is either true or false (i.e. not undefined)");
          courseSettingsObj[criterion] = this.props.subscriptionSettings[
            courseCode
          ][criterion];
        } else {
          console.log("neither true nor false");
          courseSettingsObj[criterion] = true;
        }
      });
      console.log("courseSettingsObj");
      console.log(courseSettingsObj);
      subscriptionSettingsCopy[courseCode] = courseSettingsObj;
      ////////////////////////
      let newQ = liveUnReadQs[0]; // a default POTENTIAL next Q if requested
      if (!newQ) {
        newQ = liveStudentHistory[liveStudentHistory.length - 1];
      }
      const newQNum = "" + newQ.courseCode + "/" + newQ.qNum;
      console.log("courseSettingsObj and this.props.subscriptionSettings");
      console.log(courseSettingsObj);
      console.log(subscriptionSettingsCopy[courseCode]);

      // FILL IN ALL CRITERIA TO NOT MATCH
      if (!isEqual(courseSettingsObj, this.props.liveQuizFilterObj)) {
        console.log("dispatch LOAD-LIVE-COURSE");
        this.props.dispatch({
          type: "LOAD-LIVE-COURSE",
          payload: {
            liveCourseCode: courseCode,
            liveCourseQuestions: liveCourse.questionVec,
            liveCourseChapters: liveCourse.chapters,
            liveQuizFilterObj: courseSettingsObj,
            liveStudentHistory: liveStudentHistory,
            liveAllResponses: liveAllResponses.allResponses,
            subscriptionSettings: subscriptionSettingsCopy,
            newQNum: newQNum
          }
        });
      }

      if (!this.arraysMatch(liveUnReadQs, this.props.liveStudentUnRead)) {
        console.log("dispatch UPDATE-UNREAD-Q");
        this.props.dispatch({
          type: "UPDATE-UNREAD-Q",
          payload: {
            liveStudentUnRead: liveUnReadQs
          }
        });
      }
    };
    setup();
    if (true) return <CourseRun rD={routerData} />;
  };

  renderSettings = routerData => {
    return <CourseSettings rD={routerData} />;
  };

  renderQuestion = routerData => {
    let courseCode = routerData.match.params.courseCode;
    let qNumber = routerData.match.params.qNum;
    let proceed = false;
    let currentQuestion = null;
    let indexOfQ;
    //is the question in studentHistory?
    console.log("try loading from studenthistory?");
    let liveStudentHistoryCopy = this.props.liveStudentHistory.slice();
    let liveStudentUnReadCopy = this.props.liveStudentUnRead.slice();

    indexOfQ = liveStudentHistoryCopy.findIndex(question => {
      return question.qNum === qNumber;
    });
    if (indexOfQ > -1) {
      // question is in studentHistory
    } else {
      let pushQuestion = this.props.liveCourseQuestions.find(question => {
        return question.qNum.toString() === qNumber;
      });
      liveStudentHistoryCopy.push(pushQuestion);
    }
    indexOfQ = liveStudentHistoryCopy.findIndex(question => {
      return question.qNum === qNumber;
    });
    currentQuestion = liveStudentHistoryCopy[indexOfQ];
    console.log(currentQuestion);

    console.log("liveStudentUnReadCopy");
    console.log(liveStudentUnReadCopy);
    console.log(liveStudentUnReadCopy[0]);
    // remove the rendered Question from unRead
    let idx = liveStudentUnReadCopy.findIndex(question => {
      console.log(question.qNum);
      console.log(currentQuestion.qNum);
      return question.qNum === currentQuestion.qNum;
    });
    console.log("idx is " + idx);
    if (idx > -1) {
      console.log("removing currentQuestion from UnRead");
      liveStudentUnReadCopy.splice(idx, 1);
    } else {
      console.log("not removing currentQuestion from UnRead");
    }
    console.log("and now");
    console.log(liveStudentUnReadCopy);
    // set the nextNewQ
    let nextNewQ;
    if (!(liveStudentUnReadCopy.length === 0)) {
      console.log("nextNewQ coming from UnRead");
      nextNewQ = liveStudentUnReadCopy[0];
    } // in the absence of a more refined algorithm}
    else {
      console.log(
        "nextNewQ coming last of history ... out of UnRead which has length " +
          liveStudentUnReadCopy.length
      );
      nextNewQ = liveStudentHistoryCopy[liveStudentHistoryCopy.length - 1];
    }
    const nextNewQNum = "" + nextNewQ.courseCode + "/" + nextNewQ.qNum;
    console.log("nextNewQNum is " + nextNewQNum);

    const dispatchCurrentQuestion = !isEqual(
      // lodash equality fn
      currentQuestion,
      this.props.currentQuestion
    );
    const dispatchLiveStudentHistory = !this.arraysMatch(
      liveStudentHistoryCopy,
      this.props.liveStudentHistory
    );
    const dispatchLiveStudentUnRead = !this.arraysMatch(
      liveStudentUnReadCopy,
      this.props.liveStudentUnRead
    );
    const dispatchNewQNum = !(nextNewQNum === this.props.newQNum);

    console.log(
      "dispatch? " +
        dispatchCurrentQuestion +
        " " +
        dispatchLiveStudentHistory +
        " " +
        dispatchLiveStudentUnRead +
        " " +
        dispatchNewQNum
    );
    if (
      dispatchCurrentQuestion ||
      dispatchLiveStudentHistory ||
      dispatchLiveStudentUnRead ||
      dispatchNewQNum
    ) {
      console.log("going to SET-CURRENT-QUESTION-AND-LIVESTUDENTHISTORY");
      this.props.dispatch({
        type: "SET-CURRENT-QUESTION-AND-LIVESTUDENTHISTORY",
        payload: {
          currentQuestion: currentQuestion,
          liveStudentHistory: liveStudentHistoryCopy,
          liveStudentUnRead: liveStudentUnReadCopy,
          newQNum: nextNewQNum
        }
      });
    } else {
      proceed = true;
    }
    if (proceed) return <AskQ rD={routerData} indexOfQ={indexOfQ} />;

    // to add here, when rendering a question tee up the next newQNum (if available), and affect the unReadQs
  };

  renderDashboard = routerData => {
    return <Dashboard rD={routerData} />;
  };

  render = () => {
    return (
      <>
        <Route exact={true} path="/" render={this.renderHomePage} />
        <Route exact={true} path="/login/" render={this.renderLoginSignup} />
        <Route exact={true} path="/logout/" render={this.renderLogout} />
        <Route exact={true} path="/shop/" render={this.renderCourseShelf} />
        <Route exact={true} path="/checkout" render={this.renderCheckout} />
        <Route exact={true} path="/cart/" render={this.renderCart} />
        <Route
          exact={true}
          path="/myProfile/:username"
          render={this.renderMyProfile}
        />
        <Route
          exact={true}
          path="/course/:courseCode"
          render={this.renderCourseDetail}
        />
        <Route
          exact={true}
          path="/courseRun/:courseCode"
          render={this.renderCourseRun}
        />
        <Route
          exact={true}
          path="/settings/:username"
          render={this.renderSettings}
        />
        <Route
          exact={true}
          path="/question/:courseCode/:qNum"
          render={this.renderQuestion}
        />

        <Route exact={true} path="/dashboard/" render={this.renderDashboard} />
      </>
    );
  };
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    username: state.username,
    subscribedCourses: state.subscribedCourses,
    studentHistory: state.studentHistory,
    liveStudentHistory: state.liveStudentHistory,
    liveCourseQuestions: state.liveCourseQuestions,
    liveCourseSettings: state.liveCourseSettings,
    subscriptionSettings: state.subscriptionSettings,
    liveQuizFilterObj: state.liveQuizFilterObj,
    liveStudentUnRead: state.liveStudentUnRead,
    currentQuestion: state.currentQuestion,
    subscribedAllResponses: state.subscribedAllResponses,
    newQNum: state.newQNum,
    criteriaTypes: state.criteriaTypes
  }; // THIS WILL CHANGE
};

let RoutesAndPaths = connect(mapStateToProps)(Routes);

export { RoutesAndPaths };
