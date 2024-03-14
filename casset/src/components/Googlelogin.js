import { useEffect, useRef, useState } from "react";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import SpotifyConnect from './SpotifyConnect';
import '../App.css';

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
    const [accessToken, setAccessToken] = useState(() => {
        const storedToken = localStorage.getItem("accessToken");
        console.log("Access Token: " + storedToken);
        return storedToken ? storedToken : null;
    });;
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
                    localStorage.setItem("profile", JSON.stringify(res.data))
                    // Data to pass in
                    const profileData ={
                        "name": res.data.name,
                        "email":res.data.email,
                    };
                    fetch('http://localhost:5000/call_python_function', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(profileData) // Use profileData instead of params
                    })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                    console.log("Profile got set");
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
        <div id ="login-container" style ={{width:"100%", height:"100%",display:"flex"}}>

            {profile ? (
                // div for logout button and SpotifyConnect button
                <div id ="logout-button" style ={{flex:"1"}}>
                    <div style={{display:"flex", justifyContent:"flex-end", alignItems:"center", flexDirection:"column"}}>
                        <p>{profile.name}</p>
                        <p>{profile.email}</p>
                        <button onClick={logOut} style={{width:"10%", height:"5%"}}>Log out</button>
                        {showSpotifyConnect && <SpotifyConnect />} {/* Show SpotifyConnect conditionally */}
                    </div>
                </div>
            ) : (
                // div for Google login button
                <div ref={googleLoginDivRef} style={{flexDirection:"column",flex:"1"}}>
                    <img src="https://bestanimations.com/media/dancers/127847890funny-panda-dancing.gif" alt="gif here"style={{height:"10%"}}></img>
                    <button id="GoogleButton"onClick={() => login()} style={{width:"23%"}}> 
                            <div className ="google-logo"></div>
                            Sign in with Google &nbsp;
                    </button>
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
