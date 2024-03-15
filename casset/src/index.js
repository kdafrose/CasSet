import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {GoogleOAuthProvider} from '@react-oauth/google';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <GoogleOAuthProvider clientId ="687295113130-7a9r7l9iujkibvheadjg34c7bnhqlr8u.apps.googleusercontent.com">
      {/* <React.StrictMode> */}
        <App />
      {/* </React.StrictMode> */}
    </GoogleOAuthProvider>
  </>
);

reportWebVitals();
