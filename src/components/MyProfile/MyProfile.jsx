import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";

class MyProfile extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount = async () => {
    // need this ONLY because I'm not currently able to update my Redux state for purchases, since this is from a functional component, not a React Component, so I can't dispatch from it?
    //console.log("COMPONENT DID MOUNT");
    //this.refreshProfile();
  };

  // COOKIE LOGIC HERE

  /*
  refreshProfile = async () => {
    console.log("refreshing");
    let data = new FormData();
    let username = this.props.username;
    data.append("username", username);
    let response = await fetch("/update-my-profile/", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    let parsed = JSON.parse(body);
    this.props.dispatch({
      type: "LOGIN-SUCCESS",
      payload: {
        username,
        cart: parsed.cart,
        courseHistory: parsed.courseHistory,
        studentHistory: parsed.studentHistory
      }
    });
  };
*/

  render = () => {
    console.log("courseHistory");
    console.log(this.props.courseHistory);
    return (
      <>
        <b>
          <u>MY ACTIVE SUBSCRIPTION(S)</u>
        </b>
        <div className="buttonVec">
          {this.props.courseHistory.map((x, idx) => {
            return (
              <div key={idx}>
                <Link to={"/courseRun/" + x.courseCode}>
                  <button type="button">
                    <b>{x.courseCode}</b>
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
        <Link to={"/myCourseHistory/:" + this.props.username}>
          <div>
            <b>
              <u>PAST SUBSCRIPTIONS</u>
            </b>
          </div>
        </Link>
      </>
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
    courseHistory: state.courseHistory
  };
};

export default connect(mapStateToProps)(MyProfile);
