import axios from 'axios'
import { GET_PROFILE, PROFILE_ERROR, UPDATE_PROFILE, ACCOUNT_DELETED, CLEAR_PROFILE } from './types'
import { setAlert } from '../actions/alert'

export const getCurrentProfile = () => async dispatch => {

    try {
        const res = await axios.get('api/profile/me')

        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

    } catch (error) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}

//CREATE/EDIT PROFILE
export const createProfile = (formData, history, edit = false) => async dispatch => {

    try {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const res = await axios.post('api/profile', formData, config)

        console.log(res)
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })

        dispatch(setAlert(edit ? 'Profile Updated' : 'Profile Created', 'success'))

        //We cant use Redirect from react router in a non component in this case a function
        //so we use history object that is passed as props to components rendered by Route from react-router
        //history obj has push method that inserts a page to the histroy stack so the browser will get redirected

        if (!edit) {
            history.push('/dashboard')
        }

    } catch (error) {

        const errors = error.response.data.errors;

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }


        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }

}

export const addExperience = (formData, history) => async dispatch => {

    try {
        const config = {
            headers: {
                "Content-Type": 'application/json'
            }
        }

        const res = await axios.put('api/profile/experience', formData, config)


        //UPDATING A PORFILE
        //when updating a profile we just want to get the returned modified data and update our state in client
        //bcs the updating is alreday done in the backend
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experience Added', 'success'))

        history.push('/dashboard')
    } catch (error) {

        const errors = error.response.data.errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}

export const addEducation = (formData, history) => async dispatch => {

    try {
        const config = {
            headers: {
                "Content-Type": 'application/json'
            }
        }

        const res = await axios.put('api/profile/education', formData, config)


        //UPDATING A PORFILE
        //when updating a profile we just want to get the returned modified data and update our state in client
        //bcs the updating is alreday done in the backend
        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Education Added', 'success'))

        history.push('/dashboard')
    } catch (error) {

        const errors = error.response.data.errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}

export const deleteEducation = id => async dispatch => {

    try {
        const res = await axios.delete(`api/profile/education/${id}`)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Education Deleted', 'success'))
    } catch (error) {

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}

export const deleteExperience = id => async dispatch => {

    try {
        const res = await axios.delete(`api/profile/experience/${id}`)

        dispatch({
            type: UPDATE_PROFILE,
            payload: res.data
        })

        dispatch(setAlert('Experience Deleted', 'success'))
    } catch (error) {

        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}

export const deleteAccount = () => async dispatch => {
    if (window.confirm('Are you sure you want to delete your account?')) {

        try {
            const res = await axios.delete(`api/profile`)

            dispatch({
                type: CLEAR_PROFILE
            })

            dispatch({
                type: ACCOUNT_DELETED
            })


            dispatch(setAlert('Account deleted'))
        } catch (error) {

            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: error.response.statusText, status: error.response.status }
            })
        }
    }

}