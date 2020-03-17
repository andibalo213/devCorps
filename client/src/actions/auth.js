import axios from 'axios'
import { setAlert } from './alert'
import { REGISTER_FAIL, REGISTER_SUCCESS, USER_LOADED, AUTH_ERROR } from './types'
import setAuthToken from '../utils/setAuthToken'

//STATELESS JWT
//jwt is stateless so when we create token for user it wont check if the user is authenticated
//and the authenticated state in react will reset eveytime page load
//SO we need to check if user is authe everytime the page load by requesting to api/auth that returns user data

export const loadUser = () => async dispatch => {

    //check if token exists, if exists place token inside the req header using another function
    if (localStorage.token) {
        setAuthToken(localStorage.token) //if token exists in localstorage put it inide the headers using the setAuth func
    }

    try {
        const res = await axios.get('api/auth') //the endpoint returns user data

        dispatch({
            type: USER_LOADED,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

export const register = (name, email, password) => async dispatch => {
    //DISPATCH
    //it is a function which sends action that contiains types and payload to the reducer to be evaluated

    //SENDING DATA TO SERVER
    //we must preapre our req header and req body as an obj to send to the server

    const config = {
        //when sending req haeder make sure the fields in haeder obj is wrapped in string
        headers: {
            'Content-Type': 'application/json'
        }
    }

    //DATA SENT to server must be in json format and stringified so we must wrap our fields in object
    const body = JSON.stringify({ name, email, password })

    try {

        //by sending pst req to the backend route we recieve a resposne which is stored in a variable
        //when sending data axios receives the body and config parameters
        const res = await axios.post('api/users', body, config)

        //the response is an object and the data from backend is stored in res.data

        console.log(res)

        //API/USERS RETURNS OBJ WITH TOKEN FIELD  in res.data
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })


    } catch (error) {

        //if error the backend will send back array of erros that will be stored in a variable
        const errors = error.response.data.errors

        //EVEN if we import another action function we still need to call dispatch on it so the setAlert func
        //wil run and dispatch its own types to the reducer
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        //we lopp through the array while dispatching setAlert with each err msg
        dispatch({
            type: REGISTER_FAIL
        })


    }
}

