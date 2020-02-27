import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class SideBanner extends Component {
  constructor() {
    super();
  }

  render = () => {
    console.log("in sidebanner.jsx");
    let totalCart = 0;
    if (this.props.loggedIn) {
      console.log("cart is defined", this.props.cart);
      let cartTotal = this.props.cart.length;
    }

    return (
      <>
        <div className="side-banner">
          {this.props.username !== undefined && (
            <div className="s-link">
              <b>Logged in as :</b>
              <br />
              <i>{this.props.username}</i>
            </div>
          )}
          {this.props.username !== undefined && (
            <div className="s-link">
              <Link to={"/myProfile/" + this.props.username}>
                <button type="button" className="linkButton">
                  My Profile
                </button>
              </Link>
            </div>
          )}

          {this.props.username !== undefined && (
            <div className="s-link">
              <Link to={"/shop"}>
                <button type="button" className="linkButton">
                  Shop Courses
                </button>
              </Link>
            </div>
          )}
        </div>
      </>
    );
  };
}

const mapStateToProps = state => {
  return {
    username: state.username,
    loggedIn: state.loggedIn,
    cart: state.cart
  }; // THIS WILL CHANGE
};

export default connect(mapStateToProps)(SideBanner);
