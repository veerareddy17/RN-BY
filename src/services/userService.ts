import axios from 'axios'
import {
  requestAction,
  successAction,
  failureAction,
  logoutAction,
} from '../redux/actions/userActions'

const apiUrl = 'https://jsonplaceholder.typicode.com'

export const login = (username: string, password: string) => {
  console.log('login service', username)
  return dispatch => {
    dispatch(requestAction({ username }))
    return axios
      .get(`${apiUrl}/login/`)
      .then(response => {
        console.log(response.data)
        dispatch(successAction(response.data))
      })
      .catch(error => {
        console.log(error)
        dispatch(failureAction(error.toString()))
        throw error
      })
  }
}

export const logout = () => {
  return dispatch => {
    return axios
      .get(`${apiUrl}/logout/`)
      .then(response => {
        dispatch(logoutAction())
      })
      .catch(error => {
        console.log(error)
        dispatch(failureAction(error.toString()))
        throw error
      })
  }
}
