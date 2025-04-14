import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './app.css';

function Signuppage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    dob: formData.dob,
                    phone: formData.phone
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem('token'); //logout current user if logged in
                alert('Registration successful!');
                navigate('/login');
            } else {
                alert(data.error || 'Registration failed.');
            }
        } catch (err) {
            console.error(err);
            alert('Error connecting to server.');
        }
    };

    return (
        <div className="signup-page">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Full Name" className="signup-input" value={formData.name} onChange={handleChange} required />
                <br />
                <input type="text" name="username" placeholder="Username" className="signup-input" value={formData.username} onChange={handleChange} required />
                <br />
                <input type="email" name="email" placeholder="Email" className="signup-input" value={formData.email} onChange={handleChange} required />
                <br />
                <input type="password" name="password" placeholder="Password" className="signup-input" value={formData.password} onChange={handleChange} required />
                <br />
                <input type="password" name="confirmPassword" placeholder="Confirm Password" className="signup-input" value={formData.confirmPassword} onChange={handleChange} required />
                <br />
                <input type="date" name="dob" placeholder="Date of Birth" className="signup-input" value={formData.dob} onChange={handleChange} required />
                <br />
                <input type="tel" name="phone" placeholder="Phone Number" className="signup-input" pattern="[0-9]{10,15}" value={formData.phone} onChange={handleChange} required />
                <br />
                <button type="submit" className="submit-btn">Sign Up</button>
            </form>
        </div>
    );
}

export default Signuppage;