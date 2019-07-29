import axios from 'axios'
import {
  createLeadAction,
  fetchLeadsAction,
  fetchCampaignsAction,
} from '../redux/actions/leadsAction'

const apiUrl = 'https://jsonplaceholder.typicode.com'

// GET method to fetch all captured leads
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

// POST method to create Lead
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

// Get all campaigns
export const fetchCampaignList = () => {
  console.log('insid fetchCampainList')
  return dispatch => {
    return axios
      .get(`${apiUrl}/posts/`)
      .then(response => {
        console.log(response.data)
        dispatch(fetchCampaignsAction(response.data))
      })
      .catch(error => {
        console.log(error)
        throw error
      })
  }
}
