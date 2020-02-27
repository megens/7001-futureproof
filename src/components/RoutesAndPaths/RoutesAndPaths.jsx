import React, { Component } from "react";
import { Link, Route, BrowserRouter, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CourseShelf from "../CourseShelf/CourseShelf.jsx";
import CourseDetail from "../CourseDetail/CourseDetail.jsx";
import CourseRun from "../CourseRun/CourseRun.jsx";
import AskQuestion from "../AskQuestion/AskQuestion.jsx";
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

  renderSideOnly = () => {
    console.log("at side only");
    return <SideBanner />;
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
    return <MyProfile userId={userId} rD={routerData} />;
  };

  renderCourseRun = routerData => {
    let courseCode = routerData.match.params.courseCode;
    console.log("running course " + courseCode);
    return <CourseRun courseCode={courseCode} rD={routerData} />;
  };

  renderQuestion = routerData => {
    let qNumber = routerData.match.params.qNum;
    console.log("asking question " + qNumber);
    return <AskQuestion qNumber={qNumber} rD={routerData} />;
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
          path="/question/:qNum"
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
    username: state.username
  }; // THIS WILL CHANGE
};

let RoutesAndPaths = connect(mapStateToProps)(Routes);

export { RoutesAndPaths };
