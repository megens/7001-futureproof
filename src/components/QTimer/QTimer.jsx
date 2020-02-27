import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class QTimer extends Component {
  constructor(props) {
    super(props);

    this.state = { elapsedTime: 0, timerOn: true };
  }

  componentDidMount = () => {
    this.startTime = new Date().toLocaleString();
    this.tickInterval = 1000;
    this.intervalID = setInterval(this.tick, this.tickInterval);
  };

  componentWillUnmount = () => {
    clearInterval(this.intervalID);
  };

  tick = () => {
    //console.log("tick");
    if (this.state.timerOn) {
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
        Elapsed Time is {showElapsed}
        <button type="button" onClick={this.pauseTimer}>
          {this.state.timerOn ? "Pause Timer" : "Start Timer"}
        </button>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    courseHistory: state.courseHistory,
    studentHistory: state.studentHistory
  };
};

export default connect(mapStateToProps)(QTimer);
