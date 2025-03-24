import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Signuppage from './signup';
import LoginPage from './login';
import Adminpage from './admin';

function App() {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [error, setError] = useState('');
    const [username, setUsername] = useState(null);

    //gets username from token on app load
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                setUsername(payload.username);
            } catch (err) {
                console.error('Failed to decode token:', err);
            }
        }
    }, []);

    const handlePostSubmit = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            setError('You must be logged in to post.');
            return;
        }

        try {
            const res = await fetch('http://localhost:5001/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ post: newPost }),
            });

            const data = await res.json();

            if (res.ok) {
                setPosts(prev => [data.post, ...prev]);
                setNewPost('');
                setError('');
            } else {
                setError(data.error || 'Failed to create post.');
            }
        } catch (err) {
            console.error('Post error:', err.message);
            setError('Something went wrong.');
        }
    };

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
                {username && (
                    <div className="login-info">
                        Welcome to the Hater's Voice! You are logged in as <strong>{username}</strong>.
                    </div>
                )}
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

                <Routes>
                    <Route path="/" element={
                        <>
                            <div className="post-form">
                                <h2>Create a post:</h2>
                                {error && <p style={{ color: 'red' }}>{error}</p>}
                                <textarea
                                    placeholder="What's on your mind?"
                                    className="post-content"
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                ></textarea>
                                <button className="submit-btn" onClick={handlePostSubmit}>Post</button>
                            </div>

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

                <footer className="footer">
                    <p>© 2025 The Haters Voice</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
