import React from 'react';
import './MainPage.css'
import Navbar from '../components/navbar';
import BucketView from '../components/bucketView';
import CalendarView from '../components/calendarView';

function MainPage(props) {
    return (
        <div>
            <div className="Navbar">
                <Navbar></Navbar>
            </div>
            <div className="MainViewWrapper">
                <div className="Buckets">
                    <BucketView></BucketView>
                </div>
                <div className="CalendarView">
                    <CalendarView></CalendarView>
                </div>
            </div>
        </div>
    );
}

export default MainPage;