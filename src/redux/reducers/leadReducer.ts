import { ADD_LEAD, FETCH_LEAD, DELETE_LEAD } from '../actions/actionTypes'

export default function leadReducer(state = [], action) {
  switch (action.type) {
    case ADD_LEAD:
      return [...state, action.payload]
    case DELETE_LEAD:
      return state.filter(lead => lead.id !== action.payload.id)
    case FETCH_LEAD:
      return action.payload
    default:
      return state
  }
}
