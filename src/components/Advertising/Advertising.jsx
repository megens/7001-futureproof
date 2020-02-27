import React, { Component } from "react";
import { Link, Route, BrowserRouter, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import "./advertising.css";
import { slideShowElements } from "./slideShowElements.js";

class Advertising extends Component {
  constructor() {
    super();
    this.state = { slideNumber: 0, slideCount: 3 };
  }

  carouselSpeed = 5000;

  componentDidMount = () => {
    console.log("componentDidMount");
    this.setState({ slideCount: slideShowElements.length });
    this.checkInterval = setInterval(this.increment, this.carouselSpeed); // rotate carousel every x seconds
  };

  componentDidUpdate = () => {
    clearInterval(this.checkInterval);
    this.checkInterval = setInterval(this.increment, this.carouselSpeed); // rotate carousel every x seconds
  };

  componentWillUnmount = () => {
    clearInterval(this.checkInterval);
  };

  increment = () => {
    let destSlideNumber = (this.state.slideNumber + 1) % this.state.slideCount;
    //console.log(destSlideNumber);
    this.setState({ slideNumber: destSlideNumber });
  };

  decrement = () => {
    let destSlideNumber = 0;
    if (this.state.slideNumber === 0) {
      destSlideNumber = this.state.slideCount - 1;
    } else {
      destSlideNumber = this.state.slideNumber - 1;
    }
    console.log(destSlideNumber);
    this.setState({ slideNumber: destSlideNumber });
  };

  selectSlide = n => {
    console.log(n);
    this.setState({ slideNumber: n });
  };

  render = () => {
    return (
      <>
        <div className="slideshow-container">
          {slideShowElements.map((elem, index) => {
            return (
              <div key={index}>
                {index === this.state.slideNumber ? (
                  <div className="leftToRight ">
                    <div className="leftSide">
                      {elem.sideText}
                      <br />
                      <br />
                      <div className="buttonVec">
                        {elem.linkVec.map((x, idx) => {
                          return (
                            <div key={idx}>
                              <button>{x}</button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div className="middle mySlides fade">
                      <div className="numbertext">
                        {index + 1} / {slideShowElements.length}
                      </div>
                      <div className="middle">
                        <img
                          src={elem.image}
                          height="400px"
                          max-width="600px"
                        />
                      </div>
                      <div className="text">{elem.caption}</div>
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            );
          })}
          {
            // <!-- Next and previous buttons -->
          }
          <div className="prev" onClick={this.decrement}>
            &#10094;
          </div>
          <div className="next" onClick={this.increment}>
            &#10095;
          </div>

          {
            // <!-- The dots/circles -->
          }
          <div className="rowOfDots">
            <span
              className={
                "dot " + (this.state.slideNumber === 0 ? "active" : "")
              }
              onClick={() => this.selectSlide(0)}
            ></span>
            <span
              className={
                "dot " + (this.state.slideNumber === 1 ? "active" : "")
              }
              onClick={() => this.selectSlide(1)}
            ></span>
            <span
              className={
                "dot " + (this.state.slideNumber === 2 ? "active" : "")
              }
              onClick={() => this.selectSlide(2)}
            ></span>
          </div>
        </div>
      </>
    );
  };
}

export default Advertising;
