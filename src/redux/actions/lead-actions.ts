import { Dispatch, Store } from 'redux';
import { LeadService } from '../../services/lead-service';
import { LeadRequest } from '../../models/request';
import {
    createLeadAction,
    fetchLeadsAction,
    leadStartAction,
    leadFailureAction,
    createOfflineLeadAction,
    fetchOfflineLeadsAction,
} from './lead-action-creator';
import { LeadResponse } from '../../models/response';
import { MetaResponse } from '../../models/response/meta-response';

// GET method to fetch all captured leads
export const fetchAllLeadsApi = (pageNumber: number): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    console.log('action lead is... =>', pageNumber);
    return async (dispatch: Dispatch, getState) => {
        let isConnected = getState().connectionStateReducer.isConnected;
        if (!isConnected) {
            let response = getState().leadReducer.offlineLeadList;
            dispatch(fetchOfflineLeadsAction(response));
            return;
        }
        try {
            if (pageNumber === 1) {
                dispatch(leadStartAction());
            }
            const response = await LeadService.fetchLeads(pageNumber);
            if (response && response.data) {
                dispatch(fetchLeadsAction(response.data));
            } else {
                dispatch(leadFailureAction(response.errors));
            }
        } catch (error) {
            console.log(error);
        }
    };
};

// POST method to create Lead
export const createLeadApi = (leadRequest: LeadRequest): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState) => {
        let isConnected = getState().connectionStateReducer.isConnected;
        if (!isConnected) {
            let response = transformRequestToResponse(leadRequest);
            dispatch(createOfflineLeadAction(response));
            return;
        }
        try {
            dispatch(leadStartAction());
            let response = await LeadService.createLead(leadRequest);
            if (response && response.data) {
                dispatch(createLeadAction(response.data));
            } else {
                dispatch(leadFailureAction(response.errors));
            }
        } catch (error) {
            // Error
            console.log(error);
        }
    };
};

export const transformRequestToResponse = (leadRequest: LeadRequest): LeadResponse => {
    let leadResponse = new LeadResponse();
    leadResponse = Object.assign(leadResponse, leadRequest);
    leadResponse.board = new MetaResponse(leadRequest.board_id, 'ICSE');
    leadResponse.classes = new MetaResponse(leadRequest.classes_id, '9');
    leadResponse.sync_status = false;
    return leadResponse;
};