import axios from 'axios'
import { createLeadAction, fetchLeadsAction } from '../redux/actions/leads'

const apiUrl = 'https://jsonplaceholder.typicode.com'

export const fetchAllLeads = () => {
  return dispatch => {
    return axios
      .get(`${apiUrl}/users/`)
      .then(response => {
        console.log(response.data)
        dispatch(fetchLeadsAction(response.data))
      })
      .catch(error => {
        console.log(error)
        throw error
      })
  }
}

export const createLead = lead => {
  return dispatch => {
    return axios
      .post(`${apiUrl}/posts/`, lead)
      .then(response => {
        console.log('response', response.data)
        dispatch(createLeadAction(response.data))
      })
      .catch(error => {
        throw error
      })
  }
}
