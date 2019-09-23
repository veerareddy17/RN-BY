import {
    ADD_LEAD,
    FETCH_LEAD,
    LOAD_LEAD_START,
    LOAD_LEAD_SUCCESS,
    LOAD_LEAD_FAIL,
    ADD_OFFLINE_LEAD,
    FETCH_OFFLINE_LEAD,
    SYNC_OFFLINE_LEADS,
    DELETE_SYNCED_LEADS,
    FETCH_FILTERED_LEADS,
    LEAD_RESET_ACTION,
} from './action-types';
import { LeadFilterResponse } from '../../models/response/lead-all-response';
import { LeadAllResponse } from '../../models/response/lead-filter-response';

// The action creators
export const createLeadAction = lead => {
    return {
        type: ADD_LEAD,
        payload: lead,
    };
};

export const fetchLeadsAction = (leads: LeadAllResponse) => {
    return {
        type: FETCH_LEAD,
        payload: leads,
    };
};

export const leadStartAction = () => {
    return {
        type: LOAD_LEAD_START,
    };
};

export const leadSuccessAction = () => {
    return {
        type: LOAD_LEAD_SUCCESS,
    };
};

export const leadFailureAction = error => {
    return {
        type: LOAD_LEAD_FAIL,
        payload: error,
    };
};

export const createOfflineLeadAction = lead => {
    return {
        type: ADD_OFFLINE_LEAD,
        payload: lead,
    };
};

export const fetchOfflineLeadsAction = () => {
    return {
        type: FETCH_OFFLINE_LEAD,
    };
};

export const syncOfflineLeadsAction = (status: boolean) => {
    return {
        type: SYNC_OFFLINE_LEADS,
        payload: status,
    };
};

export const deleteOfflineLeadsAction = leads => {
    return {
        type: DELETE_SYNCED_LEADS,
        payload: leads,
    };
};

export const fetchFilteredLeadsAction = (leads: LeadFilterResponse) => {
    return {
        type: FETCH_FILTERED_LEADS,
        payload: leads,
    };
};

export const leadResetAction = () => {
    return {
        type: LEAD_RESET_ACTION,
    };
};
