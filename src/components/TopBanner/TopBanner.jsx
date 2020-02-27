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
            <img src="/logos/phone-24px.svg" height="40px" />
            {
              //<img src="/logos/shopping_basket-24px.svg" height="40px" />
            }
            <Link to={"/cart"}>
              <img src="/logos/add_shopping_cart-24px.svg" height="40px" />
              <span id="cart-count">{totalCart}</span>
            </Link>
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
