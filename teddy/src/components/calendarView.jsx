import React, { useEffect, useState } from 'react';
import {Calendar} from 'react-big-calendar';
import localizer from 'react-big-calendar/lib/localizers/moment';
import moment from 'moment';
import 'react-big-calendar/lib/sass/styles.scss';
import './CalendarView.css';
import { getEvents, getCalendarIds } from '../utils/CalendarWrapper';

const momentLocalizer = localizer(moment);

function CalendarView(props) {
    const [events, setEvents] = useState([]);
    const calendarList = [
        {id: 1, calendarId :"i59v4sa7k8cs3jgghsng9smbmc@group.calendar.google.com"},
        // {calendarId :"0m10lko6fgtk8kodr5tm3nveeg@group.calendar.google.com"},
        // {calendarId :"derekhe99@gmail.com"},
        {id: 2, calendarId :'primary'},
    ];

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
            <button className='btn btn-secondary' onClick={() => {
                calendarList.forEach(async (calendar) => {
                    var tempEvents = getEvents(calendar.calendarId);
                    tempEvents = await tempEvents;
                    console.log(tempEvents);
                    console.log(tempEvents.length);

                    if (tempEvents.length > 0){
                        // setEvents([...events, {tempEvents}]);
                        setEvents(tempEvents);
                    }
                });
                
                // getEvents({calendarList, setEvents});
                // tempEvents = await tempEvents;
                // console.log(tempEvents);
                // console.log(events);                
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