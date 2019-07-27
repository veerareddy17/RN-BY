import { FETCH_LEAD } from '../redux/actions/action-types'
import axios from 'axios'

const apiUrl = 'https://jsonplaceholder.typicode.com/users'

export const fetchLeads = leads => {
  return {
    type: FETCH_LEAD,
    leads,
  }
}

export const fetchAllLeads = () => {
  return dispatch => {
    return axios
      .get(apiUrl)
      .then(response => {
        console.log(response.data)
        dispatch(fetchLeads(response.data))
      })
      .catch(error => {
        throw error
      })
  }
}
