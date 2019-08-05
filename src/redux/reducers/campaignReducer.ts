import { CAMPAIGN_SELECTED } from './../actions/actionTypes';
import { FETCH_CAMPAIGN, LOAD_LEAD_START, LOAD_LEAD_SUCCESS, LOAD_LEAD_FAIL } from '../actions/actionTypes';
import { initialState } from '../../models/campaignInitialState';

export default function campaignReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_CAMPAIGN:
            return {
                ...state,
                status: 'done',
                campaignList: action.payload,
            };
        case LOAD_LEAD_START:
            return {
                ...state,
                isLoading: true,
                error: '',
            };
        case LOAD_LEAD_SUCCESS:
            return {
                ...state,
                status: 'done',
                isLoading: false,
            };
        case LOAD_LEAD_FAIL:
            return {
                ...state,
                status: 'fail',
                isLoading: false,
                error: action.payload,
            };
        case CAMPAIGN_SELECTED:
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
}
