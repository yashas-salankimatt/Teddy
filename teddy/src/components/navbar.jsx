import React from 'react';
import './navbar.css'

function Navbar(props) {

    return (
        <div className="NavbarWrapper">
            <div className="TeddyWrapper">
                <h1 className="TeddyHeader">Teddy</h1>
            </div>
            <div className="SignOutButton">
                <button type="button" class="btn btn-secondary">Sign Out</button>
            </div>
        </div >
    );
}

export default Navbar;