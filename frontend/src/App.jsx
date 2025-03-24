<<<<<<< HEAD
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
=======
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Signuppage from './signup';
import LoginPage from './login';
import Adminpage from './admin';

function App() {
  const [posts, setPosts] = useState([]);

  //fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');

      try {
        const res = await fetch('http://localhost:5001/api/posts', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
          },
        });

        const data = await res.json();
        if (res.ok) {
          setPosts(data);
        } else {
          console.error('Error fetching posts:', data.error);
        }
      } catch (err) {
        console.error('Fetch error:', err.message);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Router>
      <div className="container">
        {/* navbar */}
        <header className="navbar">
          <h1>The Hater's Voice</h1>
          <input type="text" placeholder="Search posts..." className="search-bar" />
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>
              <li><Link to="/admin">Admin</Link></li>
            </ul>
          </nav>
        </header>

        {/* routes */}
        <Routes>
          <Route path="/" element={
            <>
              {/* post form */}
              <div className="post-form">
                <h2>Create a post:</h2>
                <input type="text" placeholder="Title" className="post-title" />
                <textarea placeholder="What's on your mind?" className="post-content"></textarea>
                <button className="submit-btn">Post</button>
              </div>

              {/* forum posts */}
              <main className="forum">
                {posts.map(post => (
                  <div key={post._id || post.postid} className="post">
                    <h3>Post #{post.postid}</h3>
                    <p>{post.post}</p>
                    <div className="post-actions">
                      <button className="like-btn">👍 {post.likeCount || 0}</button>
                      <button className="edit-btn">✏ Edit</button>
                      <button className="delete-btn">🗑 Delete</button>
                    </div>
                    <div className="comments">
                      <h4>Comments:</h4>
                      {/* You can render comment count here, or fetch comments in a future step */}
                      <p>Coming soon...</p>
                      <input type="text" placeholder="Join the conversation..." className="comment-input" />
                      <button className="comment-btn">Comment</button>
                    </div>
                  </div>
                ))}
              </main>
            </>
          } />
          <Route path="/signup" element={<Signuppage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<Adminpage />} />
        </Routes>

        {/* footer */}
        <footer className="footer">
          <p>© 2025 The Haters Voice</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
>>>>>>> 5d933e1 (Added Login and Signup functionality)
