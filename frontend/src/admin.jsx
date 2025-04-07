import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import './app.css';
import { jwtDecode } from 'jwt-decode';

function Adminpage() {
  const token = localStorage.getItem('token');

  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchPostsAndComments();
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

  const fetchPostsAndComments = async () => {
    try {
      const postsResponse = await fetch('http://localhost:5001/api/posts', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const postsData = await postsResponse.json();
      if (postsResponse.ok) {
        setPosts(postsData);

        const allComments = [];
        for (const post of postsData) {
          const commentsResponse = await fetch(`http://localhost:5001/api/comments/${post.postid}`, {
            method: 'GET',
          });
          const commentsData = await commentsResponse.json();
          if (commentsResponse.ok) {
            allComments.push(...commentsData);
          }
        }
        setComments(allComments);
      } else {
        setError(postsData.message);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const getUserPostCount = (userId) => {
    return posts.filter(post => post.userId === userId).length;
  };

  const getUserCommentCount = (userId) => {
    return comments.filter(comment => comment.userId === userId).length;
  };

  const handleEdit = (user) => {
    setEditUser({ ...user });
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
        body: JSON.stringify({
          username: editUser.username,
          email: editUser.email,
          isAdmin: editUser.isAdmin,
        }),
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
    const value = event.target.name == 'isAdmin' ? event.target.value === 'true' : event.target.value;
    setEditUser({ ...editUser, [event.target.name]: value });
  };

  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      {error && <p className="error">{error}</p>}

      <div className="">
        <h3>Total Platform Statistics</h3>
        <p>Total Users: {users.length}</p>
        <p>Total Posts: {posts.length}</p>
        <p>Total Comments: {comments.length}</p>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Posts</th>
            <th>Comments</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{editUser && editUser._id === user._id ?
                <input name="username" value={editUser.username} onChange={handleInputChange} /> : user.username}
              </td>
              <td>{editUser && editUser._id === user._id ?
                <input name="email" value={editUser.email} onChange={handleInputChange} /> : user.email}
              </td>
              <td>{editUser && editUser._id === user._id ?
                <select name="isAdmin" value={editUser.isAdmin.toString()} onChange={handleInputChange}>
                  <option value="false">User</option>
                  <option value="true">Admin</option>
                </select> : user.isAdmin ? 'Admin' : 'User'}
              </td>
              <td>{getUserPostCount(user.id)}</td>
              <td>{getUserCommentCount(user.id)}</td>
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