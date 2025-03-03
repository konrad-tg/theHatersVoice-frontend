import React from 'react';
import { useState } from 'react';
import './app.css';

function Signuppage() {
    return (
        <div className="signup-page">
            <h2>Sign Up</h2>
            <form>
                <input type="email" placeholder="Email" className="signup-input" /> 
                <br></br>
                <input type="text" placeholder="Username" className="signup-input" />
                <br></br>
                <input type="password" placeholder="Password" className="signup-input" />
                <br></br>
                <input type="password" placeholder="Confirm Password" className="signup-input" />
                <br></br>
                <button type="submit" className="submit-btn">Sign Up</button>
            </form>
        </div>
    )
}

export default Signuppage;