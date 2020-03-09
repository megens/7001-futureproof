import React, { Component } from "react";
import { Link, Route } from "react-router-dom";

class TopLeft extends Component {
  constructor() {
    super();
  }

  render = () => {
    return (
      <>
        <div className="top-left top left">
          <div>
            <Link to={"/"}>
              <img src="/logos/future proof Bold Blue.jpg" height="80px" />
            </Link>
          </div>
        </div>
      </>
    );
  };
}

export default TopLeft;
