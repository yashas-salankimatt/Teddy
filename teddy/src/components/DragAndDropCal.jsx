import React, { useEffect, useState } from "react";
import { Calendar } from "react-big-calendar";
import localizer from "react-big-calendar/lib/localizers/moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  createEvent,
  getEventDoc,
  deleteEvent,
  updateEvent,
} from "../utils/CalendarDBConfig";
import moment from "moment";
import { auth, firestore } from "../utils/FirebaseConfig";
// import 'react-big-calendar/lib/sass/styles.scss';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarView.css";
import {
  getEvents,
  insertGoogleEvent,
  attemptGoogleInsert,
  fetchGoogleData,
  updateGoogleEvent,
  deleteGoogleEvent,
  deleteTeddyGCalEvents,
  updateGoogleEvents,
} from "./CalendarWrapper";

const momentLocalizer = localizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function CalendarView(props) {
  const user = auth.currentUser;
  const [events, setEvents] = useState([]);
  const [previousEvents, setPreviousEvents] = useState([]);
  const [teddyCalendarId, setTeddyCalendarId] = useState(null);
  const [googleEvents, setGoogleEvents] = useState([]);

  //============ Functions to Run on Mount ============================

  /*getTeddyCalId: gets the Google Calendar ID of the "Teddy Calendar"
    for a user.
  */
  const getTeddyCalId = async () => {
    try {
      const calendarPrefsDocs = await firestore
      .collection("users")
      .doc(user.uid)
      .collection("prefs").doc("calendarPrefs").get();
      console.log("setting TeddyCalId from getTCI", calendarPrefsDocs.data().teddyCalendarId);
      setTeddyCalendarId(calendarPrefsDocs.data().teddyCalendarId);
      console.log("Did it Change? ", teddyCalendarId);
    } catch (error) {
      console.log(error);
      attemptPopulate();
    }
  };

  // this code doesn't run correctly after just refreshing it
  async function populate() {
    if (auth.currentUser !== null && window.gapi.client.calendar) {
        console.log("Populating...");
      // either retrieve or create the Teddy Calendar
      var response = await window.gapi.client.calendar.calendarList.list({});
      var tempCalendarItems = response.result.items;
      var teddyCalExists = false;
      tempCalendarItems.forEach((calendar) => {
        if (calendar.summary === `Teddy ${auth.currentUser.displayName}`) {
          teddyCalExists = true;
          setTeddyCalendarId(calendar.id);
          console.log("TeddyCalId from populate: ",teddyCalendarId);
          firestore
            .collection("users")
            .doc(user.uid)
            .collection("prefs").doc("calendarPrefs").update({
            teddyCalendarId,
          });
        }
      });

      if (teddyCalExists === false) {
        await window.gapi.client.calendar.calendars.insert({
          resource: {
            summary: `Teddy ${auth.currentUser.displayName}`,
          },
        });
      }

      // call getEvents to set events.
      var tempEvents = await getEvents();
      if (tempEvents.length > 0) {
        console.log("setting events from populate");
        setEvents(tempEvents);
      }

      var teddyCalEvents = tempEvents.filter(
        (tempEvent) => tempEvent.calendarId === teddyCalendarId
      );
      console.log("setting teddyCalEvents");
      setGoogleEvents(teddyCalEvents);
    }else{
        //TODO: do we ever get here? if not, why have the inital if statement?
    }
    if (teddyCalendarId) {
      console.log("fetching google data");
      fetchGoogleData(teddyCalendarId, setGoogleEvents);
    }
  }

  //Modifier on Populate; only called on mount.
  function attemptPopulate() {
    if (window.gapi.client.calendar === undefined) {
      setTimeout(attemptPopulate, 500);
      return;
    }
    populate();
  }


  async function fetchFirestoreEvents() {
    //const user = auth.currentUser;
    try {
      const snapshot = await firestore
        .collection("users")
        .doc(user.uid)
        .collection("calendar")
        .get();
      if (snapshot.empty) {
        console.log("No events for this user");
        return;
      }
      var tempEvents = events.concat();
      snapshot.forEach(async (event) => {
        console.log(event);
        tempEvents.push({
          id: event.id,
          title: event.data().eventName,
          plannedstart: event.data().plannedStartTime.toDate(),
          plannedend: event.data().plannedEndTime.toDate(),
          start: event.data().workingStartTime.toDate(),
          end: event.data().workingEndTime.toDate(),
        });
      });
      setPreviousEvents(tempEvents);
      setEvents(tempEvents);
      // setCatState(categories.map((cat) => cat.categoryID));
      // console.log(categories);
      // console.log(catState);
    } catch (error) {
      console.log("Error in trying to get data from DB on mount");
      console.log(error);
    }
  }

  //TODO:
  function updateEvents() {
    // go through all events and update or delete for changes
    previousEvents.forEach((previousEvent) => {
      var isFound = false;
      events.forEach((event) => {
        if (previousEvent.id === event.id) {
          isFound = true;
          if (
            !(
              previousEvent.title === event.title &&
              previousEvent.start === event.start &&
              previousEvent.end === event.end
            )
          ) {
            console.log("Updating event: ", event.title);
            updateEvent({
              event: event,
              eventName: event.title,
              eventID: event.id,
            });
          }
        }
      });
      //delete old events that no longer exist in present
      if (!isFound) {
        console.log("Deleting event");
        deleteEvent({
          eventName: previousEvent.title,
          eventID: previousEvent.id,
        });
      }
    });

    //if there are new events, then get the eventDoc
    events.forEach(async (event) => {
      var isFound = false;
      previousEvents.forEach((previousEvent) => {
        if (previousEvent.id === event.id) {
          isFound = true;
        }
      });

      if (!isFound) {
        console.log("Adding Event");
        //TODO: Figure out when this function is called so we
        const eventID = await createEvent({
          eventName: event.title,
          plannedStartTime: event.plannedstart,
          plannedEndTime: event.plannedend,
          workingStartTime: event.start,
          workingEndTime: event.end,
        });
        console.log("Added event: ", eventID);

        const newEvent = {
          id: eventID,
          title: event.title,
          start: event.start,
          end: event.end,
          plannedStartTime: event.plannedStartTime,
          plannedEndTime: event.plannedEndTime,
        };

        //update events with new event
        console.log("Added new event");
        console.log(newEvent);
        const tempEvents = previousEvents.concat();
        tempEvents.push(newEvent);
        console.log("Update Both Events to this ", tempEvents);
        setPreviousEvents(tempEvents);
        setEvents(tempEvents);
        console.log("New Previous ", previousEvents);
        console.log("New Events ", events);
      }
    });
  }

  //========================useEffect hooks========================================

  // on mount, set Events, find the Teddy Calendar, try to populate the local calendar, and
  useEffect(() => {
    console.log("Mounting...");
    //setEvents([]);
    getTeddyCalId();
    attemptPopulate();
    fetchFirestoreEvents();
    //setGoogleEvents([]);
  }, []);

  // on events change
  useEffect(() => {
    console.log("Events changed: ",events);
    updateEvents();
    //updateGoogleEvents(events, googleEvents, teddyCalendarId, setGoogleEvents);

    if (googleEvents.length > 0) {
      console.log("We have google events to update, let's update them");
      updateGoogleEvents(
        events,
        googleEvents,
        teddyCalendarId,
        setGoogleEvents
      );
    }
  }, [events]);

  //on googleEvents change
  useEffect(() => {
    console.log("Google Events Changed");
    console.log("Events: ", events);
    console.log("GoogleEvents: ",googleEvents);
  }, [googleEvents]);

  // on teddyCalendarId change
  useEffect(() => {
    if (teddyCalendarId) {
      fetchGoogleData(teddyCalendarId, setGoogleEvents);
    }
  }, [teddyCalendarId]);

  //================DragAndDropCalendar methods=========================

  // onEventResize, edit state to reflect resized Event
  const onEventResize = ({ event, start, end }) => {
    console.log({ event, start, end });

    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    setPreviousEvents(events);
    setEvents(nextEvents);
  };

  const onEventDrop = ({ event, start, end }) => {
    console.log({ event, start, end });

    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    setPreviousEvents(events);
    setEvents(nextEvents);
  };

  const onSelectEvent = ({ event, start, end }) => {
    const remove = window.confirm("Would you like to remove this event?");
    if (remove === true) {
      const nextEvents = [...events];
      const idx = nextEvents.indexOf(event);
      nextEvents.splice(idx, 1);
      setPreviousEvents(events);
      setEvents(nextEvents);
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    var backgroundColor = event.hexColor;
    var style = {
      backgroundColor: backgroundColor,
      borderRadius: "0px",
      opacity: 0.8,
      color: "black",
      border: "0px",
      display: "block",
    };
    return {
      style: style,
    };
  };

  const onAddEvent = () => {
    var randInt = Math.floor(Math.random() * 5);
    var randInt2 = Math.floor(Math.random() * 3) + 1;
    var randInt3 = Math.floor(Math.random() * 100000) + 1;
    var startTime = new Date(
      new Date().setHours(new Date().getHours() + randInt)
    );
    var endTime = new Date(
      new Date().setHours(new Date().getHours() + randInt + randInt2)
    );
    var tempEvents = events.concat();
    tempEvents.push({
      calendarId: teddyCalendarId,
      title: "Right Now - #" + randInt3,
      start: startTime,
      end: endTime,
      isTodo: true,
    });
    //TODO: Add new event to firestore
    setPreviousEvents(events);
    setEvents(tempEvents);
    console.log(events);
    console.log("added event");
  };

  //============Return=========

  return (
    <div className="ParentView">
      <h2>Calendar</h2>
      <button className="btn btn-secondary" onClick={() => onAddEvent}>
        Add event
      </button>
      <button
        className="btn btn-secondary m-1"
        onClick={async () => {
          populate();
        }}
      >
        Populate Cal
      </button>
      <div className="ScrollView">
        <DnDCalendar
          localizer={momentLocalizer}
          events={events}
          defaultView="day"
          views={["week", "day", "agenda"]}
          resizable
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventStyleGetter}
        />
      </div>
    </div>
  );
}

export default CalendarView;
