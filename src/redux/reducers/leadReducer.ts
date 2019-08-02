import { ADD_LEAD, FETCH_LEAD } from '../actions/actionTypes';
import { initialState } from '../../models/leadInitialState';

export default function leadReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_LEAD:
            return {
                ...state,
                status: 'new', // add some valid flag
                leadList: [...state.leadList, action.payload],
            };
        case FETCH_LEAD:
            return {
                ...state,
                status: 'done', // add some valid flag
                leadList: action.payload,
            };
        default:
            return state;
    }
}
