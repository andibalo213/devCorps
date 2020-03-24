import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE, UPDATE_PROFILE } from '../actions/types'

const initialState = {
    profile: null, //store logged in user porfile and other user profile by id
    profiles: [], //this state is going to store profiles when listing the developes
    repos: [], // list the repos of a profile
    loading: true,
    error: {}
}

export default function (state = initialState, action) {

    const { type, payload } = action

    switch (type) {
        case UPDATE_PROFILE:
        case GET_PROFILE:
            return {
                ...state,
                profile: payload,
                loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }

        case CLEAR_PROFILE:
            return {
                ...state,
                profile: null,
                loading: false,
                repos: []
            }
        default:
            return state
    }
}