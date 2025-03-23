import {useState, useEffect} from 'react'
import Blog from './components/Blog'
import Login from './components/Login'
import CreateBlog from './components/CreateBlog'
import blogService from './services/blogs'
import './index.css'

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

    const handleChangeUsername = (event) => {
        setUser(event.target.value)
    }

    const handleChangePassword = (event) => {
        setPassword(event.target.value)
    }

    const handleTitleChange = (event) => {
        setBlogTitle(event.target.value)
    }

    const handleAuthorChange = (event) => {
        setBlogAuthor(event.target.value)
    }

    const handleUrlChange = (event) => {
        setBlogUrl(event.target.value)
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedUser')
        setUser("")
        setPassword("")
        blogService.setToken(null)
        setLogged(false)
        setMessage("Logged out successfully")
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
        } catch (error) {
            ShowErrorMessage("Invalid Blog")
            console.error('Could not create blog:', error)
        }
    }

    return (
        <div>
            <Notification message={message}/>
            <ErrorNotification message={errorMessage}/>
            {!logged ? (
                <Login username={user} onChangeUser={handleChangeUsername} password={password}
                       onChangePassword={handleChangePassword} login={handleLogin}/>
            ) : (
                <div>
                    <h2>Blogs</h2>
                    <CreateBlog title={blogTitle} setTitle={handleTitleChange} author={blogAuthor}
                                setAuthor={handleAuthorChange}
                                url={blogUrl} setUrl={handleUrlChange} createBlog={handleCreateBlog}/>
                    <p>{user} is logged in <button onClick={handleLogout}>Cerrar sesión</button></p>

                    {blogs.map(blog => <Blog key={blog.id} blog={blog}/>)}
                </div>
            )}
        </div>
    )
}

export default App