import React, { useEffect, useState } from 'react';
import {Calendar} from 'react-big-calendar';
import localizer from 'react-big-calendar/lib/localizers/moment';
import moment from 'moment';
import 'react-big-calendar/lib/sass/styles.scss';
import './CalendarView.css';
import { getEvents } from './CalendarWrapper';
import { auth, firestore } from '../utils/FirebaseConfig';
import { initAPI } from '../utils/GCalAuthProvider';

const momentLocalizer = localizer(moment);

export function CalendarView(props) {
    const [events, setEvents] = useState([]);

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

    return (
        <div className='ParentView'>
            <h2>Calendar</h2>
            <button className='btn btn-secondary' onClick={() => {
                var randInt = Math.floor(Math.random() * 5)
                var randInt2 = Math.floor(Math.random() * 3) + 1;
                var tempEvents = events.concat();
                tempEvents.push({
                    id: 2,
                    title: 'Right Now' + randInt,
                    start: new Date(new Date().setHours(new Date().getHours() + randInt)),
                    end: new Date(new Date().setHours(new Date().getHours() + randInt + randInt2)),
                });
                setEvents(tempEvents);
            }}>Add event</button>
            <button className='btn btn-secondary m-1' onClick={async () => {
                populate();
            }}>Populate Cal</button>
            <div className='ScrollView'>
                <div>
                    <Calendar
                        localizer={momentLocalizer}
                        events={events}
                        defaultView='week'
                        views={['week', 'day', 'agenda']}
                    />
                </div>
            </div>
        </div>
    );
}

export default CalendarView;