import { GET_POSTS, POST_ERROR } from './types'
import axios from 'axios'

export const getAllPosts = () => async dispatch => {

    try {
        const res = await axios.get('/api/posts')


        dispatch({
            type: GET_POSTS,
            payload: res.data
        })

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })
    }
}