import { SET_ALERT, REMOVE_ALERT } from './types'
import * as uuid from 'uuid'

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {

    //dispatch HOC allows us to dispatch/return more than 1 action type from this function
    //because we get to use dispatch which can be called multiple times instead of returning only one thing

    const id = uuid.v4()

    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    })

    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout)
}