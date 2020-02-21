import React, { Component } from "react";
import CourseSearch from "../CourseSearch/CourseSearch.jsx";
import CourseSearchResults from "../CourseSearchResults/CourseSearchResults.jsx";

class CourseShelf extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <>
        <CourseSearch />
        <CourseSearchResults rD={this.props.rD} />
      </>
    );
  };
}

export default CourseShelf;
