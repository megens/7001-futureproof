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
              <img src="/logos/futureproof_green_capture.JPG" height="80px" />
            </Link>
          </div>
        </div>
      </>
    );
  };
}

export default TopLeft;
