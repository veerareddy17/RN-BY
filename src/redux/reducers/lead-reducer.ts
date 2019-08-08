import {
    ADD_LEAD,
    FETCH_LEAD,
    LOAD_LEAD_START,
    LOAD_LEAD_FAIL,
    LOAD_LEAD_SUCCESS,
    OTP_SENT,
} from '../actions/action-types';
import { initialState } from '../init/lead-initial-state';

export default function leadReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_LEAD:
            return {
                ...state,
                status: 'new', // add some valid flag
                isLoading: false,
                leadList: [...state.leadList, action.payload],
            };
        case FETCH_LEAD:
            return {
                ...state,
                status: 'done', // add some valid flag
                isLoading: false,
                leadList: action.payload,
            };
        case LOAD_LEAD_START:
            return {
                ...state,
                isLoading: true,
                leadList: state.leadList,
                error: '',
            };
        case LOAD_LEAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                leadList: action.payload,
            };
        case LOAD_LEAD_FAIL:
            return {
                ...state,
                isLoading: false,
                leadList: state.leadList,
                error: action.payload,
            };
        case OTP_SENT:
            return {
                ...state,
                isLoading: false,
                otp: action.payload,
            };
        default:
            return state;
    }
}
