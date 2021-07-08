import React, {useContext} from 'react';
import './MainPage.css'
import Navbar from '../components/navbar';
import BucketView from '../components/bucketView';
import CalendarView from '../components/calendarView';
import { UserContext } from '../providers/UserProvider';

function MainPage(props) {
    const user = useContext(UserContext);

    return (
        <div>
            <div className="Navbar">
                <Navbar></Navbar>
            </div>
            {user && <div className="MainViewWrapper">
                <div className="Buckets">
                    <BucketView></BucketView>
                </div>
                <div className="CalendarView">
                    <CalendarView></CalendarView>
                </div>
            </div>}
        </div>
    );
}

export default MainPage;