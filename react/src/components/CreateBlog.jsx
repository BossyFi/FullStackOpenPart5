const CreateBlog = (props) => {
    return (
        <div>
            <h1>Create new</h1>
            <form onSubmit={props.createBlog}>
                <div>
                    Title: <input type="text" value={props.title} onChange={props.setTitle}/>
                </div>
                <div>
                    Author: <input type="text" value={props.author} onChange={props.setAuthor}/>
                </div>
                <div>
                    URL: <input type="text" value={props.url} onChange={props.setUrl}/>
                </div>
                <button type="submit">Create</button>
            </form>
        </div>
    );
}

export default CreateBlog;