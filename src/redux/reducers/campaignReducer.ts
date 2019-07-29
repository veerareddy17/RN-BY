import { FETCH_CAMPAIGN } from '../actions/actionTypes'

export default function campaignReducer(state = [], action) {
  switch (action.type) {
    case FETCH_CAMPAIGN:
      return action.payload
    default:
      return state
  }
}
