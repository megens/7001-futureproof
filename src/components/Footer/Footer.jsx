import React, { Component } from "react";
import { connect } from "react-redux";

class Footer extends Component {
  constructor() {
    super();
  }

  render = () => {
    return (
      <>
        <div className="bottom-banner bottom right">
          Footer material Copyright stuff
        </div>
      </>
    );
  };
}

export default Footer;
