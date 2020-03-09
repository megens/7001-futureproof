import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import CourseShelf from "../CourseShelf/CourseShelf.jsx";
import CourseDetail from "../CourseDetail/CourseDetail.jsx";
import CourseRun from "../CourseRun/CourseRun.jsx";
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

class Routes extends Component {
  constructor() {
    super();
  }

  componentDidMount = () => {
    console.log("MOUNT Routes and Paths");
    console.log(this.props.studentHistory);
  };

  componentDidUpdate = () => {
    console.log("UPDATE Routes and Paths");
  };

  renderLoginSignup = routerData => {
    console.log("renderLoginSignup");
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
    console.log("render Logout");
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
    console.log("render cart");
    return <Cart />;
  };

  renderCheckout = routerData => {
    console.log("running checkout");
    return <Checkout rD={routerData} />;
  };

  renderCourseShelf = routerData => {
    console.log("render shop");
    return <CourseShelf rD={routerData} />;
  };

  renderCourseDetail = routerData => {
    let courseCode = routerData.match.params.courseCode;
    console.log("rendering with " + courseCode);
    return <CourseDetail courseCode={courseCode} rD={routerData} />;
  };

  renderMyProfile = routerData => {
    let userId = routerData.match.params.username;
    return <MyProfile rD={routerData} />;
  };

  renderCourseRun = routerData => {
    let courseCode = routerData.match.params.courseCode;
    console.log("running course " + courseCode);
    return <CourseRun courseCode={courseCode} />;
  };

  renderQuestion = routerData => {
    let courseCode = routerData.match.params.courseCode;
    let qNumber = routerData.match.params.qNum;
    let currentQuestion = {};
    // if question is not in your history, put it in your history
    console.log("render question");
    console.log(courseCode);
    console.log("studentHistory");
    console.log(this.props.studentHistory);
    currentQuestion = this.props.studentHistory[courseCode].find(question => {
      return question.qNum.toString() === qNumber;
    });
    if (!currentQuestion) {
      console.log("this.props.subscribedCourses[courseCode]");
      console.log(this.props.subscribedCourses);
      console.log(this.props.subscribedCourses[courseCode]);
      console.log(qNumber);
      currentQuestion = this.props.subscribedCourses[
        courseCode
      ].questionVec.find(question => {
        return question.qNum.toString() === qNumber;
      });
      console.log("currentQuestion");
      console.log(currentQuestion);
      console.log("and now this");
      let studentHistoryCopy = JSON.parse(
        JSON.stringify(this.props.studentHistory)
      );
      console.log(studentHistoryCopy);
      console.log(studentHistoryCopy[courseCode]);
      console.log(studentHistoryCopy[courseCode].slice());
      let courseSlice = studentHistoryCopy[courseCode].slice();
      console.log("courseSlice");
      console.log(courseSlice);
      courseSlice.push(currentQuestion);
      console.log("courseSlice");
      console.log(courseSlice);
      studentHistoryCopy[courseCode] = courseSlice;
      console.log("studentHistoryCopy");
      console.log(studentHistoryCopy);
      console.log("about to Dispatch");
      console.log("SET-STUDENTHISTORY-AND-CURRENT-Q");
      this.props.dispatch({
        type: "SET-STUDENTHISTORY-AND-CURRENT-Q",
        payload: {
          studentHistoryCopy: studentHistoryCopy,
          currentQuestion: currentQuestion
        }
      });
    } else {
      console.log("SET-CURRENT-QUESTION");
      this.props.dispatch({
        type: "SET-CURRENT-QUESTION",
        payload: { currentQuestion: currentQuestion }
      });
    }
    console.log("about to return AskQ from routes");
    console.log(currentQuestion);
    return <AskQ rD={routerData} />;
  };

  renderAnswerSubmitted = routerData => {
    let qNumber = routerData.match.params.qNum;
    let isCorrect = routerData.match.params.isCorrect === "true";
    console.log("answered question " + qNumber);
    return (
      <AnswerSubmitted
        qNumber={qNumber}
        isCorrect={isCorrect}
        rD={routerData}
      />
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
          path="/courseRun/:courseCode"
          render={this.renderCourseRun}
        />
        <Route
          exact={true}
          path="/question/:courseCode/:qNum"
          render={this.renderQuestion}
        />
        <Route
          exact={true}
          path="/answer-submitted/:qNum/:isCorrect"
          render={this.renderAnswerSubmitted}
        />
      </>
    );
  };
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    username: state.username,
    subscribedCourses: state.subscribedCourses,
    studentHistory: state.studentHistory
  }; // THIS WILL CHANGE
};

let RoutesAndPaths = connect(mapStateToProps)(Routes);

export { RoutesAndPaths };
