import React, { Component } from "react";
import { Link, Route } from "react-router-dom";

class TopBanner extends Component {
  constructor() {
    super();
  }

  //renderLoginSignup

  render = () => {
    return (
      <>
        <div className="top banner top-banner">
          <div className="title">exam prep courses</div>
          <div className="icons">
            <img src="/logos/phone-24px.svg" height="40px" />
            {
              //<img src="/logos/shopping_basket-24px.svg" height="40px" />
            }
            <img src="/logos/add_shopping_cart-24px.svg" height="40px" />

            <Link to={"/login/"}>
              <button type="button" id="button-login">
                <b>SIGN IN</b>
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  };
}

export default TopBanner;
