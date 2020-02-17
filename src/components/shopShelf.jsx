import React, { Component } from "react";
import CourseSearch from "./CourseSearch.jsx";
import CourseSearchResults from "./CourseSearchResults.jsx";

class CourseShelf extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <>
        <CourseSearch />
        <CourseSearchResults />
      </>
    );
  };
}

export default CourseShelf;
