import { LeadModel } from './../models/leadModel';
import axios from 'axios'
import {
  createLeadAction,
  fetchLeadsAction,
  fetchCampaignsAction,
} from '../redux/actions/leadsAction'

const apiUrl = 'https://jsonplaceholder.typicode.com'
const options = {
  headers: {
    'Authorization': 'Basic Y2xpZW50OnNlY3JldA==',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}
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
export const createLead = (lead:LeadModel) => {
  console.log('lead service:: create method :: lead studentName=',lead.studentName);
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
