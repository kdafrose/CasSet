import { useEffect, useRef, useState } from "react";
import { googleLogout, useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import styled from 'styled-components';

function GoogleSignInAuthorization() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState();
    const [signin, setSignin] = useState(false); // true is if theyre signed in, default is not signed in  
    
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
  
    &:hover {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.25);
      transition: box-shadow 0.2s ease-in-out;
    }
  
    `;

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => {
            setUser(codeResponse);
            setSignin(true);
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
    };


    useEffect(() => {

        const mainDiv = document.getElementById("main-container");
        if (!signin) {
            mainDiv.classList.toggle("hidden");
        }

    }, signin)

    return (
        <div>
            <h2 style ={{display:"flex", justifyContent:"center"}}>CasSet</h2>
            {profile ? (
                <div>
                    <div id="container"></div>
                    <div style={{display:"flex", justifyContent:"flex-end", alignItems:"center", flexDirection:"column"}}>
                        <p>{profile.name}</p>
                        <button onClick={logOut} style={{width:"5%", height:"5%"}}>Log out</button>
                    </div>
                </div>
            ) : (
                <div id="container" >
                    <div id="main-container" style={{display:"flex", width:"100%", justifyContent:"center"}}>
                        <GoogleButton onClick={() => login()} style={{width:"13%"}}> 
                                <div class ="google-logo"></div>
                                Sign in with Google &nbsp;
                        </GoogleButton>
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default GoogleSignInAuthorization;