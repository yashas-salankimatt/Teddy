import React from 'react';
import { useGoogleLogin, GoogleLogin } from 'react-google-login';
import { refreshTokenSetup } from '../utils/refreshTokenSetup';

// const clientId = '112181817782-i1th627fbroijbaubi6v8qpj4d4ifd0t.apps.googleusercontent.com';
const clientId = '112181817782-25lcd3tcchbucd8do9kq20d13q65ht7d.apps.googleusercontent.com';

function Login() {
    const onSuccess = (res) => {
        console.log('Login Success: currentUser: ', res.profileObj);
        refreshTokenSetup(res);
    };

    const onFailure = (res) => {
        console.log('Login failed: res:', res);
    };

    const responseGoogle = (response) => {
        console.log(response);
    };

    const { signIn } = useGoogleLogin({
        onSuccess,
        onFailure,
        clientId,
        isSignedIn: true,
        accessType: 'offline',
        cookiePolicy: 'single_host_origin'
    });

    return (
        <button onClick={signIn}>Sign In</button>
        // <GoogleLogin
        //     clientId="508259565801-ngqqioq0bnsom1efso7r0ttvrntf05hj.apps.googleusercontent.com"
        //     buttonText="Login"
        //     onSuccess={responseGoogle}
        //     onFailure={responseGoogle}
        //     cookiePolicy={'single_host_origin'}
        // />
    );
}

export default Login;