import { FETCH_CAMPAIGN } from '../actions/actionTypes';
import { initialState } from '../../models/campaignInitialState';

export default function campaignReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CAMPAIGN:
            return {
                ...state,
                status: 'done',
                campaignList: action.payload,
            };
        default:
            return state;
    }
}
