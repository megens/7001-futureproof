import React, { Component } from "react";
import { connect } from "react-redux";
const deepCopy = require("rfdc")(); // a really fast deep copy function

class Template001 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.currentQuestion.response_submitted
    };
  }

  componentDidMount = () => {
    console.log("MOUNT Template001");
    console.log(this.props.currentQuestion);
  };

  componentDidUpdate = () => {
    console.log("UPDATE Template001");
  };

  componentWillUnmount = () => {
    // this will record elapsedTime, but otherwise leave currentQuestion open
    if (
      !this.props.currentQuestion.complete ||
      !this.props.currentQuestion.skipped
    ) {
      // this.leaveOpen();
    }
  };

  handleOptionChange = changeEvent => {
    console.log("option " + changeEvent.target.value);
    let currentQuestion = this.props.currentQuestion;
    if (!currentQuestion.complete && !currentQuestion.skipped) {
      console.log("changing state selectedOption " + changeEvent.target.value);
      this.setState({
        selectedOption: changeEvent.target.value
      });
    } else {
      console.log(
        "not changing " + currentQuestion.complete + currentQuestion.skipped
      );
      this.setState({
        selectedOption: undefined
      });
    }
  };

  commonUpdateSubmit = currentQuestionUpdate => {
    //
    const courseCode = this.props.currentQuestion.courseCode;
    let liveStudentHistoryCopy = deepCopy(this.props.liveStudentHistory);
    const currentQuestionIndex = liveStudentHistoryCopy.findIndex(question => {
      console.log(question.qNum);
      console.log(this.props.currentQuestion.qNum);
      console.log(question.qNum === this.props.currentQuestion.qNum);
      return question.qNum === this.props.currentQuestion.qNum;
    });
    console.log("currentQuestionIndex: " + currentQuestionIndex);
    console.log("step 4");
    console.log(courseCode);
    console.log(currentQuestionIndex);
    console.log(liveStudentHistoryCopy[currentQuestionIndex]);
    liveStudentHistoryCopy[currentQuestionIndex] = currentQuestionUpdate;

    console.log(liveStudentHistoryCopy[currentQuestionIndex]);
    console.log("liveStudentHistoryCopy is now : ");
    console.log(liveStudentHistoryCopy);
    console.log(liveStudentHistoryCopy.length);

    let subscribedAllResponsesCopy = deepCopy(
      this.props.subscribedAllResponses
    );
    let liveAllResponsesCopy = this.props.liveAllResponses.slice();
    liveAllResponsesCopy.push(currentQuestionUpdate);
    subscribedAllResponsesCopy[courseCode] = liveAllResponsesCopy;

    console.log("step 5");
    console.log("update on server");
    let studentHistoryCopy = deepCopy(this.props.studentHistory);

    const updateHistoryOnServer = async () => {
      console.log(
        "studentHistoryCopy and courseCode and studentHistoryCopy[courseCode]"
      );
      console.log(studentHistoryCopy);
      console.log(courseCode);
      console.log(studentHistoryCopy[courseCode]);
      studentHistoryCopy[courseCode] = liveStudentHistoryCopy;
      console.log("studentHistoryCopy is now ");
      console.log(studentHistoryCopy);

      let data = new FormData();
      data.append("username", this.props.username);
      data.append("courseCode", courseCode);
      data.append("studentHistory", JSON.stringify(studentHistoryCopy));
      data.append("currentQuestion", JSON.stringify(currentQuestionUpdate));
      let response = await fetch("/update-student-history", {
        method: "POST",
        body: data
      });
      let body = await response.text();
      let parsed = JSON.parse(body);
      console.log("completed history update?");
      console.log(parsed);
    };
    updateHistoryOnServer(); // To Do: in two places ... student and Overall

    console.log("step 6");
    console.log("ANSWER-SUBMITTED");
    console.log("studentHistoryCopy");
    console.log(studentHistoryCopy);
    this.props.dispatch({
      type: "ANSWER-SUBMITTED",
      payload: {
        liveStudentHistory: liveStudentHistoryCopy,
        studentHistory: studentHistoryCopy,
        currentQuestion: currentQuestionUpdate,
        subscribedAllResponses: subscribedAllResponsesCopy,
        liveAllResponses: liveAllResponsesCopy
      }
    });
  };

  submitHandler = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    console.log("answer submitted");
    console.log(
      "response_correct: " + this.props.currentQuestion.response_correct
    );
    console.log("submitted: " + this.state.selectedOption);

    console.log(
      "correct?: " + this.state.selectedOption ===
        this.props.currentQuestion.response_correct
    );

    let currentQuestionUpdate = deepCopy(this.currentQuestionStart);
    currentQuestionUpdate.response_submitted = this.state.selectedOption;
    currentQuestionUpdate.elapsedTime = this.props.elapsedTime;
    currentQuestionUpdate.dateStamp = new Date().toLocaleString();
    currentQuestionUpdate.complete = true;
    currentQuestionUpdate.skipped = false;

    this.commonUpdateSubmit(currentQuestionUpdate);
  };

  skipQuestion = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    this.setState({
      selectedOption: undefined
    });
    console.log("answer skipped");
    let currentQuestionUpdate = deepCopy(this.currentQuestionStart);
    currentQuestionUpdate.response_submitted = undefined;
    currentQuestionUpdate.elapsedTime = this.props.elapsedTime;
    currentQuestionUpdate.dateStamp = new Date().toLocaleString();
    currentQuestionUpdate.complete = false;
    currentQuestionUpdate.skipped = true;
    this.commonUpdateSubmit(currentQuestionUpdate);
  };

  unSkipQuestion = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    this.setState({
      selectedOption: undefined
    });
    console.log("answer UNskipped");
    let currentQuestionUpdate = deepCopy(this.currentQuestionStart);
    currentQuestionUpdate.response_submitted = undefined;
    //currentQuestionUpdate.elapsedTime = 0; // let it continue counting without a reset
    currentQuestionUpdate.dateStamp = undefined;
    currentQuestionUpdate.complete = false;
    currentQuestionUpdate.skipped = false;
    this.commonUpdateSubmit(currentQuestionUpdate);

    this.props.dispatch({
      type: "SET-TIMER-ON",
      payload: { timerOn: true }
    });
  };

  render = () => {
    this.currentQuestionStart = JSON.parse(
      JSON.stringify(this.props.currentQuestion)
    );
    this.currentQuestionStart.username = this.props.username;
    const {
      question,
      response_a,
      response_b,
      response_c,
      response_correct,
      complete,
      skipped,
      response_submitted,
      courseCode,
      chapter
    } = this.props.currentQuestion;

    return (
      <div className="question-template">
        <form onSubmit={this.submitHandler}>
          <b>{question}</b>
          <br />
          <input
            type="radio"
            id="a"
            name="question"
            className="form-check-input"
            checked={
              complete
                ? response_submitted === "a"
                : this.state.selectedOption === "a"
            }
            onChange={this.handleOptionChange}
            value="a"
          />
          <label> {response_a}</label>
          <br />
          <input
            type="radio"
            id="b"
            name="question"
            className="form-check-input"
            checked={
              complete
                ? response_submitted === "b"
                : this.state.selectedOption === "b"
            }
            onChange={this.handleOptionChange}
            value="b"
          />
          <label> {response_b}</label>
          <br />
          <input
            type="radio"
            id="c"
            name="question"
            className="form-check-input"
            checked={
              complete
                ? response_submitted === "c"
                : this.state.selectedOption === "c"
            }
            onChange={this.handleOptionChange}
            value="c"
          />
          <label> {response_c}</label>
          <br />
          {!complete && !skipped ? (
            <button type="submit" className="icon-btn long">
              {" "}
              <i className="fas fa-check"></i>
              <span> Submit</span>
            </button>
          ) : (
            ""
          )}
        </form>

        {!complete && !skipped ? (
          <form onSubmit={this.skipQuestion}>
            <button type="submit" className="icon-btn long">
              {" "}
              <i className="fas fa-forward"></i>
              <span> Skip Q</span>
            </button>
          </form>
        ) : (
          ""
        )}

        <br />
        {skipped ? (
          <button className="icon-btn short" onClick={this.unSkipQuestion}>
            <i className="fas fa-redo"></i> ReTry
          </button>
        ) : (
          ""
        )}

        <br />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    username: state.username,
    currentQuestion: state.currentQuestion,
    currentQuestionUpdate: state.currentQuestionUpdate,
    elapsedTime: state.elapsedTime,
    studentHistory: state.studentHistory,
    liveStudentHistory: state.liveStudentHistory,
    liveCourseQuestions: state.liveCourseQuestions,
    liveAllResponses: state.liveAllResponses,
    subscribedAllResponses: state.subscribedAllResponses,
    timerOn: state.timerOn
  };
};

export default connect(mapStateToProps)(Template001);
