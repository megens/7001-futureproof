import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Course extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = evt => {
    responseSubmitted = evt.target.name;
  };

  render = () => {
    const question = "How many ways are there to skin a cat?";
    const response_a = "one";
    const response_b = "more than one";
    const response_c = "i don't know";
    const response_correct = "checkbox_b";

    <input
      type="checkbox"
      name={criterion}
      onChange={this.handleChange}
      checked={this.props.brickSearchObj[criterion]}
    />;

    return (
      <div className="question template">
        <input type="checkbox" name="checkbox_a" onChange={this.handleChange} />
        {response_a}
        <input type="checkbox" name="checkbox_b" onChange={this.handleChange} />
        {response_b}
        <input type="checkbox" name="checkbox_c" onChange={this.handleChange} />
        {response_c}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    subscriptions: state.subscriptions,
    currentCourseRun: state.currentCourseRun
  };
};

export default connect(mapStateToProps)(Course);
