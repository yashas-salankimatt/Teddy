import React, { useEffect, useState } from 'react';
import {Calendar} from 'react-big-calendar';
import localizer from 'react-big-calendar/lib/localizers/moment';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from 'moment';
import { auth, firestore } from '../utils/FirebaseConfig';
// import { createDate, createPlanned, createWorking, deletePlanned, deleteWorking, updatePlanned, updateWorking } from "../utils/CalendarDBConfig";
// import 'react-big-calendar/lib/sass/styles.scss';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './CalendarView.css';
import { getEvents } from './CalendarWrapper';

const momentLocalizer = localizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function CalendarView(props) {
    const [events, setEvents] = useState([]);
    const [previousEvents, setPreviousEvents] = useState([]);

    async function populate() {
        if (auth.currentUser !== null && window.gapi.client.calendar){
            var tempEvents = await getEvents();
            // console.log(tempEvents);
            if (tempEvents.length > 0){
                setEvents(tempEvents);
            }
        }
    }

    function attemptPopulate() {
        if (window.gapi.client.calendar === undefined){
            setTimeout(attemptPopulate, 500);
            return;
        }
        // console.log(window.gapi.client.calendar);
        populate();
    }

    useEffect(() => {
        attemptPopulate();
    }, []);

    useEffect(() => {
        console.log(events);
    }, [events]);

    const onEventResize = ({ event, start, end }) => {
        console.log({ event, start, end });
    
        const nextEvents = events.map(existingEvent => {
          return existingEvent.id == event.id
            ? { ...existingEvent, start, end }
            : existingEvent;
        });
        
        setPreviousEvents(events);
        setEvents(nextEvents);
  
    };

    const onEventDrop = ({ event, start, end }) => {

        console.log({ event, start, end });
    
        const nextEvents = events.map(existingEvent => {
          return existingEvent.id == event.id
            ? { ...existingEvent, start, end }
            : existingEvent;
        });
        
        setPreviousEvents(events);
        setEvents(nextEvents);
    };

    const onSelectEvent = ({ event, start, end }) => {
        const remove = window.confirm("Would you like to remove this event?")
        if (remove === true){
            const nextEvents = [...events];
            const idx = nextEvents.indexOf(event);
            nextEvents.splice(idx, 1);
            setPreviousEvents(events);
            setEvents(nextEvents);
        }
    }

    return (
        <div className='ParentView'>
            <h2>Calendar</h2>
            <button className='btn btn-secondary' onClick={() => {
                var randInt = Math.floor(Math.random() * 5)
                var randInt2 = Math.floor(Math.random() * 3) + 1;
                var randInt3 = Math.floor(Math.random() * 100000) + 1;
                var startTime = new Date(new Date().setHours(new Date().getHours() + randInt));
                var endTime = new Date(new Date().setHours(new Date().getHours() + randInt + randInt2));
                var tempEvents = events.concat();
                tempEvents.push({
                    title: 'Right Now - #' + randInt3,
                    start: startTime,
                    end: endTime,
                    datedoc: null
                });
                setPreviousEvents(events);
                setEvents(tempEvents);
            }}>Add event</button>
            <button className='btn btn-secondary m-1' onClick={async () => {
                populate();
            }}>Populate Cal</button>
            <div className='ScrollView'>
                <div>
                    <DnDCalendar
                        localizer={momentLocalizer}
                        events={events}
                        defaultView='day'
                        views={['week', 'day', 'agenda']}
                        resizable
                        onEventDrop={onEventDrop}
                        onEventResize={onEventResize}
                        onSelectEvent={onSelectEvent}
                    />
                </div>
            </div>
        </div>
    );


}

export default CalendarView;
