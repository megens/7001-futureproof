import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Course extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    const { _id, courseCode, courseName, desc, price } = this.props.course;
    console.log("course history is ");
    console.log(this.props.courseHistory);
    console.log("courseCode is " + courseCode);
    this.props.courseHistory.forEach(course => {
      console.log("courseHistory courseCode is " + course.courseCode);
      console.log(course.courseCode + " = " + courseCode + "?");
      console.log(course.courseCode === courseCode);
    });

    let alreadyHave =
      undefined !==
      this.props.courseHistory.find(course => {
        return course.courseCode.toString() === courseCode.toString();
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
    courseHistory: state.courseHistory
  };
};

export default connect(mapStateToProps)(Course);
