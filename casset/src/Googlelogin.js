import { useEffect, useRef, useState } from "react";
import { googleLogout, useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import styled from 'styled-components';

const localStorageKey = "lotion-v1";

function GoogleSignInAuthorization() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState();

    const GoogleButton = styled.button`
  background-color: #fff;
  color: rgba(0, 0, 0, 0.54);
  border: 1px solid rgba(0, 0, 0, 0.12);
  border-radius: 4px;
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

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.3);
  }

  & > svg {
    margin-right: 0.5rem;
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

    const [signin, setSignin] = useState(false); // true is if theyre signed in, default is not signed in  

    useEffect(() => {

        const mainDiv = document.getElementById("main-container");
        if (!signin) {
            mainDiv.classList.toggle("hidden");
        }

    }, signin)

    return (
        <div>
            <h2></h2>
            <br />
            <br />
            {profile ? (
                <div>
                    <div id="container"></div>
                    <div style={{ postion: "relative", marginTop: "-100px", marginLeft: "1200px", fontSize: "13px" }}>
                        <p>Signed In: {profile.name}</p>
                        <button style={{ marginTop: "-90px", fontFamily: "Geneva" }} onClick={logOut}>(Log out)</button>
                        <br />
                        <br />
                    </div>
                </div>

            ) : (
                <div id="container">
                    <div id="main-container">
                        <button onClick={() => login()} style={{ marginLeft: '550px', paddingTop: '150px', paddingTop: '0px', marginTop: '150px' }}>
                            <GoogleButton>      <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="1"
                                height="18"
                                viewBox="0 0 18 18"
                            >
                                <path fill="none" d="M0 0h18v18H0z" />
                            </svg>
                                Sign in with Google &nbsp;
                                <span role="img" aria-label="email">
                                    ✉
                                </span></GoogleButton>
                        </button>
                    </div>
                </div>
            )
            }
        </div >
    );
}

export default GoogleSignInAuthorization;