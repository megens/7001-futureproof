import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import { connect } from "react-redux";

class TopBanner extends Component {
  constructor(props) {
    super(props);
    this.state = { usernameInput: "", passwordInput: "" };
  }

  //renderLoginSignup

  componentDidMount = () => {
    this.nameInput.focus();
  };

  usernameChange = (evt) => {
    console.log(evt.target.value);
    this.setState({ usernameInput: evt.target.value });
  };
  passwordChange = (evt) => {
    this.setState({ passwordInput: evt.target.value });
  };

  submitHandler = async (evt) => {
    evt.preventDefault();
    this.closeForm(); // close popup
    let username = this.state.usernameInput;
    let password = this.state.passwordInput;
    this.setState({ passwordInput: "", passwordInput: "" });
    //this.props.setUsername(username);
    this.props.rD.history.push("/myProfile/" + username);
    // should this be at the bottom?
    console.log(username + " " + password);
    let data = new FormData();
    data.append("username", username);
    data.append("password", password);
    console.log(data);
    let response = await fetch("/login", { method: "POST", body: data });
    let body = await response.text();
    let parsed = JSON.parse(body);
    console.log("success is " + parsed.success);
    if (parsed.success) {
      console.log("login success");
      console.log(parsed);
      this.props.dispatch({
        type: "LOGIN-SUCCESS",
        payload: {
          username,
          cart: parsed.cart,
          studentHistory: parsed.studentHistory,
          subscriptions: parsed.subscriptions,
          subscribedCourses: parsed.subscribedCourses,
          subscriptionSettings: parsed.subscriptionSettings,
          subscribedAllResponses: parsed.subscribedAllResponses,
        },
      });
    }
  };

  openForm = () => {
    document.getElementById("loginPopup").style.display = "block";
    this.nameInput.focus();
  };
  closeForm = () => {
    document.getElementById("loginPopup").style.display = "none";
  };

  performLogout = async () => {
    console.log("performing logout");
    let logoutConfirmed = confirm("Confirm Logout?");
    if (logoutConfirmed) {
      let data = new FormData();
      data.append("username", this.props.username);
      data.append("cart", JSON.stringify(this.props.cart));
      data.append("studentHistory", JSON.stringify(this.props.studentHistory));
      data.append("subscriptions", JSON.stringify(this.props.subscriptions));
      console.log("subscriptionSettings is " + this.props.subscriptionSettings);
      data.append(
        "subscriptionSettings",
        JSON.stringify(this.props.subscriptionSettings)
      );
      //
      this.props.rD.history.push("/"); // push the User experience to a new path
      //
      let response = await fetch("/logout", { method: "POST", body: data });
      let body = await response.text();
      let parsed = JSON.parse(body);
      console.log("completed logout?");
      console.log(parsed);
      this.props.dispatch({
        type: "LOGOUT",
        payload: {
          username: this.props.username,
          cart: this.props.cart,
          studentHistory: this.props.studentHistory,
        },
      });
    }
  };

  render = () => {
    let totalCart = this.props.cart.length;
    console.log("loggedIn? " + this.props.loggedIn);
    return (
      <>
        <div className="top banner top-banner">
          <div className="title">
            exam prep courses <br />
          </div>
          <div className="icons">
            <i className="fas fa-at top-icon"></i>
            <i className="fas fa-phone top-icon"></i>

            {
              //<img src="/logos/shopping_basket-24px.svg" height="40px" />
            }
            <div className="cart-plus-count">
              <Link to={"/cart"}>
                <i className="fas fa-shopping-cart top-icon" height="90px"></i>
                <span id="cart-count">{totalCart}</span>
              </Link>
            </div>
            {this.props.loggedIn ? (
              <Link to={"/myProfile/" + this.props.username}>
                <button
                  type="button"
                  className="linkButton"
                  id="button-profile"
                >
                  My Profile
                </button>
              </Link>
            ) : (
              <></>
            )}
            {!this.props.loggedIn ? (
              <button type="button" id="button-login" onClick={this.openForm}>
                <b>LOGIN</b>
              </button>
            ) : (
              <button
                type="button"
                id="button-logout"
                onClick={this.performLogout}
              >
                <b>LOGOUT</b>
              </button>
            )}
            {/*
              <Link to={"/logout/"}>
              <button type="button" id="button-login">
              <b>LOGOUT {this.props.username}</b>
              </button>
              </Link>
            */}

            {
              // the hidden popup form to Login
            }
            <div className="form-popup" id="loginPopup">
              <form onSubmit={this.submitHandler} className="form-container">
                <h3>LOGIN</h3>
                <label>
                  <>Username</>
                </label>
                <input
                  type="text"
                  ref={(input) => {
                    this.nameInput = input;
                  }}
                  placeholder="Enter username"
                  name="username"
                  required
                  onChange={this.usernameChange}
                  value={this.state.usernameInput}
                />
                <label>
                  <>Password</>
                </label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  name="psw"
                  required
                  value={this.state.passwordInput}
                  onChange={this.passwordChange}
                />
                <button type="submit" className="btn">
                  <b>LOGIN</b>
                </button>
              </form>

              <div className="form-container">
                <label>
                  <>Not registered?</>
                </label>
                <button type="button" className="btn">
                  <b>REGISTER</b>
                </button>
                <button
                  type="submit"
                  className="btn cancel"
                  onClick={this.closeForm}
                >
                  <b>CLOSE</b>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };
}

const mapStateToProps = (state, props) => {
  return {
    loggedIn: state.loggedIn,
    username: state.username,
    cart: state.cart,
    studentHistory: state.studentHistory,
    subscriptions: state.subscriptions,
    subscriptionSettings: state.subscriptionSettings,
  };
};

export default connect(mapStateToProps)(TopBanner);
