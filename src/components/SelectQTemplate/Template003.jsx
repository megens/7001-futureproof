import React, { Component } from "react";
import { connect } from "react-redux";
const deepCopy = require("rfdc")(); // a really fast deep copy function

class Template003 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.currentQuestion.response_submitted,
    };
  }
  /// MAKE THIS WORK FOR A VARIABLE NUMBER OF POSSIBLE ANSWERS, UP TO SAY 10, JUST IN CASE ... S/B EASY

  componentDidMount = () => {
    console.log("MOUNT Template003");
    console.log(this.props.currentQuestion);
  };

  componentDidUpdate = () => {
    console.log("UPDATE Template003");
  };

  componentWillUnmount = () => {
    console.log("UNMOUNT Template003");
    const currentQuestion = this.props.currentQuestion;
    const qNumber = currentQuestion.qNum;
    if (!(currentQuestion.complete || currentQuestion.skipped)) {
      let liveStudentHistoryCopy = deepCopy(this.props.liveStudentHistory);
      const indexOfQ = liveStudentHistoryCopy.findIndex((question) => {
        return question.qNum === qNumber;
      });
      liveStudentHistoryCopy.splice(indexOfQ, 1); // remove q from history if not complete
      let studentHistoryCopy = deepCopy(this.props.studentHistory);
      studentHistoryCopy[
        this.props.liveCourse.courseCode
      ] = liveStudentHistoryCopy;
      console.log("about to dispatch UPDATE-STUDENT-HISTORY");
      this.props.dispatch({
        type: "UPDATE-STUDENT-HISTORY",
        payload: {
          liveStudentHistory: liveStudentHistoryCopy,
          studentHistory: studentHistoryCopy,
          currentQuestion: currentQuestion, // keep the same. will overwrite if going to Settings
        },
      });
      console.log("ok");
    }
  };

  currentQuestionOptions = Object.keys(this.props.currentQuestion).filter(
    (x) => {
      return (
        x.includes("response_") &&
        !(x === "response_correct") &&
        !(x === "response_submitted")
      );
    }
  );

  defaultResponse = "N".repeat(this.currentQuestionOptions.length); // a series of "NNN" of length corresponding to number of poss responses

  handleChange = (changeEvent, idx) => {
    console.log("option " + changeEvent.target.checked);
    let currentQuestion = this.props.currentQuestion;
    if (!currentQuestion.complete && !currentQuestion.skipped) {
      let replacement = changeEvent.target.checked ? "Y" : "N";
      let prevSelectedOption =
        this.state.selectedOption.slice(0, idx) +
        replacement +
        this.state.selectedOption.slice(idx + 1);
      console.log(prevSelectedOption);
      console.log("idx " + idx);

      console.log(prevSelectedOption);
      this.setState({ selectedOption: prevSelectedOption });
    } else {
      console.log(
        "not changing " + currentQuestion.complete + currentQuestion.skipped
      );
    }
  };

  handleOptionChange = (changeEvent) => {
    console.log("option " + changeEvent.target.value);
    let currentQuestion = this.props.currentQuestion;
    if (!currentQuestion.complete && !currentQuestion.skipped) {
      console.log("changing state selectedOption " + changeEvent.target.value);
      this.setState({
        selectedOption: changeEvent.target.value,
      });
    } else {
      console.log(
        "not changing " + currentQuestion.complete + currentQuestion.skipped
      );
      this.setState({
        selectedOption: undefined,
      });
    }
  };

  commonUpdateSubmit = (currentQuestionUpdate) => {
    //
    const courseCode = this.props.currentQuestion.courseCode;
    let liveStudentHistoryCopy = deepCopy(this.props.liveStudentHistory);
    const currentQuestionIndex = liveStudentHistoryCopy.findIndex(
      (question) => {
        console.log(question.qNum);
        console.log(this.props.currentQuestion.qNum);
        console.log(question.qNum === this.props.currentQuestion.qNum);
        return question.qNum === this.props.currentQuestion.qNum;
      }
    );
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
    console.log("1");
    console.log(this.props.liveAllResponses);
    let liveAllResponsesCopy = this.props.liveAllResponses.slice();
    console.log("2");
    liveAllResponsesCopy.push(currentQuestionUpdate);
    console.log("3");
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
        body: data,
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
        liveAllResponses: liveAllResponsesCopy,
      },
    });
  };

  submitHandler = (formSubmitEvent) => {
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

  skipQuestion = (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    this.setState({
      selectedOption: this.defaultResponse, // "NNNNN"
    });
    console.log("answer skipped");
    let currentQuestionUpdate = deepCopy(this.currentQuestionStart);
    currentQuestionUpdate.response_submitted = this.defaultResponse; // "NNNNN"
    currentQuestionUpdate.elapsedTime = this.props.elapsedTime;
    currentQuestionUpdate.dateStamp = new Date().toLocaleString();
    currentQuestionUpdate.complete = false;
    currentQuestionUpdate.skipped = true;
    this.commonUpdateSubmit(currentQuestionUpdate);
  };

  unSkipQuestion = (formSubmitEvent) => {
    formSubmitEvent.preventDefault();
    this.setState({
      selectedOption: this.defaultResponse, // "NNNNN"
    });
    console.log("answer UNskipped");
    let currentQuestionUpdate = deepCopy(this.currentQuestionStart);
    //currentQuestionUpdate.elapsedTime = 0; // let it continue counting without a reset
    currentQuestionUpdate.dateStamp = undefined;
    currentQuestionUpdate.complete = false;
    currentQuestionUpdate.skipped = false;
    (currentQuestionUpdate.response_submitted = this.defaultResponse), // "NNNNN"
      this.commonUpdateSubmit(currentQuestionUpdate);

    this.props.dispatch({
      type: "SET-TIMER-ON",
      payload: { timerOn: true },
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
      response_d,
      response_e,
      response_correct,
      complete,
      skipped,
      response_submitted,
      courseCode,
      chapter,
    } = this.props.currentQuestion;

    return (
      <div className="question-template">
        <form onSubmit={this.submitHandler}>
          <b>{question}</b>
          <br />
          <br />

          {this.currentQuestionOptions.map((option) => {
            const letter = option[option.length - 1];
            const idx = "abcdefghij".indexOf(letter);
            return (
              <div key={option}>
                <input
                  type="checkbox"
                  name={option}
                  onChange={(evt) => this.handleChange(evt, idx)}
                  checked={
                    complete
                      ? response_submitted[idx] === "Y"
                      : this.state.selectedOption[idx] === "Y"
                  }
                />
                {" " + this.props.currentQuestion[option]}
              </div>
            );
          })}
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

const mapStateToProps = (state) => {
  return {
    username: state.username,
    currentQuestion: state.currentQuestion,
    currentQuestionUpdate: state.currentQuestionUpdate,
    elapsedTime: state.elapsedTime,
    studentHistory: state.studentHistory,
    liveStudentHistory: state.liveStudentHistory,
    liveCourse: state.liveCourse,
    liveAllResponses: state.liveAllResponses,
    subscribedAllResponses: state.subscribedAllResponses,
    timerOn: state.timerOn,
  };
};

export default connect(mapStateToProps)(Template003);
