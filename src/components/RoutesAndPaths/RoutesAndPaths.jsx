import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import TopBanner from "../TopBanner/TopBanner.jsx";
import TopLeft from "../TopLeft/TopLeft.jsx";
import CourseShelf from "../CourseShelf/CourseShelf.jsx";
import CourseDetail from "../CourseDetail/CourseDetail.jsx";
import CourseMenu from "../CourseMenu/CourseMenu.jsx";
import CourseSettings from "../CourseSettings/CourseSettings.jsx";
import AskQ from "../AskQuestion/AskQ.jsx";
import Advertising from "../Advertising/Advertising.jsx";
import Checkout from "../Checkout/Checkout.jsx";
import SideBanner from "../SideBanner/SideBanner.jsx";
import Login from "../Login/Login.jsx";
import Signup from "../Signup/Signup.jsx";
import Logout from "../Logout/Logout.jsx";
import MyProfile from "../MyProfile/MyProfile.jsx";
import Dashboard from "../Dashboard/Dashboard.jsx";
import Study from "../Study/Study.jsx";
import Admin from "../Admin/Admin.jsx";
import {
  refreshCriteriaSet,
  refreshCourseSettings,
  refreshUnRead,
} from "../Utilities/utilities.js";

let isEqual = require("lodash.isequal");
const deepCopy = require("rfdc")(); // a really fast deep copy function

class Routes extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log("MOUNT Routes and Paths");
  };

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

  renderLoginSignup = (routerData) => {
    console.log("route LoginSignup");
    console.log("routerData is ");
    console.log(routerData);
    if (this.props.username === undefined) {
      return (
        <>
          <div className="top-row">
            <TopLeft />
            <TopBanner rD={routerData} />
          </div>
          <Login rD={routerData} />
          <Signup rD={routerData} />
        </>
      );
    }
    return (
      <>
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <Logout />
      </>
    );
  };

  renderLogout = (routerData) => {
    console.log("route Logout");
    return (
      <>
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <Logout rD={routerData} />
      </>
    );
  };

  renderHomePage = (routerData) => {
    if (this.props.loggedIn) {
      return (
        <>
          <div className="top-row">
            <TopLeft />
            <TopBanner rD={routerData} />
          </div>
          <SideBanner />
        </>
      );
    } else {
      return (
        <>
          <div className="top-row">
            <TopLeft />
            <TopBanner rD={routerData} />
          </div>
          <Advertising />
        </>
      );
    }
  };

  renderAdvertising = () => {
    return (
      <>
        {" "}
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <Advertising />
      </>
    );
  };

  renderCart = () => {
    console.log("route cart");
    return (
      <>
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <Cart />
      </>
    );
  };

  renderCheckout = (routerData) => {
    console.log("route checkout");
    return (
      <>
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <Checkout rD={routerData} />
      </>
    );
  };

  renderCourseShelf = (routerData) => {
    console.log("route shop");
    return (
      <>
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <CourseShelf rD={routerData} />
      </>
    );
  };

  renderCourseDetail = (routerData) => {
    let courseCode = routerData.match.params.courseCode;
    console.log("route CourseDetail with " + courseCode);
    return (
      <>
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <CourseDetail courseCode={courseCode} rD={routerData} />
      </>
    );
  };

  renderMyProfile = (routerData) => {
    console.log("route MyProfile");
    let userId = routerData.match.params.username;
    return (
      <>
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <MyProfile rD={routerData} />
      </>
    );
  };

  loadCourse = (routerData) => {
    let courseCode = routerData.match.params.courseCode;
    console.log("route loadCourse " + courseCode);
    const liveCourse = this.props.subscribedCourses[courseCode]; // select the relevant object
    const liveStudentHistory = this.props.studentHistory[courseCode]; // work with relevant object
    const liveAllResponses = this.props.subscribedAllResponses[courseCode]; // maybe update this later and more often?
    console.log("liveAllResponses");
    console.log(liveAllResponses);
    // Because the possible criteriaSet may have changed since last login, rebuild this
    // (new questions becoming available on DB), update this at every "courseLoad"

    const criteriaSet = refreshCriteriaSet(
      liveCourse,
      this.props.criteriaTypes
    );
    ////
    const subscriptionSettingsARRAY = refreshCourseSettings(
      courseCode,
      criteriaSet,
      deepCopy(this.props.subscriptionSettings)
    );
    const liveCourseSettings = subscriptionSettingsARRAY[0];
    const subscriptionSettings = subscriptionSettingsARRAY[1];
    ////
    const unReadARRAY = refreshUnRead(
      liveCourse,
      this.props.criteriaTypes,
      liveCourseSettings,
      liveStudentHistory
    );
    let liveUnReadQs = unReadARRAY[0];
    let filteredUnReadQs = unReadARRAY[1];
    // TO DO: move the following into refreshUnRead if it's consistent
    let currentQuestion;
    if (filteredUnReadQs.length === 0) {
      //no new question left, so render last answered
      currentQuestion = liveStudentHistory[liveStudentHistory.length - 1];
    } else {
      currentQuestion = filteredUnReadQs[0];
    }

    let newQ = filteredUnReadQs[1]; // a default POTENTIAL next Q if requested
    if (!newQ) {
      newQ = liveStudentHistory[liveStudentHistory.length - 1];
    }
    const newQNum = "" + newQ.courseCode + "/" + newQ.qNum;

    // FILL IN ALL CRITERIA ... if it needs to update, update. otherwise don't (to avoid inf loop)

    const dispatchLiveCourse = !isEqual(liveCourse, this.props.liveCourse);
    const dispatchLiveStudentHistory = !this.arraysMatch(
      liveStudentHistory,
      this.props.liveStudentHistory
    );
    const dispatchLiveAllResponses = !isEqual(
      liveAllResponses,
      this.props.liveAllResponses
    );
    const dispatchSubscriptionSettings = !isEqual(
      subscriptionSettings,
      this.props.subscriptionSettings
    );
    const dispatchNewQNum = !(newQNum === this.props.newQNum);

    if (
      dispatchLiveCourse ||
      dispatchLiveStudentHistory ||
      dispatchLiveAllResponses ||
      dispatchSubscriptionSettings ||
      dispatchNewQNum
    ) {
      console.log("dispatch LOAD-LIVE-COURSE");
      console.log(
        dispatchLiveCourse +
          dispatchLiveStudentHistory +
          dispatchLiveAllResponses +
          dispatchSubscriptionSettings +
          dispatchNewQNum
      );
      this.props.dispatch({
        type: "LOAD-LIVE-COURSE",
        payload: {
          liveCourse: liveCourse,
          liveStudentHistory: liveStudentHistory,
          liveAllResponses: liveAllResponses,
          criteriaSet: criteriaSet,
          subscriptionSettings: subscriptionSettings,
          liveCourseSettings: subscriptionSettings[courseCode],
          liveStudentUnRead: liveUnReadQs,
          filteredUnReadQs: filteredUnReadQs,
          currentQuestion: currentQuestion,
          newQNum: newQNum,
        },
      });
    }

    if (true)
      return (
        <>
          <div className="top-row">
            <TopLeft />
            <TopBanner rD={routerData} />
          </div>
          <CourseMenu rD={routerData} />
        </>
      );
  };

  renderSettings = (routerData) => {
    return (
      <>
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <CourseSettings rD={routerData} />
      </>
    );
  };

  renderStudy = (routerData) => {
    return (
      <>
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <Study />
      </>
    );
  };

  renderQuestion = (routerData) => {
    let courseCode = routerData.match.params.courseCode;
    let qNumber = routerData.match.params.qNum;
    let proceed = false;
    let currentQuestion = null;
    let indexOfQ;
    //is the question in studentHistory?
    console.log("try loading from studenthistory?");
    let liveStudentHistoryCopy = deepCopy(this.props.liveStudentHistory);
    let liveStudentUnReadCopy = deepCopy(this.props.liveStudentUnRead);
    let filteredUnReadQsCopy = deepCopy(this.props.filteredUnReadQs);

    indexOfQ = liveStudentHistoryCopy.findIndex((question) => {
      return question.qNum === qNumber;
    });
    if (indexOfQ > -1) {
      // question is in studentHistory
      //TO DO ... this has to pass filter!
    } else {
      let pushQuestion = this.props.liveCourse.questionVec.find((question) => {
        return question.qNum.toString() === qNumber;
      });
      liveStudentHistoryCopy.push(pushQuestion);
    }
    indexOfQ = liveStudentHistoryCopy.findIndex((question) => {
      return question.qNum === qNumber;
    });
    currentQuestion = liveStudentHistoryCopy[indexOfQ];
    // remove the rendered Question from unRead
    let idx = liveStudentUnReadCopy.findIndex((question) => {
      return question.qNum === currentQuestion.qNum;
    });
    if (idx > -1) {
      console.log("removing currentQuestion from UnRead");
      liveStudentUnReadCopy.splice(idx, 1);
    } else {
      console.log("not removing currentQuestion from UnRead");
    }

    let idx2 = filteredUnReadQsCopy.findIndex((question) => {
      return question.qNum === currentQuestion.qNum;
    });
    if (idx2 > -1) {
      console.log("removing currentQuestion from filteredUnRead");
      filteredUnReadQsCopy.splice(idx2, 1);
    } else {
      console.log("not removing currentQuestion from filteredUnRead");
    }

    console.log("and now");
    console.log(liveStudentUnReadCopy);
    console.log(filteredUnReadQsCopy);
    // set the nextNewQ
    let nextNewQ;
    if (!(filteredUnReadQsCopy.length === 0)) {
      console.log("nextNewQ coming from filteredUnRead");
      nextNewQ = filteredUnReadQsCopy[0];
    } // in the absence of a more refined algorithm}
    else {
      console.log(
        "nextNewQ coming last of history ... out of UnRead which has length " +
          liveStudentUnReadCopy.length
      );
      nextNewQ = liveStudentHistoryCopy[liveStudentHistoryCopy.length - 1]; // s/d currentQuestion
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

    if (
      dispatchCurrentQuestion ||
      dispatchLiveStudentHistory ||
      dispatchLiveStudentUnRead ||
      dispatchNewQNum
    ) {
      console.log("going to SET-CURRENT-QUESTION-AND-LIVESTUDENTHISTORY");
      console.log(
        "dispatch? " +
          dispatchCurrentQuestion +
          dispatchLiveStudentHistory +
          dispatchLiveStudentUnRead +
          dispatchNewQNum
      );
      this.props.dispatch({
        type: "SET-CURRENT-QUESTION-AND-LIVESTUDENTHISTORY",
        payload: {
          currentQuestion: currentQuestion,
          liveStudentHistory: liveStudentHistoryCopy,
          liveStudentUnRead: liveStudentUnReadCopy,
          filteredUnReadQs: filteredUnReadQsCopy,
          newQNum: nextNewQNum,
        },
      });
    } else {
      proceed = true;
    }
    if (proceed)
      return (
        <>
          <div className="top-row">
            <TopLeft />
            <TopBanner rD={routerData} />
          </div>
          <AskQ rD={routerData} indexOfQ={indexOfQ} />
        </>
      );

    // to add here, when rendering a question tee up the next newQNum (if available), and affect the unReadQs
  };

  renderDashboard = (routerData) => {
    return (
      <>
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <Dashboard rD={routerData} />
      </>
    );
  };

  renderAdmin = (routerData) => {
    return (
      <>
        <div className="top-row">
          <TopLeft />
          <TopBanner rD={routerData} />
        </div>
        <Admin />
      </>
    );
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
          path="/CourseMenu/:courseCode"
          render={this.loadCourse}
        />
        <Route
          exact={true}
          path="/settings/:username"
          render={this.renderSettings}
        />
        <Route exact={true} path="/study" render={this.renderStudy} />
        <Route exact={true} path="/admin" render={this.renderAdmin} />
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

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn,
    username: state.username,
    subscribedCourses: state.subscribedCourses,
    liveCourse: state.liveCourse,
    studentHistory: state.studentHistory,
    liveStudentHistory: state.liveStudentHistory,
    liveStudentUnRead: state.liveStudentUnRead,
    filteredUnReadQs: state.filteredUnReadQs,
    criteriaTypes: state.criteriaTypes,
    subscriptionSettings: state.subscriptionSettings,
    liveCourseSettings: state.liveCourseSettings,
    subscribedAllResponses: state.subscribedAllResponses,
    liveAllResponses: state.liveAllResponses,
    currentQuestion: state.currentQuestion,
    newQNum: state.newQNum,
  };
};

let RoutesAndPaths = connect(mapStateToProps)(Routes);

export { RoutesAndPaths };
