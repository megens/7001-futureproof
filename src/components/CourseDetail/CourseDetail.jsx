import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class CourseDetail extends Component {
  constructor(props) {
    super(props);
  }

  checkOutOneItem = (evt, coursePurchased) => {
    evt.preventDefault();
    console.log("checking out");
    if (this.props.username === undefined) {
      alert("You must be logged in to Add To Cart. Please log in or register");
      return;
    }
    this.props.dispatch({
      type: "SET-PURCHASE-ITEM",
      payload: { purchaseItem: coursePurchased }
    });
    this.setState({ quantity: 0 });
    this.props.rD.history.push("/checkout");
  };

  render = () => {
    const courseCodeKeys = Object.keys(this.props.subscriptions);
    let courseMatch = this.props.courseList.find(course => {
      return course.courseCode.toString() === this.props.courseCode;
    });
    let alreadyHave =
      undefined !==
      courseCodeKeys.find(course => {
        return course === this.props.courseCode.toString();
      });
    console.log(alreadyHave);

    const { _id, courseCode, courseName, desc, price } = courseMatch;

    return (
      <div className="item-container">
        <div className="description">
          Name : {courseName}
          <br />
          Code : {courseCode}
          <br />
          Description : {desc}
          <br />
          Price : {price}
          <br />
        </div>

        {!alreadyHave ? (
          <button
            type="button"
            id="purchaseButton"
            onClick={evt => this.checkOutOneItem(evt, courseMatch)}
          >
            Proceed to Purchase
          </button>
        ) : (
          <b>Subscribed</b>
        )}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    username: state.username,
    purchaseItem: state.purchaseItem,
    courseList: state.courseList,
    subscriptions: state.subscriptions
  };
};

export default connect(mapStateToProps)(CourseDetail);
