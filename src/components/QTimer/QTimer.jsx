import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class QTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsedTime: this.props.elapsedTime,
      timerOn: false
    };
  }

  componentDidMount = () => {
    console.log("MOUNT QTimer");
    console.log(this.props.currentQuestion.qNum);
    this.startTime = new Date().toLocaleString();
    if (!this.props.currentQuestion.complete) {
      this.setState({ timerOn: true });
      this.intervalID = setInterval(this.tick, this.tickInterval);
    }
  };

  componentWillUnmount = () => {
    clearInterval(this.intervalID);
  };

  tickInterval = 1000;

  tick = () => {
    //console.log("tick");

    if (this.state.timerOn && !this.props.currentQuestion.complete) {
      this.setState({
        elapsedTime: this.state.elapsedTime + this.tickInterval / 1000
      });
      this.props.dispatch({
        type: "SET-ANSWER-TIME",
        payload: this.state.elapsedTime
      });
    }
  };

  pauseTimer = () => {
    console.log("switching from " + this.state.timerOn);
    this.setState({ timerOn: !this.state.timerOn });
  };

  str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };

  render = () => {
    let elapsedMinutes = Math.floor(this.state.elapsedTime / 60);
    let elapsedSeconds = this.state.elapsedTime - elapsedMinutes * 60;

    let showElapsed =
      this.str_pad_left(elapsedMinutes, "0", 2) +
      ":" +
      this.str_pad_left(elapsedSeconds, "0", 2);

    return (
      <div>
        <button
          className="icon-btn"
          id="icon-timer"
          onClick={this.pauseTimer}
          key={this.state.timerOn} // to force a re-render
        >
          <i className="fas fa-stopwatch"></i>
          {"  "}
          {this.state.timerOn ? (
            <i className="fas fa-pause" />
          ) : (
            <i className="fas fa-play" />
          )}{" "}
          {showElapsed}
        </button>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    subscriptions: state.subscriptions,
    studentHistory: state.studentHistory,
    elapsedTime: state.elapsedTime,
    currentQuestion: state.currentQuestion
  };
};

export default connect(mapStateToProps)(QTimer);
