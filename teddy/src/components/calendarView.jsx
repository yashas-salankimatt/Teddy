import React, { useEffect, useState } from 'react';
import {Calendar} from 'react-big-calendar';
import localizer from 'react-big-calendar/lib/localizers/moment';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from 'moment';
import { auth, firestore } from '../utils/FirebaseConfig';
import { createEvent, deleteEvent, getEventDoc, updateEvent } from "../utils/CalendarDBConfig";
//import 'react-big-calendar/lib/sass/styles.scss';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import './CalendarView.css';
import { getEvents, insertGoogleEvent, attemptGoogleInsert, fetchGoogleData, updateGoogleEvent, deleteGoogleEvent, deleteTeddyGCalEvents, updateGoogleEvents } from './CalendarWrapper';

const momentLocalizer = localizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

function CalendarView(props) {
    const user = auth.currentUser;
    const prefRef = firestore.collection("users").doc(user.uid).collection("prefs");
    const [events, setEvents] = useState([]);
    const [previousEvents, setPreviousEvents] = useState([]);
    const [teddyCalendarId, setTeddyCalendarId] = useState([]);
    const [googleEvents, setGoogleEvents] = useState([]);
    
    const getTeddyCalId = async () => {
        const calendarPrefsDocs = await prefRef.doc("calendarPrefs").get();
        try{
            setTeddyCalendarId(calendarPrefsDocs.data().teddyCalendarId);
        }
        catch(error){
            console.log(error);
            attemptPopulate();
        }
    }

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
                    console.log(teddyCalendarId);
                    prefRef.doc("calendarPrefs").update({
                        teddyCalendarId
                    });
                    }
                });
                
                if(teddyCalExists === false) {
                    await window.gapi.client.calendar.calendars.insert({
                    "resource": {
                        "summary": `Teddy ${auth.currentUser.displayName}`
                    }
                    });
                }
            }
            
            var tempEvents = await getEvents();
            // if (tempEvents.length > 0){
            //     setEvents(tempEvents);
            // }

            var teddyCalEvents = tempEvents.filter(tempEvent => tempEvent.calendarId === teddyCalendarId);
            setGoogleEvents(teddyCalEvents)
            
        }
        if (teddyCalendarId){
            console.log('fetching google data');
            fetchGoogleData(teddyCalendarId, setGoogleEvents);
        }
    }

    function attemptPopulate() {
        if (window.gapi.client.calendar === undefined){
            setTimeout(attemptPopulate, 500);
            return;
        }
        populate();
    }

    async function fetchData() {
        const user = auth.currentUser;
        try {
            const snapshot = await firestore.collection("users").doc(user.uid).collection("calendar").get();
            if (snapshot.empty){
                console.log("No events for this user");
                return;
            }
            var tempEvents = events.concat();
            snapshot.forEach( async (event) => {
                console.log(event)
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

    function updateEvents() {
        const user = auth.currentUser;
        previousEvents.forEach((previousEvent) => {
            var isFound = false;
            events.forEach((event) => {
                if (previousEvent.id == event.id){
                    isFound = true;
                    if (!(previousEvent.title == event.title 
                        && previousEvent.plannedstart == event.plannedstart 
                        && previousEvent.plannedend == event.plannedend
                        && previousEvent.start == event.start 
                        && previousEvent.end == event.end)){
                        console.log("Updating event");
                        console.log(event.title)
                        updateEvent({event: event, eventID: event.id, eventName: event.title});
                    }
                }
            });
            if (!isFound) {
                console.log("Deleting event");
                deleteEvent({eventID: previousEvent.id, eventName: previousEvent.title})
            }
        });
        events.forEach(async (event) => {
            var isFound = false;
            previousEvents.forEach((previousEvent) => {
                if (previousEvent.id == event.id){
                    isFound = true;
                }
            });
            if (!isFound){
                console.log("Adding Event");
                
                const eventID = await createEvent({eventName: event.title, plannedStartTime: event.plannedstart, plannedEndTime: event.plannedend, workingStartTime: event.start, workingEndTime: event.end})
                console.log(eventID);

                const newEvent = {
                    id: eventID,
                    title: event.title,
                    plannedstart: event.plannedstart,
                    plannedend: event.plannedend,
                    start: event.start,
                    end: event.end,
                }
                console.log(newEvent);
                const tempEvents = previousEvents.concat();
                tempEvents.push(newEvent);
                console.log(tempEvents);
                setPreviousEvents(tempEvents);
                setEvents(tempEvents);
                console.log(previousEvents);
                console.log(events);
            }
        });
    }

    useEffect(() => {
        setEvents([]);
        fetchData();
        getTeddyCalId();
        attemptPopulate();
        setGoogleEvents([]);
    }, []);

    useEffect(() => {
        console.log(events);
        
        updateEvents();

        updateGoogleEvents(events, googleEvents, teddyCalendarId, setGoogleEvents);
        if(googleEvents.length > 0){
            updateGoogleEvents(events, googleEvents, teddyCalendarId, setGoogleEvents);
        }

    }, [events]);

    useEffect(() => {
        // console.log(events);
        console.log('the google events: ');
        console.log(googleEvents);
    }, [googleEvents]);

    useEffect(() =>{
        if (teddyCalendarId){
            fetchGoogleData(teddyCalendarId, setGoogleEvents);
        }
    }, [teddyCalendarId])

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
                    plannedstart: startTime,
                    plannedend: endTime,
                    start: startTime,
                    end: endTime,
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