import React, {useContext} from 'react';
import './MainPage.css';
import Navbar from '../components/Navbar';
import BucketView from '../components/BucketView';
import CalendarView from '../components/CalendarView';

import { UserContext } from '../providers/UserProvider';

function MainPage(props) {
    const user = useContext(UserContext);

    return (
        <div>
            <div className="Navbar">
                <Navbar/>
            </div>
            {user && <div className="MainViewWrapper">
                <div className="Buckets">
                    <BucketView/>
                </div>
                <div className="CalendarView">
                    <CalendarView/>
                </div>
            </div>}
        </div>
    );
}

export default MainPage;