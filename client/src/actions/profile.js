import axios from 'axios'
import { GET_PROFILE, PROFILE_ERROR } from './types'
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