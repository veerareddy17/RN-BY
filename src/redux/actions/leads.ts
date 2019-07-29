import { ADD_LEAD, FETCH_LEAD } from './action-types'
// The action creators
export const createLeadAction = lead => {
  return {
    type: ADD_LEAD,
    payload: lead,
  }
}

export const fetchLeadsAction = leads => {
  return {
    type: FETCH_LEAD,
    payload: leads,
  }
}
