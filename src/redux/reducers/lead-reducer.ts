import {
    ADD_LEAD,
    FETCH_LEAD,
    LOAD_LEAD_START,
    LOAD_LEAD_FAIL,
    LOAD_LEAD_SUCCESS,
    OTP_SENT,
    ADD_OFFLINE_LEAD,
    FETCH_OFFLINE_LEAD,
} from '../actions/action-types';
import { initialState } from '../init/lead-initial-state';

export default function leadReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_LEAD:
            return {
                ...state,
                status: 'new', // add some valid flag
                isLoading: false,
                leadList: [...[action.payload], ...state.leadList],
            };
        case FETCH_LEAD:
            return {
                ...state,
                status: 'done', // add some valid flag
                isLoading: false,
                paginatedLeadList: action.payload.paginatedLeadList,
                leadList: [...state.leadList, ...action.payload.paginatedLeadList.data],
                flag: action.payload.flag,
            };
        case LOAD_LEAD_START:
            return {
                ...state,
                isLoading: true,
                paginatedLeadList: state.paginatedLeadList,
                error: '',
            };
        case LOAD_LEAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
                paginatedLeadList: action.payload.leads,
            };
        case LOAD_LEAD_FAIL:
            return {
                ...state,
                isLoading: false,
                paginatedLeadList: state.paginatedLeadList,
                error: action.payload,
            };
        case OTP_SENT:
            return {
                ...state,
                isLoading: false,
                otp: action.payload,
            };

        case ADD_OFFLINE_LEAD:
            return {
                ...state,
                status: 'new offline',
                isLoading: false,
                offlineLeadList: [...[action.payload], ...state.offlineLeadList],
            };
        case FETCH_OFFLINE_LEAD:
            return {
                ...state,
                status: 'done',
                isLoading: false,
                offlineLeadList: [...state.offlineLeadList, ...action.payload],
            };
        default:
            return state;
    }
}
