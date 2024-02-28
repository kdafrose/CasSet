import { useEffect, useRef, useState } from "react";
import { googleLogout, useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import styled from 'styled-components';
import SpotifyConnect from './SpotifyConnect';

function GoogleSignInAuthorization() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState();
    const [signin, setSignin] = useState(false); // true is if theyre signed in, default is not signed in  
    const [showSpotifyConnect, setShowSpotifyConnect] = useState(false);

    // Css for Google sign in button
    const GoogleButton = styled.button`
    background-color: #fff;
    color: rgba(0, 0, 0, 0.54);
    border: 1px solid rgba(0, 0, 0, 0.12);
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    padding: 0.8rem 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  
    &:hover {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.25);
      transition: box-shadow 0.2s ease-in-out;
    }
  
    `;

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
                })
                .catch((err) => console.log(err));
        }
    }, [user]);

    const logOut = () => {
        googleLogout();
        setUser(null);
        setProfile(null);
        setShowSpotifyConnect(false); // showSpotifyConnect to false when logged out
    };


    useEffect(() => {

        const mainDiv = document.getElementById("google-login-div");
        if (!signin) {
            mainDiv.classList.toggle("hidden");
        }

    }, signin)

    return (
        <div id ="login-container" style ={{width:"100%", height:"100%",display:"flex"}}>

            {profile ? (
                // div for logout button and SpotifyConnect button
                <div id ="logout-button" style ={{flex:"1"}}>
                    <div style={{display:"flex", justifyContent:"flex-end", alignItems:"center", flexDirection:"column"}}>
                        <p>{profile.name}</p>
                        <button onClick={logOut} style={{width:"5%", height:"5%"}}>Log out</button>
                        {showSpotifyConnect && <SpotifyConnect />} {/* Show SpotifyConnect conditionally */}
                    </div>
                </div>
            ) : (
                // div for Google login button
                <div id="google-login-div" style={{flexDirection:"column",flex:"1"}}>
                    <img src="https://bestanimations.com/media/dancers/127847890funny-panda-dancing.gif" style={{height:"10%"}}></img>
                    <GoogleButton onClick={() => login()} style={{width:"23%"}}> 
                            <div class ="google-logo"></div>
                            Sign in with Google &nbsp;
                    </GoogleButton>
                </div>
            )
            }

            <div id = "gif-div" style={{flex:"1"}}>
                <img src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/0afde9f2-c206-496e-b9c4-5b251f64729a/dg8oecb-c7d0d497-d086-4471-9c18-221821587f30.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzBhZmRlOWYyLWMyMDYtNDk2ZS1iOWM0LTViMjUxZjY0NzI5YVwvZGc4b2VjYi1jN2QwZDQ5Ny1kMDg2LTQ0NzEtOWMxOC0yMjE4MjE1ODdmMzAuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.aIyOfJLYrZUI5_6XDWkzvGxQyAP-w-oY3AhOpNRnsMo" alt="pls work" style ={{height:"40%"}}></img>
            </div>

        </div >
    );
}

export default GoogleSignInAuthorization;