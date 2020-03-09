import React, { Component } from "react";
import { Link, Route } from "react-router-dom";
import { connect } from "react-redux";

class TopBanner extends Component {
  constructor() {
    super();
  }

  //renderLoginSignup

  render = () => {
    let totalCart = this.props.cart.length;
    console.log("loggedIn? " + this.props.loggedIn);
    return (
      <>
        <div className="top banner top-banner">
          <div className="title">
            exam prep courses <br />
            {this.props.loggedIn ? "[" + this.props.username + "]" : ""}
          </div>
          <div className="icons">
            <i className="fas fa-at top-icon"></i>
            <i className="fas fa-phone top-icon"></i>

            {
              //<img src="/logos/shopping_basket-24px.svg" height="40px" />
            }
            <div className="cart-plus-count">
              <Link to={"/cart"}>
                <i className="fas fa-shopping-cart top-icon" height="90px"></i>
                <span id="cart-count">{totalCart}</span>
              </Link>
            </div>
            {this.props.loggedIn ? (
              <Link to={"/myProfile/" + this.props.username}>
                <button type="button" className="linkButton">
                  My Profile
                </button>
              </Link>
            ) : (
              <></>
            )}

            {!this.props.loggedIn ? (
              <Link to={"/login/"}>
                <button type="button" id="button-login">
                  <b>SIGN IN</b>
                </button>
              </Link>
            ) : (
              <Link to={"/logout/"}>
                <button type="button" id="button-login">
                  <b>SIGN OUT {this.props.username}</b>
                </button>
              </Link>
            )}

            {/*


            (<Link to={"/login/"}>
              <button type="button" id="button-login">
                <b>SIGN IN</b>
              </button>
            </Link>):(<>)}
*/}
          </div>
        </div>
      </>
    );
  };
}

const mapStateToProps = (state, props) => {
  return {
    loggedIn: state.loggedIn,
    username: state.username,
    cart: state.cart
  };
};

export default connect(mapStateToProps)(TopBanner);
