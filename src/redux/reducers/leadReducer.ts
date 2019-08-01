import { ADD_LEAD, FETCH_LEAD } from '../actions/actionTypes';

export default function leadReducer(state = [], action) {
    switch (action.type) {
        case ADD_LEAD:
            return {
                ...state,
                lead: action.payload,
            };
        case FETCH_LEAD:
            return {
                lead: action.payload,
            };
        default:
            return state;
    }
}
