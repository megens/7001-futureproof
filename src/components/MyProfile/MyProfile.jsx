import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Route } from "react-router-dom";

class MyProfile extends Component {
  constructor(props) {
    super(props);
  }

  // COOKIE LOGIC HERE?

  componentDidMount = () => {
    console.log("MOUNT MyProfile");
  };

  render = () => {
    const courseCodeKeys = Object.keys(this.props.subscriptions);
    console.log("courseCodeKeys");
    console.log(courseCodeKeys);
    return (
      <>
        <b>ACTIVE SUBSCRIPTIONS</b>
        <div className="buttonVec">
          {/*
          {this.props.subscriptions.map((x, idx) => {
          */}
          {courseCodeKeys.map((courseCode, idx) => {
            return (
              <div key={idx}>
                <Link to={"/courseRun/" + courseCode}>
                  <button type="button">
                    <b>{courseCode}</b>
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
        <br />
        <Link to={"/mysubscriptions/:" + this.props.username}>
          <div>ARCHIVED SUBSCRIPTIONS</div>
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
    subscriptions: state.subscriptions
  };
};

export default connect(mapStateToProps)(MyProfile);
