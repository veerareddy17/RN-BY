import { Dispatch } from 'redux';
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

// GET method to fetch all captured leads
export const fetchAllLeadsApi = (pageNumber: number): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState) => {
        let isConnected = getState().connectionStateReducer.isConnected;
        if (!isConnected) {
            let response = getState().leadReducer.offlineLeadList;
            dispatch(fetchOfflineLeadsAction(response));
            return;
        }
        if (pageNumber === 1) {
            dispatch(leadStartAction());
        }
        const response = await LeadService.fetchLeads(pageNumber);
        if (response && response.data) {
            dispatch(fetchLeadsAction(response.data));
        } else {
            dispatch(leadFailureAction(response.errors));
        }
    };
};

// POST method to create Lead
export const createLeadApi = (leadRequest: LeadRequest): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState) => {
        let isConnected = getState().connectionStateReducer.isConnected;
        if (!isConnected) {
            let response = transformRequestToResponse(leadRequest, getState());
            dispatch(createOfflineLeadAction(response));
            return;
        }
        dispatch(leadStartAction());
        let response = await LeadService.createLead(leadRequest);
        if (response && response.data) {
            dispatch(createLeadAction(response.data));
        } else {
            dispatch(leadFailureAction(response.errors));
        }
    };
};

export const transformRequestToResponse = (leadRequest: LeadRequest, store: any): LeadResponse => {
    let leadResponse = new LeadResponse();
    leadResponse = Object.assign(leadResponse, leadRequest);
    leadResponse.board = getSelectedBoard(leadRequest.board_id, store);
    leadResponse.classes = getSelectedClass(leadRequest.classes_id, store);
    leadResponse.state = getSelectedState(leadRequest.state_id, store);
    leadResponse.sync_status = false;
    return leadResponse;
};

export const getSelectedBoard = (board_id: string, store: any) => {
    return store.metaDataReducer.boardResponse.find(board => board.id == Number(board_id));
};

export const getSelectedClass = (classes_id: string, store: any) => {
    return store.metaDataReducer.classesResponse.find(classes => classes.id == Number(classes_id));
};

export const getSelectedState = (state_id: string, store: any) => {
    return store.metaDataReducer.stateResponse.find(state => state.id == Number(state_id));
};
