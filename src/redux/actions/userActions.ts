import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from './actionTypes'

// The action creators
export const requestAction = user => {
  return {
    type: LOGIN_REQUEST,
    payload: user,
  }
}

export const successAction = user => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

export const failureAction = error => {
  return {
    type: LOGIN_FAILURE,
    payload: error,
  }
}

export const logoutAction = () => {
  return {
    type: LOGOUT,
  }
}
