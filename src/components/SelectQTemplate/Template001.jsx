import React, { Component } from "react";
import { connect } from "react-redux";

class Template001 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: this.props.currentQuestion.response_submitted
    };
  }

  componentDidMount = () => {
    console.log("MOUNT Template001");
  };

  componentDidUpdate = () => {
    console.log("UPDATE Template001");
    console.log(this.props.currentQuestion);
  };

  currentQuestionStart = JSON.parse(JSON.stringify(this.props.currentQuestion));
  response_correct = this.props.currentQuestion.response_correct;
  courseCode = this.props.currentQuestion.courseCode;

  handleOptionChange = changeEvent => {
    console.log(changeEvent.target.value);
    this.setState({
      selectedOption: changeEvent.target.value
    });
  };

  submitHandler = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    console.log("answer submitted");
    const isCorrect = this.state.selectedOption === this.response_correct;
    console.log("You have submitted:", this.state.selectedOption);
    console.log("correct?: " + isCorrect);

    // submit answer
    // update current question
    // update student history with that current question

    let currentQuestionUpdate = JSON.parse(
      JSON.stringify(this.currentQuestionStart)
    );

    currentQuestionUpdate.response_submitted = this.state.selectedOption;
    currentQuestionUpdate.elapsedTime = this.props.elapsedTime;
    currentQuestionUpdate.dateStamp = new Date().toLocaleString();
    currentQuestionUpdate.complete = true;

    console.log("step 2");

    let studentHistoryCopy = JSON.parse(
      JSON.stringify(this.props.studentHistory)
    );
    console.log("step 3");
    console.log(this.props.studentHistory);
    console.log(this.courseCode);
    console.log(this.props.studentHistory[this.courseCode]);
    console.log(this.props.currentQuestion);

    const currentQuestionIndex = this.props.studentHistory[
      this.courseCode
    ].findIndex(question => {
      console.log(question.qNum);
      console.log(this.props.currentQuestion.qNum);
      console.log(question.qNum === this.props.currentQuestion.qNum);
      return question.qNum === this.props.currentQuestion.qNum;
    });
    console.log("step 4");
    console.log(this.courseCode);
    console.log(currentQuestionIndex);
    console.log(studentHistoryCopy[this.courseCode][currentQuestionIndex]);
    console.log(currentQuestionUpdate);

    studentHistoryCopy[this.courseCode][
      currentQuestionIndex
    ] = currentQuestionUpdate;
    console.log(
      studentHistoryCopy[this.courseCode.toString()][currentQuestionIndex]
    );
    console.log("studentHistoryCopy is now : ");
    console.log(studentHistoryCopy);
    console.log("step 5");
    console.log("SET-STUDENTHISTORY-AND-CURRENT-Q");
    this.props.dispatch({
      type: "SET-STUDENTHISTORY-AND-CURRENT-Q",
      payload: {
        studentHistoryCopy: studentHistoryCopy,
        currentQuestion: currentQuestionUpdate
      }
    });
  };

  skipQuestion = formSubmitEvent => {
    formSubmitEvent.preventDefault();
    const isCorrect = undefined;
    console.log("You have skipped quesiton");
    this.props.dispatch({
      type: "UPDATE-STUDENT-HISTORY",
      payload: {
        studentHistory: this.props.studentHistory,
        newHistoryItem: {
          questionCode: this.props.qNumber,
          responseCorrect: undefined,
          elapsedTime: this.props.elapsedTime,
          dateStamp: new Date().toLocaleString(),
          complete: false
        }
      }
    });

    this.props.dispatch({
      type: "SET-NEXT-QUESTION",
      payload: {
        previousQ: this.props.qNumber,
        questionVec: this.props.questionVec
      }
    });

    this.props.rD.history.push(
      "/answer-submitted/" + this.props.qNumber + "/" + isCorrect
    );
  };

  render = () => {
    console.log("rD");
    console.log(this.props.rD);
    console.log(this.props.currentQuestion.response_correct);
    const {
      question,
      response_a,
      response_b,
      response_c,
      response_correct,
      complete,
      skipped,
      response_submitted
    } = this.props.currentQuestion;

    return (
      <div className="question template">
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
          <input type="submit" />
        </form>
        <br />
        {!complete ? (
          <form onSubmit={this.skipQuestion}>
            <button>Skip Question</button>
          </form>
        ) : (
          <div />
        )}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    subscriptions: state.subscriptions,
    studentHistory: state.studentHistory,
    currentQuestion: state.currentQuestion,
    elapsedTime: state.elapsedTime
  };
};

export default connect(mapStateToProps)(Template001);
