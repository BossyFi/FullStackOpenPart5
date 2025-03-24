const Blog = ({blog, handleLike, handleRemove}) => (
    <div className="blog">
        <p>{blog.title} {blog.author}</p>
        <p>{blog.url}</p>
        <p>{blog.likes}
            <button onClick={handleLike}>like</button>
        </p>
        {blog.user && <p>{blog.user.username}</p>}
        <button onClick={handleRemove}>Delete Blog</button>

    </div>
)

export default Blog