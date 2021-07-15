import React, { useEffect, useState } from 'react';
import {Calendar} from 'react-big-calendar';
import localizer from 'react-big-calendar/lib/localizers/moment';
import moment from 'moment';
import 'react-big-calendar/lib/sass/styles.scss';
import './CalendarView.css';
import { getEvents } from '../utils/GCalAuthProvider';

const momentLocalizer = localizer(moment);

function CalendarView(props) {
    const [events, setEvents] = useState([]);

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
            <button className='btn btn-secondary' onClick={async () => {
                var tempEvents = await getEvents();
                console.log(tempEvents);
                if (tempEvents.length > 0){
                    setEvents(tempEvents);
                }
            }}>Populate Cal</button>
            <div className='ScrollView'>
                <div>
                    <Calendar
                        localizer={momentLocalizer}
                        events={events}
                        defaultView='day'
                        views={['week', 'day', 'agenda']}
                    />
                </div>
            </div>
        </div>
    );
}

var eventsExt = [
    {
      id: 1,
      title: 'Today',
      start: new Date(new Date().setHours(new Date().getHours() - 3)),
      end: new Date(new Date().setHours(new Date().getHours() + 3)),
    },
  ];

export default CalendarView;