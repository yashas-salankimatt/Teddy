import React from 'react';
import './navbar.css';
import { Link, Redirect } from 'react-router-dom';

function Navbar(props) {

    const onSignOut = () => {
        console.log("Entered function");
    };

    return (
        <div className="NavbarWrapper">
            <div className="TeddyWrapper">
                <h1 className="TeddyHeader">Teddy</h1>
            </div>
            <div className="SignOutButton">
                <Link type="button" class="btn btn-secondary" onClick={onSignOut} to='/signin' >Sign Out</Link>
            </div>
        </div >
    );
}

export default Navbar;