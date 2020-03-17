import axios from 'axios'


//this function is suesd to put token inside req header if token exists
//AXIOS create a global header for the user token. so whenver there is a token in localstorage it will be put
//in every request header

const setAuthToken = token => {

    if (token) {
        axios.defaults.headers.common['x-auth-token'] = token
    } else {
        delete axios.defaults.headers.common['x-auth-token']
    }
}

export default setAuthToken