import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Course extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    const courseCodeKeys = Object.keys(this.props.subscriptions);
    console.log("courseCodeKeys");
    console.log(courseCodeKeys);

    const { _id, courseCode, courseName, desc, price } = this.props.course;
    console.log("courseCode is " + courseCode);
    courseCodeKeys.forEach(course => {
      console.log("subscriptions courseCode is " + course);
      console.log(course + " = " + courseCode + "?");
      console.log(course === courseCode);
    });

    let alreadyHave =
      undefined !==
      courseCodeKeys.find(course => {
        return course === courseCode.toString();
      });
    console.log("already Have?");
    console.log(alreadyHave);
    console.log("length");
    console.log(alreadyHave.length);
    console.log("already have? " + alreadyHave);

    return (
      <div className="item-container">
        <Link to={"/course/" + courseCode}>
          <button type="button" className="courseButton">
            <div className="description">
              Name : {courseName}
              <br />
              Code : {courseCode}
              <br />
              Description : {desc}
              <br />
              Cost: {price}
              <br />
              {alreadyHave ? <b>Subscribed</b> : ""}
            </div>
          </button>
        </Link>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    username: state.username,
    purchaseItem: state.purchaseItem,
    subscriptions: state.subscriptions
  };
};

export default connect(mapStateToProps)(Course);
