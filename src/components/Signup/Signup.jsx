import React, { Component } from "react";
import { connect } from "react-redux";

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = { usernameInput: "", passwordInput: "" };
  }
  usernameChange = evt => {
    this.setState({ usernameInput: evt.target.value });
  };

  passwordChange = evt => {
    this.setState({ passwordInput: evt.target.value });
  };

  submitHandler = async evt => {
    evt.preventDefault();
    let username = this.state.usernameInput;
    let password = this.state.passwordInput;
    let data = new FormData();
    data.append("username", username);
    data.append("password", password);
    let response = await fetch("/signup", { method: "POST", body: data });
    let body = await response.text();
    let parsed = JSON.parse(body);
    if (parsed.success) {
      console.log("signup success");
      this.props.dispatch({
        type: "LOGIN-SUCCESS",
        payload: {
          username
        }
      });
      //this.props.setUsername(username);
    }
  };

  render = () => {
    return (
      <form className="login-form" onSubmit={this.submitHandler}>
        <div>
          <h3>Sign Up:</h3>
        </div>
        Username:
        <input
          type="text"
          onChange={this.usernameChange}
          value={this.state.usernameInput}
        ></input>{" "}
        Password:
        <input
          type="password"
          onChange={this.passwordChange}
          value={this.state.passwordInput}
        ></input>{" "}
        <input type="submit" value="Sign Up" />
      </form>
    );
    //
  };
}

const mapStateToProps = state => {
  return { loggedIn: state.loggedIn, username: state.username };
};

export default connect(mapStateToProps)(Signup);
