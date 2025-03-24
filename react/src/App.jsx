import {useState, useEffect, useRef} from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import CreateBlog from './components/CreateBlog'
import blogService from './services/blogs'
import './index.css'
import Togglable from "./components/Togglable.jsx";

const Notification = ({message}) => {
    if (message === null) {
        return null
    }

    return (
        <div className="success">
            {message}
        </div>
    )
}

const ErrorNotification = ({message}) => {
    if (message === null) {
        return null
    }

    return (
        <div className="error">
            {message}
        </div>
    )
}
const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState("")
    const [password, setPassword] = useState("")
    const [logged, setLogged] = useState(false)
    const [blogTitle, setBlogTitle] = useState("")
    const [blogAuthor, setBlogAuthor] = useState("")
    const [blogUrl, setBlogUrl] = useState("")

    const [message, setMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const blogFormRef = useRef()
    const ShowMessage = (message) => {
        setMessage(message)
        setTimeout(() => {
            setMessage(null)
        }, 3000)
    }

    const ShowErrorMessage = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 3000)
    }

    useEffect(() => {
        blogService.getAll().then(blogs => {
            console.log('Fetched blogs:', blogs);
            setBlogs(blogs || []);
        });
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')
        if (loggedUserJSON) {
            const loggedUser = JSON.parse(loggedUserJSON)
            blogService.setToken(loggedUser.token)
            setUser(loggedUser.username)
            setLogged(true)
        }
    }, []);

    const handleLogin = async (event) => {
        event.preventDefault()
        try {
            const loggedUser = await blogService.login({username: user, password: password})
            window.localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
            blogService.setToken(loggedUser.token)
            setLogged(true)
            ShowMessage("Logged in successfully")
        } catch (error) {
            console.error('Could not log in:', error)
            ShowErrorMessage("Invalid username or password")
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedUser')
        setUser("")
        setPassword("")
        blogService.setToken(null)
        setLogged(false)
        ShowMessage("Logged out successfully")
    }

    const handleCreateBlog = async (event) => {
        event.preventDefault()
        try {
            const newBlog = await blogService.create({title: blogTitle, author: blogAuthor, url: blogUrl})
            setBlogs(blogs.concat(newBlog))
            setBlogTitle("")
            setBlogAuthor("")
            setBlogUrl("")
            ShowMessage(`Blog ${newBlog.title} created successfully`)
            blogFormRef.current.toggleVisibility()
        } catch (error) {
            ShowErrorMessage("Invalid Blog")
            console.error('Could not create blog:', error)
        }
    }

    const likeBlog = async (blog) => {
        const likedBlog = {...blog, likes: blog.likes + 1}
        try {
            const updatedBlog = await blogService.like(likedBlog)
            setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))
        } catch (error) {
            ShowErrorMessage("Could not like blog")
            console.error('Could not like blog:', error)
        }
    }

    const removeBlog = async (blog) => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
            try {
                await blogService.deleteBlog(blog)
                setBlogs(blogs.filter(b => b.id !== blog.id))
                ShowMessage(`Blog ${blog.title} removed successfully`)
            } catch (error) {
                ShowErrorMessage("Could not remove blog")
                console.error('Could not remove blog:', error)
            }
        }
    }
    return (
        <div>
            <Notification message={message}/>
            <ErrorNotification message={errorMessage}/>
            {!logged ? (
                <Login username={user} onChangeUser={({target}) => setUser(target.value)} password={password}
                       onChangePassword={({target}) => setPassword(target.value)} login={handleLogin}/>
            ) : (
                <div>
                    <h2>Blogs</h2>
                    <Togglable/>
                    <Togglable buttonLabel={"new note"} ref={blogFormRef}>
                        <CreateBlog title={blogTitle} setTitle={({target}) => setBlogTitle(target.value)}
                                    author={blogAuthor}
                                    setAuthor={({target}) => setBlogAuthor(target.value)}
                                    url={blogUrl} setUrl={({target}) => setBlogUrl(target.value)}
                                    createBlog={handleCreateBlog}/>
                    </Togglable>
                    <p>{user} is logged in <button onClick={handleLogout}>Cerrar sesión</button></p>


                    {blogs
                        .slice()
                        .sort((a, b) => b.likes - a.likes)
                        .map(blog => (
                            <Togglable key={blog.id} buttonLabel={"View Blog"}>
                                <Blog blog={blog} handleLike={() => likeBlog(blog)}
                                      handleRemove={() => removeBlog(blog)}/>
                            </Togglable>
                        ))
                    }
                </div>
            )}
        </div>
    )
}

export default App