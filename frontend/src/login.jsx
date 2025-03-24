import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './index.css';

function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: identifier, //will accept username or email
          email: identifier,
          password
        })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token); //stores token
        localStorage.setItem('user', JSON.stringify(data.user)); //saves user info
        alert('Login successful!');
        navigate('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <h2>Login</h2>
      <form className="signup-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email or Username"
          className="signup-input"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          className="signup-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit" className="submit-btn">Login</button>
      </form>
      {error && <p className="error-text">{error}</p>}
      <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
    </div>
  );
}

export default LoginPage;
