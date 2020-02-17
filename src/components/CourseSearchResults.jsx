import React, { Component } from "react";
import { connect } from "react-redux";
import Course from "./Course.jsx";

class CourseSearchResults extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.updateInventory();
    this.checkInterval = setInterval(this.updateInventory, 60000); // checks database every xxx milliseconds ... every minute
  };

  componentWillUnmount = () => {
    clearInterval(this.checkInterval); // NB to stop the checkinterval running forever while away
  };

  updateInventory = async () => {
    let response = await fetch("/all-courses");
    let body = await response.text();
    console.log("/all-courses response");
    //console.log(body);
    let parsed = JSON.parse(body);
    this.props.dispatch({
      type: "LOAD-COURSES",
      payload: { courseList: parsed } // array of course objects
    });
  };

  render = () => {
    console.log(this.props.courseList);
    let filteredCourses = this.props.courseList.filter(course => {
      return true; // no filter for now
    });

    return (
      <>
        <div className="main-container" id="courseSearchResults">
          <div className="items-container">
            {filteredCourses.map(course => (
              <Course key={course._id} course={course} rD={this.props.rD} />
            ))}
          </div>
        </div>
      </>
    );
  };
}
const mapStateToProps = state => {
  return {
    courseList: state.courseList
  };
};

export default connect(mapStateToProps)(CourseSearchResults);
