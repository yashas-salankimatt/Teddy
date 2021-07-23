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
    const [teddyCalendarId, setTeddyCalendarId] = useState([]);

    async function populate() {
        if (auth.currentUser !== null && window.gapi.client.calendar){

        if(window.gapi.client.calendar){
            var response = await window.gapi.client.calendar.calendarList.list({});
            var tempCalendarItems = response.result.items;
            var teddyCalExists = false;
            tempCalendarItems.forEach((calendar)=>{
                if(calendar.summary === `Teddy ${auth.currentUser.displayName}`){
                teddyCalExists = true;
                setTeddyCalendarId(calendar.id);
                }
            });
            
            if(teddyCalExists === false) {
                await window.gapi.client.calendar.calendars.insert({
                "resource": {
                    "summary": `Teddy ${auth.currentUser.displayName}`
                }
                })
            }
            }


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

    async function deleteGCal() {
        var existingEventsIds = [];

        if (window.gapi.client.calendar){
            var response = await window.gapi.client.calendar.events.list({
                calendarId: teddyCalendarId,
                timeMin: (new Date(new Date().setDate(new Date().getDate()-31))).toISOString(),
                timeMax: (new Date(new Date().setDate(new Date().getDate()+31))).toISOString(),
                singleEvents: true,
                orderBy: 'startTime'
            });

            response.result.items.forEach(element => {
                existingEventsIds.push(element.id);
            });

            console.log(existingEventsIds);

            existingEventsIds.forEach(async (eventId) => {
                await window.gapi.client.calendar.events.delete({
                    "calendarId": teddyCalendarId,
                    "eventId": eventId
                    })
            });
            console.log('calendar delete working');
        }
    }

    async function addGCal() {
        if (window.gapi.client.calendar){
            events.forEach(async (element) => {
                const endTime = element.end.toISOString();
                const startTime = element.start.toISOString();
                const eventId = element.id;
                const title = element.title;
                console.log(endTime);
                await window.gapi.client.calendar.events.insert({
                    "calendarId": teddyCalendarId,
                    "resource": {
                        "end": {'dateTime': endTime},
                        "start": {'dateTime':startTime},
                        "id": eventId,
                        "summary": title
                    }
                  });
            });

        }
        console.log("done adding events");

    }

    useEffect(() => {
        attemptPopulate();

        deleteGCal();
        addGCal();
    }, []);

    useEffect(() => {
        deleteGCal();
        addGCal();
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

    const eventStyleGetter = (event, start, end, isSelected) => {
        var backgroundColor = event.hexColor;
        var style = {
            backgroundColor: backgroundColor,
            borderRadius: '0px',
            opacity: 0.8,
            color: 'black',
            border: '0px',
            display: 'block'
        };
        return {
            style: style
        };
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
                        eventPropGetter={eventStyleGetter}
                    />
                </div>
            </div>
        </div>
    );


}

export default CalendarView;
