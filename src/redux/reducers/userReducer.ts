import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from '../actions/actionTypes'

export default function userReducer(state = {}, action) {
  console.log('Action-------',action.type)
  switch (action.type) {
    case LOGIN_REQUEST:
      return {
        loggingIn: true,
        user: action.user,
      }
    case LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      }
    case LOGIN_FAILURE:
      return {}
    case LOGOUT:
      return {}
    default:
      return state
  }
}
