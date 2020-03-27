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
    if (arr1.length !== arr2.length) return false;
    // Check if all items exist and are in the same order
    for (var i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) return false;
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
      let liveUnReadQs = liveCourse.questionVec.slice();
      for (let i = 0; i <= liveStudentHistory.length - 1; i++) {
        console.log("unread ", liveUnReadQs);
        let indexOfQ = liveUnReadQs.findIndex(question => {
          return question.qNum === liveStudentHistory[i].qNum;
        });
        liveUnReadQs.splice(indexOfQ, 1);
      }
      console.log("dispatch LOAD-LIVE-COURSE");
      this.props.dispatch({
        type: "LOAD-LIVE-COURSE",
        payload: {
          liveCourseQuestions: liveCourse.questionVec,
          liveStudentHistory: liveStudentHistory,
          liveAllResponses: liveAllResponses.responses
        }
      });

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
    let proceed = false;
    const arraysMatch = (arr1, arr2) => {
      // Check if the arrays are the same length
      if (arr1.length !== arr2.length) return false;
      // Check if all items exist and are in the same order
      for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
      }
      // Otherwise, return true
      return true;
    };
    let indexOfQ;

    const setup = () => {
      let courseCode = routerData.match.params.courseCode;
      let qNumber = routerData.match.params.qNum;
      console.log("route Question");
      console.log(courseCode);
      console.log(qNumber);
      console.log("loading from studenthistory?");
      let liveStudentHistoryCopy = this.props.liveStudentHistory.slice();

      indexOfQ = liveStudentHistoryCopy.findIndex(question => {
        return question.qNum === qNumber;
      });
      console.log("indexOfQ is " + indexOfQ);
      let currentQuestion = null;
      if (indexOfQ > -1) {
        currentQuestion = liveStudentHistoryCopy[indexOfQ];
      }
      /*
      let currentQuestion = liveStudentHistoryCopy.find(question => {
        return question.qNum === qNumber;
      });
      */
      console.log("liveStudentHistory and Copy and currentQuestion");
      console.log(this.props.liveStudentHistory);
      console.log(liveStudentHistoryCopy);
      console.log(currentQuestion);
      if (!currentQuestion) {
        console.log("picking up from course");
        let currentQuestion = this.props.liveCourseQuestions.find(question => {
          return question.qNum.toString() === qNumber;
        });
        liveStudentHistoryCopy.push(currentQuestion);
        console.log("currentQuestion and liveStudentHistory and Copy");
        console.log(this.props.liveStudentHistory);
        console.log(currentQuestion);
        console.log(liveStudentHistoryCopy);
      }
      if (
        !(
          currentQuestion === this.props.currentQuestion &&
          arraysMatch(liveStudentHistoryCopy, this.props.liveStudentHistory)
        )
      ) {
        console.log(
          "going to dispatch SET-CURRENT-QUESTION-AND-LIVESTUDENTHISTORY"
        );
        console.log(currentQuestion);
        console.log(this.props.currentQuestion);
        console.log(currentQuestion === this.props.currentQuestion);
        console.log(liveStudentHistoryCopy);
        console.log(this.props.liveStudentHistory);
        console.log(
          arraysMatch(liveStudentHistoryCopy, this.props.liveStudentHistory)
        );

        //remove currentQuestion from liveStudentUnRead array? Maybe I can let this be done in CourseRun
        /*console.log("liveStudentUnRead ");
        console.log(this.props.liveStudentUnRead);
        let liveUnReadQs = this.props.liveStudentUnRead.slice();
        console.log("liveUnReadQs");
        console.log(liveUnReadQs);
        let idx = liveUnReadQs.findIndex(question => {
          return question.qNum === this.props.currentQuestion.qNum;
        });
        liveUnReadQs.splice(idx, 1);
        console.log("liveUnReadQs");
        console.log(liveUnReadQs);
        */
        this.props.dispatch({
          type: "SET-CURRENT-QUESTION-AND-LIVESTUDENTHISTORY",
          payload: {
            currentQuestion: currentQuestion,
            //liveStudentUnRead: liveUnReadQs,
            liveStudentHistory: liveStudentHistoryCopy
          }
        });
      } else {
        console.log("about to return AskQ from routes");
        console.log(this.props.currentQuestion);
        proceed = true;
      }
    };

    setup();
    if (proceed) return <AskQ rD={routerData} indexOfQ={indexOfQ} />;
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
    liveStudentUnRead: state.liveStudentUnRead,
    currentQuestion: state.currentQuestion,
    subscribedAllResponses: state.subscribedAllResponses
  }; // THIS WILL CHANGE
};

let RoutesAndPaths = connect(mapStateToProps)(Routes);

export { RoutesAndPaths };
