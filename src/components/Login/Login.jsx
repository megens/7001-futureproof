import React, { Component } from "react";
import { connect } from "react-redux";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { usernameInput: "", passwordInput: "" };
  }

  componentDidMount = () => {
    //this.nameInput.focus();
    console.log("MOUNT Login here i am");
    this.openForm();
    console.log(this.props.rD);
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
    console.log("in submitHandler ");

    let username = this.state.usernameInput;
    let password = this.state.passwordInput;
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
      //this.props.setUsername(username);
      //this.props.rD.history.push("/myProfile/" + username);
    }
  };

  openForm = () => {
    document.getElementById("loginPopup").style.display = "block";
    this.usernameInput.focus();
  };
  closeForm = () => {
    document.getElementById("loginPopup").style.display = "none";
  };

  render = () => {
    return (
      <>
        <div className="form-popup" id="loginPopup">
          <form onSubmit={this.submitHandler} className="form-container">
            <h1>LOGIN</h1>
            <label>
              <b>Username</b>
            </label>
            <input
              type="text"
              ref={(input) => {
                this.usernameInput = input;
              }}
              placeholder="Enter username"
              name="username"
              required
              onChange={this.usernameChange}
              value={this.state.usernameInput}
            />
            <label>
              <b>Password</b>
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
              <b>Not registered?</b>
            </label>
            <button type="button" className="btn">
              <b>REGISTER</b>
            </button>
            <button
              type="button"
              className="btn cancel"
              onClick={this.closeForm}
            >
              <b>CLOSE</b>
            </button>
          </div>
        </div>

        {/*
        <form className="login-form" onSubmit={this.submitHandler}>
          <div>
            <h3>Log In:</h3>
          </div>
          Username:
          <input
            type="text"
            ref={(input) => {
              this.nameInput = input;
            }}
            onChange={this.usernameChange}
            value={this.state.usernameInput}
          ></input>{" "}
          Password:
          <input
            type="password"
            onChange={this.passwordChange}
            value={this.state.passwordInput}
          ></input>{" "}
          <input type="submit" value="Log In" />
        </form>
        */}
      </>
    );
    //
  };
}

const mapStateToProps = (state, props) => {
  return { loggedIn: state.loggedIn, username: state.username };
};

export default connect(mapStateToProps)(Login);
