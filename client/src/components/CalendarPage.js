import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import {
  fetchRoutines,
  scheduleWorkout,
  fetchAllWorkouts,
  deleteWorkout,
} from "../actions";
import "../less/calendarPage.css";

BigCalendar.momentLocalizer(moment);

class CalendarPage extends Component {
  state = {
    schedulingModal: false,
    checkboxModal: false
  };

  componentDidMount() {
    this.props.fetchRoutines();
    this.props.fetchAllWorkouts();
  }

  handleChange = e => {
    /* utilizing onChange inside <select> to grab Id of the routine being selected so it 
    can be sent as an argument to scheduleWorkout function */
    this.selectedRoutineValue = e.target.value;
    console.log(this.selectedRoutineValue);
    this.props.routines.map(routine => {
      if (this.selectedRoutineValue === routine.title) {
        return (this.selectedRoutineId = routine._id);
      }
    });
  };

  schedulingModalToggle = () => {
    this.setState({
      schedulingModal: !this.state.schedulingModal
    });
  };

  checkboxModalToggle = () => {
    this.setState({
      checkboxModal: !this.state.checkboxModal
    });
  };

  /* the selected in the parameter is an object leveraged by big-react-calendar. 
  It represents the date box which you click on on the calendar. */
  onSelectSlot = selected => {
    this.selectedSlotDate = selected.start;
    console.log("SELECTED DATE: " + this.selectedSlotDate);
    this.schedulingModalToggle();
  };

  onSelectEvent = selected => {
    
    this.selectedEventTitle = selected.title;
    this.selectedEventId = selected.id;
    this.selectedEventDate = selected.date;
    this.checkboxModalToggle();
  };

  scheduleWorkout = () => {
    this.props.scheduleWorkout(this.selectedRoutineId, this.selectedSlotDate);
    // this.selectedRoutineValue = "";
    this.selectedRoutineId = "";
    this.selectedSlotDate = "";
    this.schedulingModalToggle();
  };

  deleteWorkout = () => {
    this.props.deleteWorkout(this.selectedEventId);
    this.checkboxModalToggle();
  };

  events = [];
  selectedRoutineValue;
  selectedRoutineId;
  selectedSlotDate;
  
  selectedExercises;
  selectedEventId;
  selectedEventDate;
  selectedEventTitle;

  routine;
  exercise;


  render() {

    console.log(this.props.workouts)

    {
      this.events = this.props.workouts.map(workout => ({
        start: new Date(workout.date),
        end: new Date(workout.date),
        title: workout.routine.title,
        id: workout._id,
        exercises: workout.routine.exercises,
        performances: workout.performances
      }));
    }

    let allViews = Object.keys(BigCalendar.Views).map(
      k => BigCalendar.Views[k]
    );

    console.log(this.events);
    return (
      <React.Fragment>
        <div style={{ height: "500px", width: "90%" }}>
          <BigCalendar
            popup
            events={this.events}
            views={allViews}
            step={60}
            showMultiDayTimes
            defaultDate={new Date()}
            defaultView="month"
            style={{ height: "100vh" }}
            selectable={true}
            onSelectSlot={this.onSelectSlot}
            onSelectEvent={this.onSelectEvent}
          />
        </div>

        {/* Scheduling Modal */}

        <Modal
          isOpen={this.state.schedulingModal}
          toggle={this.schedulingModalToggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.schedulingModalToggle}>
            Schedule a Workout!
          </ModalHeader>
          <ModalBody>
            {/* Drop down for selecting a routine */}
            <div>Select Workout</div>
            <select
              value={this.state.selectedRoutineValue}
              onChange={this.handleChange}
            >
              <option value="select a routine">select a routine</option>
              {this.props.routines.map(routine => (
                <option key={routine._id} value={routine.title}>
                  {routine.title}
                </option>
              ))}
            </select>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.scheduleWorkout}>
              Schedule!
            </Button>{" "}
            <Button color="secondary" onClick={this.schedulingModalToggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* Checkbox Modal */}

        <Modal
          isOpen={this.state.checkboxModal}
          toggle={this.checkboxModalToggle}
          className={this.props.className}
        >
          <ModalHeader toggle={this.checkboxModalToggle}>
            {this.selectedEventTitle}
          </ModalHeader>
          <ModalBody>
          
              {console.log(this.props.routines)}
            
              
                {this.props.routines.map(
                  routine =>
                    routine.title === this.selectedEventTitle
                      ? //  routine.title === this.selectedEventTitle ? console.log("HURRAY") : console.log("GRRRRRR")
                        routine.exercises.map(exercise => (
                           <div key={exercise._id}>
                            <div style={{ display: "flex" }}>
                              <div style={{ color: "white" }}>
                                {exercise.name}
                              </div>
                              <input
                                type="checkbox"
                                style={{ marginLeft: "15px", marginTop: "5px" }}
                              />
                            </div>
                              {/* {this.events.map(event => event.performances.map(performance => performance.exercise == exercise._id ? 
                                <div key={performance._id} style={{ color: "white" }}>{performance.weight}{performance.sets}{performance.reps}</div> : null
                                 ))} */}
                            </div>
                        ))
                      : null
                )}
              

              {/* {this.routine = this.props.routines.filter(routine => routine.title == this.selectedEventTitle) || ""}
                {console.log("ROUTINE" + this.routine)}
                {this.routine.exercises.forEach(exercise => {
                    <div>
                    return <div>{exercise.name}</div> <input
                    onChange={console.log("checked")}
                    type="checkbox"
                    name={exercise.title}
                    value={exercise.title}
                  />
                  </div>
                } )} */}

              {/* <input
                onChange={console.log("checked")}
                type="checkbox"
                name="vehicle1"
                value="Bike"
              />
              <br />
              hi
              <input
                onChange={console.log("checked")}
                type="checkbox"
                name="vehicle2"
                value="Car"
              />
              <br />
              hello
              <input
                onChange={console.log("checked")}
                type="checkbox"
                name="vehicle3"
                value="Boat"
              />
              <br />
              bye */}
              
              
            
          </ModalBody>

          <ModalFooter>
            <Button color="secondary" onClick={this.checkboxModalToggle}>
              Cancel
            </Button>
            <Button color="danger" onClick={this.deleteWorkout}>
              Delete Workout
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  console.log(
    "At time of render, Calendar Page received this app state:",
    state
  );
  return {
    routines: state.calendar.routines,
    workouts: state.calendar.workouts
  };
};

export default connect(
  mapStateToProps,
  {
    fetchRoutines,
    scheduleWorkout,
    fetchAllWorkouts,
    deleteWorkout,
  }
)(CalendarPage);
