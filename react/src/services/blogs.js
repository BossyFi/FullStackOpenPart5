import axios from 'axios'

const baseUrl = '/api/blogs'
const loginUrl = '/api/login'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const setToken = newToken => {
    console.log('Setting token:', newToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
}

const login = async credentials => {
    const response = await axios.post(loginUrl, credentials)
    return response.data
}

const create = async newBlog => {
    const response = await axios.post(baseUrl, newBlog)
    return response.data
}

export default {getAll, setToken, login, create}