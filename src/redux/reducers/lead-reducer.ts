import {
    LOAD_LEAD_START,
    LOAD_LEAD_FAIL,
    LOAD_LEAD_SUCCESS,
    OTP_SENT,
    ADD_OFFLINE_LEAD,
    FETCH_OFFLINE_LEAD,
    SYNC_OFFLINE_LEADS,
    DELETE_SYNCED_LEADS,
    LEAD_RESET_ACTION,
    ADD_VERIFIED_LEAD,
    ADD_NON_VERIFIED_LEAD,
    FETCH_VERIFIED_LEAD,
    FETCH_NON_VERIFIED_LEAD,
    FETCH_NON_VERIFIED_FILTERED_LEADS,
    FETCH_VERIFIED_FILTERED_LEADS,
} from '../actions/action-types';
import { initialState, resetLeadState, PaginatedResponseState } from '../init/lead-initial-state';

export default function leadReducer(state = initialState, action) {
    switch (action.type) {
        case ADD_VERIFIED_LEAD:
            return {
                ...state,
                status: 'new', // add some valid flag
                isLoading: false,
                verifiedLeadList: [...[action.payload], ...state.verifiedLeadList],
            };
        case ADD_NON_VERIFIED_LEAD:
            return {
                ...state,
                status: 'new', // add some valid flag
                isLoading: false,
                nonVerifiedLeadList: [...[action.payload], ...state.nonVerifiedLeadList],
            };
        case FETCH_VERIFIED_LEAD:
            return {
                ...state,
                status: 'done', // add some valid flag
                isLoading: false,
                verifiedPaginatedLeadList: action.payload.paginatedLeadList,
                verifiedLeadList: [...state.verifiedLeadList, ...action.payload.paginatedLeadList.data],
                flag: action.payload.flag,
            };
        case FETCH_NON_VERIFIED_LEAD:
            return {
                ...state,
                status: 'done', // add some valid flag
                isLoading: false,
                nonVerifiedPaginatedLeadList: action.payload.paginatedLeadList,
                nonVerifiedLeadList: [...state.nonVerifiedLeadList, ...action.payload.paginatedLeadList.data],
                flag: action.payload.flag,
            };
        case LOAD_LEAD_START:
            return {
                ...state,
                isLoading: true,
                // paginatedLeadList: state.paginatedLeadList,
                error: '',
            };
        case LOAD_LEAD_SUCCESS:
            return {
                ...state,
                isLoading: false,
            };
        case LOAD_LEAD_FAIL:
            return {
                ...state,
                isLoading: false,
                // paginatedLeadList: state.paginatedLeadList,
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
                offlineLeadList: state.offlineLeadList,
            };
        case SYNC_OFFLINE_LEADS:
            return {
                ...state,
                isLoading: false,
                status: action.payload,
            };
        case DELETE_SYNCED_LEADS:
            return {
                ...state,
                isLoading: false,
                offlineLeadList: [...state.offlineLeadList, ...action.payload],
            };
        case FETCH_VERIFIED_FILTERED_LEADS:
            return {
                ...state,
                status: 'done',
                isLoading: false,
                verifiedFilteredPaginatedLeadList: action.payload.filteredPaginatedLeadList,
                verifiedFilteredLeadList: [
                    ...state.verifiedFilteredLeadList,
                    ...action.payload.filteredPaginatedLeadList.data,
                ],
                flag: action.payload.flag,
            };
        case FETCH_NON_VERIFIED_FILTERED_LEADS:
            return {
                ...state,
                status: 'done',
                isLoading: false,
                nonVerifiedFilteredPaginatedLeadList: action.payload.filteredPaginatedLeadList,
                nonVerifiedFilteredLeadList: [
                    ...state.nonVerifiedFilteredLeadList,
                    ...action.payload.filteredPaginatedLeadList.data,
                ],
                flag: action.payload.flag,
            };
        case LEAD_RESET_ACTION:
            return {
                ...state,
                verifiedPaginatedLeadList: PaginatedResponseState,
                verifiedLeadList: [],
                nonVerifiedPaginatedLeadList: PaginatedResponseState,
                nonVerifiedLeadList: [],

                verifiedFilteredLeadList: [],
                nonVerifiedFilteredLeadList: [],
                verifiedFilteredPaginatedLeadList: PaginatedResponseState,
                nonVerifiedFilteredPaginatedLeadList: PaginatedResponseState,

                offlineLeadList: state.offlineLeadList,
            };
        default:
            return state;
    }
}
