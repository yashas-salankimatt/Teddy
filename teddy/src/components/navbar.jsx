import React, { useState } from 'react';

function Navbar(props) {
    const [title, setTitle] = useState('Teddy');

    return (
        <div>
            <h1>{title}</h1>
        </div>
    );
}

export default Navbar;