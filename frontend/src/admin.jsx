import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './app.css';

function Adminpage() {
  
  const [users, setUsers] = useState([
    { id: 1, username: 'admin', email: 'admin@hatersvoice.com', role: 'Admin' },
    { id: 2, username: 'jsmitty', email: 'johnsmith@example.com', role: 'User' },
    { id: 3, username: 'burgerman', email: 'bigburger@gmail.com', role: 'User' }
  ]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div>
        <Link to="/">Back to Home</Link>
      </div>
    
      <div>
        <h3>User Management</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button> Edit </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Adminpage;
