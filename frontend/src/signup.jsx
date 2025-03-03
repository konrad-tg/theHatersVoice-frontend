import React from 'react';
import { Link, useNavigate, } from 'react-router-dom';
import './app.css';

function Signuppage() {
    return (
        <div className="signup-page">
            <h2>Sign Up</h2>
            <form>
                <input type="text" placeholder="Full Name" className="signup-input" />
                <br></br>
                <input type="text" placeholder="Username" className="signup-input" />
                <br></br>
                <input type="email" placeholder="Email" className="signup-input" /> 
                <br></br>
                <input type="password" placeholder="Password" className="signup-input" />
                <br></br>
                <input type="password" placeholder="Confirm Password" className="signup-input" />
                <br></br>
                <input type="date" placeholder="Date of Birth" className="signup-input" />
                <br></br>
                <input type="tel" placeholder="Phone Number" className="signup-input" pattern="[0-9]{10,15}" />
                <br></br>
                <button type="submit" className="submit-btn">Sign Up</button>
            </form>
        </div>
    )
}

export default Signuppage;