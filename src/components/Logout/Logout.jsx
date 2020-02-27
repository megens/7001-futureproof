import React, { Component } from "react";
import { connect } from "react-redux";

class Logout extends Component {
  constructor(props) {
    super(props);
  }

  performLogout = async () => {
    console.log("performing logout");
    let data = new FormData();
    data.append("username", this.props.username);
    data.append("cart", JSON.stringify(this.props.cart));
    data.append("studentHistory", JSON.stringify(this.props.studentHistory));
    data.append("courseHistory", JSON.stringify(this.props.courseHistory));
    data.append("questionVec", JSON.stringify(this.props.questionVec));
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
        courseHistory: this.props.courseHistory,
        purchaseItem: this.props.purchaseItem,
        questionVec: this.props.questionVec
      }
    });
    this.props.rD.history.push("/"); // push the User experience to a new path
  };

  render = () => {
    return (
      <input
        type="button"
        value="Confirm Log Out?"
        onClick={this.performLogout}
      />
    );
    //
  };
}

const mapStateToProps = (state, props) => {
  return {
    loggedIn: state.loggedIn,
    username: state.username,
    cart: state.cart,
    studentHistory: state.studentHistory,
    courseHistory: state.courseHistory,
    purchaseItem: state.purchaseItem
  };
};

export default connect(mapStateToProps)(Logout);
