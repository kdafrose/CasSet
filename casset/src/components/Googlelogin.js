import { useEffect, useRef, useState } from "react";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import SpotifyConnect from './SpotifyConnect';
import '../App.css';
import '../css/Home.css';

function GoogleSignInAuthorization() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(() => {
        const storedProfile = localStorage.getItem("profile");
        return storedProfile ? JSON.parse(storedProfile) : null;
    });
    const [signin, setSignin] = useState(() => {
        return profile ? true : false; 
    }); // true is if theyre signed in, default is not signed in  
    const [showSpotifyConnect, setShowSpotifyConnect] = useState(() =>{ return signin ? true: false});
    const googleLoginDivRef = useRef(null); 

    // Css for Google sign in button moved to the App.css file

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            setSignin(true);
            setShowSpotifyConnect(true); // showSpotifyConnect to true when logged in 
        },
        onError: (error) => console.log('Login Failed:', error),
    });

    useEffect(() => {
        if (user) {
            axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${user.access_token}`,
                        Accept: 'application/json',
                    },
                })
                .then((res) => {
                    setProfile(res.data);
                    localStorage.setItem("profile", JSON.stringify(res.data));
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    const logOut = () => {
        googleLogout();
        localStorage.removeItem("profile");
        localStorage.removeItem("accessToken");
        setUser(null);
        setProfile(null);
        setShowSpotifyConnect(false); // showSpotifyConnect to false when logged out
    };


    useEffect(() => {

        const mainDiv = googleLoginDivRef.current;
        if (!signin) {
            mainDiv.classList.toggle("hidden");
        }

    }, [signin])

    return (
        <div id ="login-container">
            {profile ? (
                // div for logout button and SpotifyConnect button
                <div>
                    {showSpotifyConnect && <SpotifyConnect />}
                    <div id="logout-button-container">
                        <button id="logout-button" onClick={logOut}><i>rewind</i></button>
                    </div>
                </div>
            ) : (
                // div for Google login button
                <div className="login-auth-button-container">
                    <div ref={googleLoginDivRef} style={{flexDirection:"column",flex:"1"}}>
                        <button className="login-auth-buttons" id="GoogleButton"onClick={() => login()}> 
                            &nbsp;&nbsp;&emsp;Login&emsp;&nbsp;&nbsp;
                        </button>
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default GoogleSignInAuthorization;