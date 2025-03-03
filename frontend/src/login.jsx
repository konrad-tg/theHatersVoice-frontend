import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function LoginPage() {
  return (
    <div className="signup-page">
      <h2>Login</h2>
      <form className="login-form">
        <input type="email" placeholder="Email" className="signup-input" required />
        <br></br>
        <input type="password" placeholder="Password" className="signup-input" required/>
        <br></br>
        <button type="submit" className="submit-btn">Login</button>
      </form>
      <p className="auth-switch"> Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}

export default LoginPage;
