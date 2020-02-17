import React, { Component } from "react";
import { connect } from "react-redux";

class CourseSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { revealFilter: false };
  }

  /*
  allCriteria = Object.keys(this.props.brickSearchObj);
  dimensionsCriteria = this.allCriteria.filter(criterion =>
    criterion.includes("dimensions_")
  );
  colorCriteria = this.allCriteria.filter(criterion =>
    criterion.includes("color_")
  );
  depthCriteria = this.allCriteria.filter(criterion =>
    criterion.includes("depth_")
  );
  */

  title = "Shop Courses";

  capitalize = word => {
    return word[0].toUpperCase() + word.substr(1);
  };

  showFilter = () => {
    this.setState({ revealFilter: !this.state.revealFilter });
  };

  handleChange = evt => {
    this.props.dispatch({
      type: "UPDATE-BRICKSEARCH-OBJ",
      payload: { criterion: evt.target.name, checked: evt.target.checked }
    });
  };

  handleChangeAll = (evt, whichCriterion) => {
    let whichCriteria = this.allCriteria.filter(criterion =>
      criterion.includes(whichCriterion)
    );

    let whichCriteriaAllTrue = whichCriteria.every(
      criterion => this.props.brickSearchObj[criterion] === true
    );
    evt.target.checked = !whichCriteriaAllTrue;
    console.log(whichCriteriaAllTrue);
    whichCriteria.forEach(criterion => {
      this.props.dispatch({
        type: "UPDATE-BRICKSEARCH-OBJ",
        payload: {
          criterion: criterion,
          checked: whichCriteriaAllTrue ? false : true
        }
      });
    });
  };

  render = () => {
    return (
      <div className="main-container">
        <div>
          <h2 className="no-margin" className="inline">
            {this.title}
          </h2>
          <span>
            <button id="filter-button" type="button" onClick={this.showFilter}>
              {this.state.revealFilter ? "HIDE FILTER" : "SHOW FILTER"}
            </button>
          </span>
        </div>
        {this.state.revealFilter && (
          <div className="criteria-container">
            <div className="criterion-container">
              <h4 className="no-margin">Dimensions</h4>
              <input
                type="button"
                onClick={evt => this.handleChangeAll(evt, "dimensions_")}
                value="Select All"
              />
              <br />
              <>
                {this.dimensionsCriteria.map(criterion => {
                  return (
                    <div key={criterion}>
                      <input
                        type="checkbox"
                        name={criterion}
                        onChange={this.handleChange}
                        checked={this.props.brickSearchObj[criterion]}
                      />
                      {this.capitalize(criterion.replace("dimensions_", ""))}
                    </div>
                  );
                })}
              </>
            </div>
            <div className="criterion-container">
              <h4 className="no-margin">Color</h4>
              <input
                type="button"
                onClick={evt => this.handleChangeAll(evt, "color_")}
                value="Select All"
              />
              <br />
              <>
                {this.colorCriteria.map(criterion => {
                  return (
                    <div key={criterion}>
                      <input
                        type="checkbox"
                        name={criterion}
                        onChange={this.handleChange}
                        checked={this.props.brickSearchObj[criterion]}
                      />
                      {this.capitalize(criterion.replace("color_", ""))}
                    </div>
                  );
                })}
              </>
            </div>
            <div className="criterion-container">
              <h4 className="no-margin">Depth</h4>
              <input
                type="button"
                onClick={evt => this.handleChangeAll(evt, "depth_")}
                value="Select All"
              />
              <br />

              <>
                {this.depthCriteria.map(criterion => {
                  return (
                    <div key={criterion}>
                      <input
                        type="checkbox"
                        name={criterion}
                        onChange={this.handleChange}
                        checked={this.props.brickSearchObj[criterion]}
                      />
                      {this.capitalize(criterion.replace("depth_", ""))}
                    </div>
                  );
                })}
              </>
            </div>
          </div>
        )}
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    //
  };
};
export default connect(mapStateToProps)(CourseSearch);
