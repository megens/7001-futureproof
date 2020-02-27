import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class CourseRun extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    console.log("courseRun");

    return (
      <div>
        Material to Cover
        {/*
        {chapterList.map(chapter => {
          return <div>chapter : {<input type="checkbox" />}</div>;
        })}
        */}
        <Link to="/question/001">
          <button>Ask me a question</button>
        </Link>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    username: state.username,
    purchaseItem: state.purchaseItem,
    courseList: state.courseList,
    courseHistory: state.courseHistory
  };
};

export default connect(mapStateToProps)(CourseRun);
