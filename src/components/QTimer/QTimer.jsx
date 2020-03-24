import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class QTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elapsedTime: this.props.currentQuestion.elapsedTime
    };
  }

  componentDidMount = () => {
    console.log("MOUNT QTimer");
    console.log(this.props.currentQuestion);
    this.intervalID = setInterval(this.tick, this.tickInterval);
    this.props.dispatch({
      type: "SET-TIMER-ON",
      payload: { timerOn: true }
    });
  };

  componentDidUpdate = () => {
    console.log("UPDATE QTimer");
  };

  componentWillUnmount = () => {
    console.log("UNMOUNT QTimer");
    clearInterval(this.intervalID);
    console.log(this.props.currentQuestion);
    /*this.props.dispatch({
      type: "SET-ANSWER-TIME",
      payload: this.state.elapsedTime
    });
    */
  };

  tickInterval = 1000;

  tick = () => {
    console.log("tick");

    if (
      this.props.timerOn &&
      !this.props.currentQuestion.complete &&
      !this.props.currentQuestion.skipped
    ) {
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
    console.log("switch timer to " + !this.props.timerOn);
    this.props.dispatch({
      type: "SET-TIMER-ON",
      payload: { timerOn: !this.props.timerOn }
    });
  };

  resetTimer = () => {
    console.log("reset timer");
    this.setState({ elapsedTime: 0 });
    this.props.dispatch({
      type: "SET-TIMER-ON",
      payload: { timerOn: true }
    });
  };

  str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };

  render = () => {
    let completeOrSkipped =
      this.props.currentQuestion.complete || this.props.currentQuestion.skipped;
    let elapsedMinutes = Math.floor(this.state.elapsedTime / 60);
    let elapsedSeconds = this.state.elapsedTime - elapsedMinutes * 60;

    let showElapsed =
      this.str_pad_left(elapsedMinutes, "0", 2) +
      ":" +
      this.str_pad_left(elapsedSeconds, "0", 2);

    return (
      <div>
        <button
          className="icon-btn long"
          id="icon-timer"
          onClick={completeOrSkipped ? null : this.pauseTimer}
          key={
            this.props.timerOn +
            " " +
            this.props.currentQuestion.complete +
            " " +
            this.props.currentQuestion.skipped +
            "button1"
          } // to force a re-render
        >
          <i className="fas fa-stopwatch"></i>
          {"  "}
          {completeOrSkipped ? (
            <i className="fas fa-stop" />
          ) : this.props.timerOn ? (
            <i className="fas fa-pause" />
          ) : (
            <i className="fas fa-play" />
          )}{" "}
          {showElapsed}
        </button>

        {!completeOrSkipped ? (
          <button
            className="icon-btn long"
            id="icon-timer"
            onClick={this.resetTimer}
            key={
              this.props.timerOn +
              " " +
              this.props.currentQuestion.complete +
              " " +
              this.props.currentQuestion.skipped +
              "button2"
            } // to force a re-render
          >
            {"  "}
            <i className="fas fa-history" /> Reset
          </button>
        ) : (
          ""
        )}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    elapsedTime: state.elapsedTime,
    currentQuestion: state.currentQuestion,
    timerOn: state.timerOn
  };
};

export default connect(mapStateToProps)(QTimer);
