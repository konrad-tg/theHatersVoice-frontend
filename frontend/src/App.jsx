import { useState } from 'react'
import { BrowserRouter as Router,  Routes, Route, Link  } from 'react-router-dom'
import './App.css'
import Signuppage from './signup'
import LoginPage from './login'

function App() {

  //placeholder post content
  const [posts, setPosts] = useState([
    {
        id: 1,
        title: "Welcome to the Haters Voice!",
        content: "This is a placeholder post. It is here as an example. Fusce condimentum turpis scelerisque, faucibus erat quis, rhoncus elit. Vivamus quis posuere justo. Pellentesque auctor sapien quis neque suscipit tempus. Integer eu diam nulla. Suspendisse eu malesuada dui. Sed vitae elit blandit, eleifend eros eget, rhoncus purus. Ut accumsan faucibus aliquam. Integer gravida rhoncus arcu, id pulvinar augue. Aliquam erat volutpat. Curabitur convallis nibh et est posuere finibus. Vestibulum ac placerat massa, ac varius nulla. ",
        likes: 5,
        comments: [
            { id: 1, user: "johnsmith23", text: "This is a place-holder comment. Looks good!" },
            { id: 2, user: "janedoe42", text: "This is also a placeholder, we will connect the backend soon!" }
        ]
    },

    {
      id: 2,
      title: "Just another post.",
      content: "This is also a placeholder post. It is here as an example. Fusce condimentum turpis scelerisque, faucibus erat quis, rhoncus elit. Vivamus quis posuere justo. Pellentesque auctor sapien quis neque suscipit tempus. Integer eu diam nulla. Suspendisse eu malesuada dui. Sed vitae elit blandit, eleifend eros eget, rhoncus purus. Ut accumsan faucibus aliquam. Integer gravida rhoncus arcu, id pulvinar augue. Aliquam erat volutpat. Curabitur convallis nibh et est posuere finibus. Vestibulum ac placerat massa, ac varius nulla. ",
      likes: 7,
      comments: [
          { id: 1, user: "anotheruser47", text: "This is a place-holder comment. Looks good!" },
          { id: 2, user: "janedoe42", text: "This is also a placeholder, we will connect the backend soon!" },
          { id: 3, user: "abcd1234", text: "very cool..." }
      ]
  }
]);

return (
    <Router>      
        <div className="container">
            {/*navbar*/}
            <header className="navbar">
                <h1>The Hater's Voice</h1>
                <input type="text" placeholder="Search posts..." className="search-bar" />
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/signup"> Sign Up </Link></li>
                        <li><Link to="#">Admin</Link></li>
                    </ul>
                </nav>
            </header>
                        
            {/*routes*/}
            <Routes>
            <Route path="/" element={ <>
                    {/*post form*/}
                    <div className="post-form">
                        <h2>Create a post:</h2>
                        <input type="text" placeholder="Title" className="post-title" />
                        <textarea placeholder="What's on your mind?" className="post-content"></textarea>
                        <button className="submit-btn">Post</button>
                    </div>

                    {/*forum posts*/}
                    <main className="forum">
                    {posts.map(post => (
                        <div key={post.id} className="post">
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>
                            <div className="post-actions">
                                <button className="like-btn">👍 {post.likes}</button>
                                <button className="edit-btn">✏ Edit</button>
                                <button className="delete-btn">🗑 Delete</button>
                            </div>
                            <div className="comments">
                                <h4>Comments:</h4>
                                {post.comments.map(comment => (
                                <p key={comment.id}><strong>{comment.user}:</strong> {comment.text}</p>
                                ))}
                                <input type="text" placeholder="Join the conversation..." className="comment-input" />
                                <button className="comment-btn">Comment</button>
                            </div>
                        </div>
                    ))}
                    </main>
                </>
                } 
            />
            <Route path="/signup" element={<Signuppage />} />
            <Route path="/login" element={<LoginPage />} />
            </Routes>

            {/*footer*/}
            <footer className="footer">
                <p>© 2025 The Haters Voice</p>
            </footer>
        </div>
    </Router>
);
}

export default App
