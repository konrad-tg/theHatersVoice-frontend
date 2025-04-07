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
    const [title, setTitle] = useState('');
    const [comments, setComments] = useState({});
    const [newComments, setNewComments] = useState({});
    const [editingPostId, setEditingPostId] = useState(null);
    const [editedContent, setEditedContent] = useState('');
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editedCommentText, setEditedCommentText] = useState('');

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
                body: JSON.stringify({ post: newPost, title }),
            });

            const data = await res.json();

            if (res.ok) {
                setPosts(prev => [data.post, ...prev]);
                setNewPost('');
                setTitle('');
                setError('');
            } else {
                setError(data.error || 'Failed to create post.');
            }
        } catch (err) {
            console.error('Post error:', err.message);
            setError('Something went wrong.');
        }
    };

    const handleCommentChange = (postId, value) => {
        setNewComments(prev => ({ ...prev, [postId]: value }));
    };

    const handleCommentSubmit = async (postId) => {
        const token = localStorage.getItem('token');
        const commentText = newComments[postId];

        if (!token || !commentText?.trim()) return;

        try {
            const res = await fetch('http://localhost:5001/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ postId, comment: commentText })
            });

            const data = await res.json();

            if (res.ok) {
                setComments(prev => ({
                    ...prev,
                    [postId]: [...(prev[postId] || []), data.comment]
                }));
                setNewComments(prev => ({ ...prev, [postId]: '' }));
            }
        } catch (err) {
            console.error('Comment error:', err.message);
        }
    };


    const handleEditComment = async (commentId) => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`http://localhost:5001/api/comments/${commentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ comment: editedCommentText }),
            });

            const data = await res.json();

            if (res.ok) {
                const postId = Object.keys(comments).find(pid =>
                    comments[pid].some(c => c.commentId === commentId)
                );
                const updatedRes = await fetch(`http://localhost:5001/api/comments/${postId}`);
                const updatedComments = await updatedRes.json();
                setComments(prev => ({ ...prev, [postId]: updatedComments }));

                setEditingCommentId(null);
                setEditedCommentText('');
            } else {
                console.error('Failed to edit comment:', data.error);
            }
        } catch (err) {
            console.error('Edit comment error:', err.message);
        }
    };

    const handleLike = async (postid) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Please log in to like posts.');

        try {
            const res = await fetch(`http://localhost:5001/api/posts/${postid}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (res.ok) {
                //update post like count in state
                setPosts(prev =>
                    prev.map(post =>
                        post.postid === postid ? { ...post, likeCount: data.post.likeCount } : post
                    )
                );
            } else {
                console.error('Failed to like post:', data.error);
            }
        } catch (err) {
            console.error('Error liking post:', err.message);
        }
    };

    const handleEditClick = (postId, currentContent) => {
        setEditingPostId(postId);
        setEditedContent(currentContent);
    };

    const handleSaveEdit = async (postId) => {
        const token = localStorage.getItem('token');
        if (!token) return alert('Please log in to edit posts.');

        try {
            const res = await fetch(`http://localhost:5001/api/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ post: editedContent }),
            });

            const data = await res.json();

            if (res.ok) {
                setPosts(prev =>
                    prev.map(post =>
                        post.postid === postId ? { ...post, post: data.post.post } : post
                    )
                );
                setEditingPostId(null);
                setEditedContent('');
            } else {
                console.error('Failed to edit post:', data.error);
            }
        } catch (err) {
            console.error('Error editing post:', err.message);
        }
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
        setEditedContent('');
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
                    const commentsMap = {};
                    await Promise.all(data.map(async (post) => {
                        const res = await fetch(`http://localhost:5001/api/comments/${post.postid}`);
                        const commentData = await res.json();
                        commentsMap[post.postid] = commentData;
                    }));
                    setComments(commentsMap);
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
                                <input
                                    type="text"
                                    placeholder="Title"
                                    className="post-title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
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
                                        <h3>{post.title || `Post #${post.postid}`}</h3>
                                        {editingPostId === post.postid ? (
                                            <>
                                                <textarea
                                                    value={editedContent}
                                                    onChange={(e) => setEditedContent(e.target.value)}
                                                    className="post-content"
                                                ></textarea>
                                                <button onClick={() => handleSaveEdit(post.postid)}>Save</button>
                                                <button onClick={handleCancelEdit}>Cancel</button>
                                            </>
                                        ) : (
                                            <p>{post.post}</p>
                                        )}
                                        <div className="post-actions">
                                            <button className="like-btn" onClick={() => handleLike(post.postid)}>
                                                👍 {post.likeCount || 0}
                                            </button>
                                            <button className="edit-btn" onClick={() => handleEditClick(post.postid, post.post)}>
                                                ✏ Edit
                                            </button>
                                            <button className="delete-btn">🗑 Delete</button>
                                        </div>
                                        <div className="comments">
                                            <h4>Comments:</h4>
                                            {comments[post.postid]?.map((c) => (
                                                <div key={c.commentId} className="comment">
                                                    {editingCommentId === c.commentId ? (
                                                        <>
                                                            <input
                                                                type="text"
                                                                value={editedCommentText}
                                                                onChange={(e) => setEditedCommentText(e.target.value)}
                                                            />
                                                            <button onClick={() => handleEditComment(c.commentId)}>Save</button>
                                                            <button onClick={() => setEditingCommentId(null)}>Cancel</button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p>• {c.comment}</p>
                                                            {username && (
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingCommentId(c.commentId);
                                                                        setEditedCommentText(c.comment);
                                                                    }}
                                                                    className="edit-comment-btn"
                                                                >
                                                                    ✏ Edit
                                                                </button>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            ))}
                                            <input
                                                type="text"
                                                placeholder="Join the conversation..."
                                                className="comment-input"
                                                value={newComments[post.postid] || ''}
                                                onChange={(e) => handleCommentChange(post.postid, e.target.value)}
                                            />
                                            <button
                                                className="comment-btn"
                                                onClick={() => handleCommentSubmit(post.postid)}
                                            >Comment</button>
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
