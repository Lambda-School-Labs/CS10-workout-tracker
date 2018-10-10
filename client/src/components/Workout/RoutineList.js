import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { fetchRoutines, selectRoutine } from "../../actions";
import { TimelineLite } from "gsap";

class RoutineList extends React.Component {
  constructor(props) {
    super(props);
    
    this.myTween = new TimelineLite({paused: true});
    this.myElements = [];
  }

  componentDidMount() {
    this.props.fetchRoutines();
    this.myTween.staggerTo(this.myElements, 0.5, {y: 0, autoAlpha: 1}, 0.1);
  }

  render() {
    const { currentRoutines } = this.props;
    console.log(currentRoutines);
    let routines = currentRoutines.map((routine, index) => {
      return (
        <div
          ref={div => this.myElements[index] = div}
          key={routine._id}
          className="routine"
          onClick={() => this.props.selectRoutine(routine._id)}
        >
          {routine.title}
        </div>
      );
    });

    return (
      <div className="routine__list">
        <div className="routine__list__container">
          <h2>YOUR ROUTINES</h2>
          {routines}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentRoutines: state.RoutineManager.routines
  };
};

RoutineList.propTypes = {
  currentRoutine: PropTypes.object,
  fetchRoutines: PropTypes.func,
  selectRoutine: PropTypes.func
};

export default connect(
  mapStateToProps,
  { fetchRoutines, selectRoutine }
)(RoutineList);
