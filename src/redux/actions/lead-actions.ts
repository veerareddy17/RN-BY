import { ErrorResponse } from './../../models/response/error-response';
import { errorCallResetAction, errorCallAction, serverErrorCallAction } from './error-actions';
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
    syncOfflineLeadsAction,
    deleteOfflineLeadsAction,
} from './lead-action-creator';
import { LeadResponse } from '../../models/response';
import { LeadFilterResponse } from '../../models/response/lead-filter-response';
import { SyncLeadRequest } from '../../models/request/sync-leads-request';

// GET method to fetch all captured leads
export const fetchAllLeadsApi = (
    pageNumber: number,
    flag: string,
): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState) => {
        try {
            let isConnected = getState().connectionStateReducer.isConnected;
            if (!isConnected) {
            	dispatch(fetchOfflineLeadsAction());
                return;
            }
            dispatch(errorCallResetAction());
            if (pageNumber === 1) {
                dispatch(leadStartAction());
            }
            const response = await LeadService.fetchLeads(pageNumber, flag);
            let leadsResponse = new LeadFilterResponse();
            if (response && response.data) {
                let reducerData = getState().leadReducer;
                if (reducerData.flag !== flag) {
                    reducerData.leadList = [];
                    reducerData.paginatedLeadList = [];
                }
                leadsResponse.paginatedLeadList = response.data;
                leadsResponse.flag = flag;
                dispatch(fetchLeadsAction(leadsResponse));
            } else {
                dispatch(leadFailureAction(response.errors));
                dispatch(serverErrorCallAction(response.errors));
            }
        } catch (e) {
            let errors = Array<ErrorResponse>();
            errors.push(new ErrorResponse('Server', e.message));
            dispatch(serverErrorCallAction(errors));
        }
    };
};

// POST method to create Lead
export const createLeadApi = (leadRequest: LeadRequest): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState) => {
        try {
            dispatch(errorCallResetAction());
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
                dispatch(errorCallAction(response.errors))
                dispatch(leadFailureAction(response.errors));
            }
        } catch (e) {
            let errors = Array<ErrorResponse>();
            errors.push(new ErrorResponse('Server', e.message))
            dispatch(serverErrorCallAction(errors));
            dispatch(leadFailureAction(e.message));
        }

    };
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

export const syncOfflineLeads = (): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState) => {
        let isConnected = getState().connectionStateReducer.isConnected;
        if (isConnected) {
            let leadsToSync = getState().leadReducer.offlineLeadList;
            console.log('Init leads to sync', leadsToSync.length);
            try {
                let batchCount = 1;
                do {
                    let batchLeads = getLeadsByBatch(leadsToSync);
                    // let response = await LeadService.syncLeads(batchLeads);
                    // if (response && response.data) {
                    //     dispatch(syncOfflineLeadsAction(response.data.success));
                    //update offline leads
                    console.log('Offline remaining before delete: ', leadsToSync.length);
                    leadsToSync.splice(0, batchLeads.leads.length);
                    // dispatch(deleteOfflineLeadsAction(leadsToSync));
                    console.log('Offline remaining leads after sync: ', leadsToSync.length);
                    // } else {
                    // dispatch(leadFailureAction(response.errors));
                    // }
                } while (leadsToSync.length > 0);
                console.log('LeadsToSync :', leadsToSync);
            } catch (error) {
                console.log(error);
            }
        }
    };
};

//Used while offline
export const transformRequestToResponse = (leadRequest: LeadRequest, store: any): LeadResponse => {
    let leadResponse = new LeadResponse();
    leadResponse = Object.assign(leadResponse, leadRequest);
    leadResponse.board = getSelectedBoard(leadRequest.board_id, store);
    leadResponse.classes = getSelectedClass(leadRequest.classes_id, store);
    leadResponse.state = getSelectedState(leadRequest.state_id, store);
    leadResponse.sync_status = false;
    let created_at = formatDate(new Date());
    leadResponse.created_at = created_at;
    return leadResponse;
};

export const transformResponseToRequest = (leadResponse: LeadResponse): LeadRequest => {
    let leadRequest = new LeadRequest();
    leadRequest = Object.assign(leadRequest, leadResponse);
    delete leadRequest.id;
    leadRequest.sync_status = false;
    return leadRequest;
};

export const getLeadsByBatch = (totalLeads: LeadResponse[]): SyncLeadRequest => {
    let syncLeads = new SyncLeadRequest();
    syncLeads.leads = [];
    let batchLeads = [];
    let batchSize = 1;
    console.log('tot', totalLeads.length);
    if (totalLeads.length > batchSize) {
        batchLeads = totalLeads.splice(0, batchSize);
    }
    console.log('lead by batch', batchLeads.length);
    batchLeads.forEach(leadRes => {
        syncLeads.leads.push(transformResponseToRequest(leadRes));
    });
    return syncLeads;
};

export const updateStatusOfflineSyncedLeads = (syncedLeads: LeadResponse[], store: any): boolean => {
    syncedLeads.forEach(leadRes => {
        leadRes.sync_status = true;
        syncedLeads.leads.push(transformResponseToRequest(leadRes));
    });
    return true;
};

export const formatDate = (date: any): string => {
    return (
        date.getFullYear() +
        '-' +
        leftpad(date.getMonth() + 1, 2) +
        '-' +
        leftpad(date.getDate(), 2) +
        ' ' +
        leftpad(date.getHours(), 2) +
        ':' +
        leftpad(date.getMinutes(), 2) +
        ':' +
        leftpad(date.getSeconds(), 2)
    );
};

export const leftpad = (val, resultLength = 2, leftpadChar = '0'): string => {
    return (String(leftpadChar).repeat(resultLength) + String(val)).slice(String(val).length);
};
