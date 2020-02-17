import React, { Component } from "react";
import { connect } from "react-redux";
import Checkout from "./Checkout.jsx";

class Course extends Component {
  constructor(props) {
    super(props);
  }

  checkOutOneItem = (evt, coursePurchased) => {
    evt.preventDefault();
    console.log("checking out");
    if (
      this.props.username === "browsing ..." ||
      this.props.username === undefined
    ) {
      //alert("You must be logged in to Add To Cart. Please log in or register");
      //return;
    }

    this.props.dispatch({
      type: "SET-PURCHASE-ITEM",
      payload: { purchaseItem: coursePurchased }
    });
    this.setState({ quantity: 0 });
    this.props.rD.history.push("/checkout");
  };

  render = () => {
    const { _id, courseCode, courseName, cost } = this.props.course;
    return (
      <div className="item-container">
        {/*
        <div className="img-container">
          <img src={imgPath} height="60px" />
          <div>
            <b>in stock</b>
          </div>
        </div>
          */}
        <div className="description">
          Name : {courseName}
          <br />
          Code : {courseCode}
          <br />
          Cost: {cost}
          <br />
          <form onSubmit={evt => this.checkOutOneItem(evt, this.props.course)}>
            Quantity: <input type="number" min="0"></input>
            <input type="submit"></input>
          </form>
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    username: state.username,
    purchaseItem: state.purchaseItem
  };
};

export default connect(mapStateToProps)(Course);
