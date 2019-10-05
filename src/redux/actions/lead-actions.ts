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
    leadSuccessAction,
    fetchFilteredLeadsAction,
    leadResetAction,
} from './lead-action-creator';
import { LeadResponse } from '../../models/response';
import { SyncLeadRequest } from '../../models/request/sync-leads-request';
import config from '../../helpers/config';
import { LeadAllResponse } from '../../models/response/lead-all-response';
import { LeadFilterResponse } from '../../models/response/lead-filter-response';
import { PaginatedResponseState } from '../init/lead-initial-state';
import StorageService from '../../database/storage-service';
import { StorageConstants } from '../../helpers/storage-constants';

// GET method to fetch all captured leads
export const fetchAllLeadsApi = (
    pageNumber: number,
    isOtpVerified: boolean,
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
            let reducerData = getState().leadReducer;
            if (reducerData.paginatedLeadList.current_page !== pageNumber) {
                const response = await LeadService.fetchLeads(pageNumber, isOtpVerified);
                let leadsResponse = new LeadAllResponse();
                if (response && response.data) {
                    leadsResponse.paginatedLeadList = response.data;
                    dispatch(fetchLeadsAction(leadsResponse));
                } else {
                    dispatch(leadFailureAction(response.errors));
                    dispatch(serverErrorCallAction(response.errors));
                }
            }
            dispatch(leadSuccessAction());
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
                await StorageService.removeKey(StorageConstants.USER_OTP);
            } else {
                dispatch(errorCallAction(response.errors));
                dispatch(leadFailureAction(response.errors));
            }
        } catch (e) {
            let errors = Array<ErrorResponse>();
            errors.push(new ErrorResponse('Server', e.message));
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
    return async (dispatch: Dispatch, getState: any) => {
        let isConnected = getState().connectionStateReducer.isConnected;
        if (isConnected) {
            let leadsToSync = getState().leadReducer.offlineLeadList;
            try {
                do {
                    let batchLeads = getLeadsByBatch(leadsToSync);
                    let response = await LeadService.syncLeads(batchLeads);
                    if (response && response.data) {
                        leadsToSync.splice(0, batchLeads.leads.length);
                        dispatch(syncOfflineLeadsAction(response.data.success));
                    } else {
                        dispatch(leadFailureAction(response.errors));
                    }
                } while (leadsToSync.length > 0);
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
    let batchSize = config.OFFLINE_LEAD_BATCH_SIZE;
    let filteredLeads = totalLeads.slice(0, batchSize);
    filteredLeads.forEach(leadRes => {
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

export const formatDate = (date: Date): string => {
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

export const fetchFilteredLeads = (
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
            let reducerData = getState().leadReducer;
            // IF filter type is changed
            if (reducerData.flag !== flag) {
                reducerData.filteredLeadList = [];
                reducerData.filteredPaginatedLeadList = PaginatedResponseState;
            }
            if (reducerData.filteredPaginatedLeadList.current_page !== pageNumber) {
                const response = await LeadService.fetchFilteredLeads(pageNumber, flag);
                let leadsFilterResponse = new LeadFilterResponse();
                if (response && response.data) {
                    leadsFilterResponse.filteredPaginatedLeadList = response.data;
                    leadsFilterResponse.flag = flag;
                    dispatch(fetchFilteredLeadsAction(leadsFilterResponse));
                } else {
                    dispatch(leadFailureAction(response.errors));
                    dispatch(serverErrorCallAction(response.errors));
                }
            }
            dispatch(leadSuccessAction());
        } catch (e) {
            let errors = Array<ErrorResponse>();
            errors.push(new ErrorResponse('Server', e.message));
            dispatch(serverErrorCallAction(errors));
        }
    };
};

export const resetLeads = (): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState) => {
        dispatch(leadResetAction());
    };
};
