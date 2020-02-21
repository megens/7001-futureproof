import React, { Component } from "react";
import { Link, Route, BrowserRouter, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CourseShelf from "../CourseShelf/CourseShelf.jsx";
import Advertising from "../Advertising/Advertising.jsx";
import Checkout from "../Checkout/Checkout.jsx";
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

  renderAdvertising = () => {
    return <Advertising />;
  };

  performLogout = async () => {
    console.log("performing logout");
    let data = new FormData();
    data.append("username", this.props.username);
    data.append("cart", JSON.stringify(this.props.cart));
    let response = await fetch("/logout", { method: "POST", body: data });
    let body = await response.text();
    let parsed = JSON.parse(body);
    console.log("completed logout?");
    console.log(parsed);
    this.props.dispatch({
      type: "LOGOUT",
      payload: { username: this.props.username, cart: this.props.cart }
    });
  };

  renderLogout = routerData => {
    console.log("render Logout");
    return <Logout rD={routerData} />;
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

  renderMyProfile = routerData => {
    let userId = routerData.match.params.username;
    return <MyProfile userId={userId} rD={routerData} />;
  };

  render = () => {
    return (
      <>
        <Route exact={true} path="/" render={this.renderAdvertising} />
        <Route exact={true} path="/login/" render={this.renderLoginSignup} />
        <Route exact={true} path="/shop/" render={this.renderCourseShelf} />
        <Route exact={true} path="/checkout" render={this.renderCheckout} />
        <Route exact={true} path="/cart/" render={this.renderCart} />
        <Route
          exact={true}
          path="/myProfile/:username"
          render={this.renderMyProfile}
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
