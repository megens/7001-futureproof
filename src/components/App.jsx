import React, { Component } from "react";
import { Link, Route, BrowserRouter, withRouter } from "react-router-dom";
import { connect } from "react-redux";
//import LinkButton from "./LinkButton.jsx";
import { RoutesAndPaths } from "./RoutesAndPaths.jsx";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <>
        <BrowserRouter>
          <div className="side-and-body">
            <RoutesAndPaths />
          </div>
        </BrowserRouter>
      </>
    );
  };
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    username: state.username,
    cart: state.cart,
    designsCart: state.designsCart
  }; // THIS WILL CHANGE
};

export default connect(mapStateToProps)(App);
