const Login = (props) => (
    <>
        <h1>Log in to application</h1>
        <form>
            <input type="text" placeholder="Username" value={props.username} onChange={props.onChangeUser}/>
            <input type="password" placeholder="Password" value={props.password} onChange={props.onChangePassword}/>
            <button type="submit" onClick={props.login}>Login</button>
        </form>
    </>
)

export default Login;