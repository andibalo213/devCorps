import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from '../actions/types'

//We need state in frontedn to check if req to backend has laoded and if the client/user is aunthenticated
const initialState = {
    //CURRENT STATE RESETS TO INITIAL STATE ON PAGE LOAD
    //when the page loads the current state resets to inital state therefore we set token from localstorage
    //as when user registers/login we put the user token inside localstorage so user token is constant everytime the page laod
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true, //checks wheter the response from backed has been loaded
    user: null
}

export default function (state = initialState, action) {

    const { type, payload } = action
    switch (type) {
        case USER_LOADED:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }
        case LOGIN_SUCCESS:
        case REGISTER_SUCCESS:
            localStorage.setItem("token", payload.token)
            return {
                ...state, ...payload, isAuthenticated: true, loading: false
            }
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT:
        case REGISTER_FAIL:
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        default:
            return state
    }
}