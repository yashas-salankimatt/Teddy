import React, { useContext } from 'react';
import './navbar.css';
import ProfilePanel from './ProfilePanel';

function Navbar(props) {
    return (
        <div className="NavbarWrapper">
            <div className="TeddyWrapper">
                <h1 className="TeddyHeader">Teddy</h1>
            </div>
            <div className="ProfilePanel">
                <ProfilePanel></ProfilePanel>
            </div>
        </div >
    );
}

export default Navbar;