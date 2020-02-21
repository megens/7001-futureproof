import React, { Component } from "react";
import { connect } from "react-redux";

class MyProfile extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <>
        <div className="my-courses">
          {this.props.currentCourseList.map((x, idx) => {
            return (
              <div key={idx}>
                <Link to={"/course/:" + x.courseId}>
                  <button type="button" id="button-login">
                    <b>{x.buttonTitle}</b>
                  </button>
                </Link>
              </div>
            );
          })}
        </div>
        <Link to={"/myPriorCourses/:" + this.props.username}>
          <button type="button" id="button-login">
            <b>{x.buttonTitle}</b>
          </button>
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
    currentCourseList: state.currentCourseList,
    pastCourseList: state.pastCourseList
  };
};

export default connect(mapStateToProps)(MyProfile);
