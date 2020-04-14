import React, { Component } from "react";
import { Link, Route, BrowserRouter, withRouter } from "react-router-dom";
import { connect } from "react-redux";
//import LinkButton from "../Utilities/LinkButton.jsx";
import BottomLeft from "../BottomLeft/BottomLeft.jsx";
import Footer from "../Footer/Footer.jsx";
import { RoutesAndPaths } from "../RoutesAndPaths/RoutesAndPaths.jsx";

class App extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <BrowserRouter>
        {/*
        <div className="top-row">
          <TopLeft />
          <TopBanner />
        </div>
        */}

        <div className="middle-row">
          <RoutesAndPaths />
        </div>
        <div className="bottom-row">
          <BottomLeft />
          <Footer />
        </div>
      </BrowserRouter>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    loggedIn: state.loggedIn,
    username: state.username,
    cart: state.cart,
  }; // THIS WILL CHANGE
};

export default connect(mapStateToProps)(App);
