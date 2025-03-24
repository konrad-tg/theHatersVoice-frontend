import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './app.css';
import { jwtDecode } from 'jwt-decode';

function Adminpage() {
  const token = localStorage.getItem('token');
  let isAdmin = false;
  if (token) {
    const decodedToken = jwt_decode(token);
    isAdmin = decodedToken.isAdmin;
  }

  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/users', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setError(data.message);
      }
    }
    catch (error) {
      setError(error.message);
    }
  };

  const handleEdit = (user) => {
    setEditUser({ ...user});
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5001/api/users/${editUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editUser),
      });
      const data = await response.json();
      if (response.ok) {
        setEditUser(null);
        fetchUsers();
      } else {
        setError(data.message);
      }
    }
    catch (error) {
      setError(error.message);
    }
  };

  const handleInputChange = (event) => {
    setEditUser({ ...editUser, [event.target.name]: event.target.value });
  };

  return (
    <div className="admin-page">
        <h2>Admin Dashboard</h2>
        {error && <p className="error">{error}</p>}
        <table className="user-table">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user._id}>
                        <td>{editUser && editUser._id === user._id ? 
                            <input name="username" value={editUser.username} onChange={handleInputChange} /> : 
                            user.username}
                        </td>
                        <td>{editUser && editUser._id === user._id ? 
                            <input name="email" value={editUser.email} onChange={handleInputChange} /> : 
                            user.email}
                        </td>
                        <td>{editUser && editUser._id === user._id ? 
                            <select name="role" value={editUser.role} onChange={handleInputChange}>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select> : 
                            user.role}
                        </td>
                        <td>
                            {editUser && editUser._id === user._id ? (
                                <>
                                    <button onClick={handleSave}>Save</button>
                                    <button onClick={() => setEditUser(null)}>Cancel</button>
                                </>
                            ) : (
                                <button onClick={() => handleEdit(user)}>Edit</button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);
}

export default Adminpage;