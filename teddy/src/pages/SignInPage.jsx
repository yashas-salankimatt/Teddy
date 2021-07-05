import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../components/login';

function SignInPage(props) {
    return (
        <div>
            <h1>Sign In Page</h1>
            <Login></Login>
            <Link to='/'>Sign In</Link>
        </div>
    );
}

export default SignInPage;