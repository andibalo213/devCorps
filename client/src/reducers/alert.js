import { SET_ALERT, REMOVE_ALERT } from '../actions/types'

const initalState = []
//initial state is going to be an array of objects

export default function (state = initalState, action) {

    const { type, payload } = action

    switch (type) {
        case SET_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:

            //return the whole state except the alert that matches the id sent from remove alert action
            return state.filter(alert => alert.id !== payload)
        default:
            return state
    }
}