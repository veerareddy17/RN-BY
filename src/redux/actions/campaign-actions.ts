import { BatchOfAttendance } from './../../models/request/batch-attendance-request';

import { formatDate } from './lead-actions';
import { Attendance } from './../../models/request/attendance-request';
import { ErrorResponse } from './../../models/response/error-response';
import { serverErrorCallAction, errorCallAction, errorCallResetAction } from './error-actions';
import { Location } from './../../models/request/location-request';

import { Dispatch } from 'redux';
import {
    FETCH_CAMPAIGN,
    LOAD_CAMPAIGN_START,
    LOAD_CAMPAIGN_SUCCESS,
    LOAD_CAMPAIGN_FAIL,
    CAMPAIGN_SELECTED_ONLINE,
    CAMPAIGN_SELECTED,
    ATTENDANCE_UPDATE,
    CAMPAIGN_SELECTED_OFFLINE,
    SYNC_ATTENDANCE_SUCCESS,
} from './action-types';
import StorageService from '../../database/storage-service';
import { CampaignService } from '../../services/campaign-service';
import { StorageConstants } from '../../helpers/storage-constants';
import { MetaResponse } from '../../models/response/meta-response';
import config from '../../helpers/config';

export const fetchCampaignsAction = campaigns => {
    return {
        type: FETCH_CAMPAIGN,
        payload: campaigns,
    };
};

export const campaignStartAction = () => {
    return {
        type: LOAD_CAMPAIGN_START,
    };
};

export const campaignSuccessAction = () => {
    return {
        type: LOAD_CAMPAIGN_SUCCESS,
    };
};

export const campaignFailureAction = error => {
    return {
        type: LOAD_CAMPAIGN_FAIL,
        payload: error,
    };
};

export const selectedCampaignRecent = (campaignSelectedOnline: Attendance) => {
    return {
        type: CAMPAIGN_SELECTED_ONLINE,
        payload: campaignSelectedOnline,
    };
};

export const selectedCampaignArray = (selectedCampaigns: Attendance[]) => {
    return {
        type: CAMPAIGN_SELECTED_OFFLINE,
        payload: selectedCampaigns,
    };
};

export const syncSuccess = (selectedCampaigns: Attendance[]) => {
    return {
        type: SYNC_ATTENDANCE_SUCCESS,
        payload: selectedCampaigns,
    };
};

export const selectedCampaignAction = (campaignSelected: MetaResponse) => {
    return {
        type: CAMPAIGN_SELECTED,
        payload: campaignSelected,
    };
};


export const fetchCampaigns = (): ((dispatch: Dispatch, getState: any) => Promise<void>) => {
    return async (dispatch: Dispatch, getState: any) => {
        let isConnected = getState().connectionStateReducer.isConnected;
        if (!isConnected) {
            let response = getState().campaignReducer.campaignList;
            dispatch(fetchCampaignsAction(response));
            return;
        }
        dispatch(campaignStartAction());

        try {
            const response = await CampaignService.fetchCampaigns();
            if (response && response.data) {
                dispatch(fetchCampaignsAction(response.data));
            } else {
                dispatch(errorCallAction(response.errors));
                dispatch(campaignFailureAction(response.errors));
            }
        } catch (e) {
            let errors = Array<ErrorResponse>();
            console.log('error from campagin action', errors);
            errors.push(new ErrorResponse('Server', e.message));
            dispatch(serverErrorCallAction(errors));
            dispatch(campaignFailureAction(e.message));
        }
    };
};

export const selectedCampaign = (selectedCampaign: any) => async (dispatch: Dispatch, getState: any) => {
    dispatch(errorCallResetAction());
    dispatch(campaignStartAction());
    try {
        let selectedCamp = new MetaResponse();
        selectedCamp.id = selectedCampaign.id;
        selectedCamp.name = selectedCampaign.name;

        let location = getState().locationReducer.location;
        let attendanceArray = getState().campaignReducer.attendance;
        let previousAttendance = getState().campaignReducer.onlineSelection;
        if (getState().connectionStateReducer.isConnected) {
            let attendance = newAttendanceRequestOnline(selectedCamp.id, location);
            const attendanceResp = await CampaignService.attendance(attendance);
            if (attendanceResp && attendanceResp.data) {
                attendance.check_in = attendanceResp.data.check_in;
                let checkoutDate = new Date();
                checkoutDate.setHours(23, 59, 59);
                attendance.check_out = formatDate(checkoutDate);
                dispatch(selectedCampaignAction(selectedCamp));
                dispatch(selectedCampaignRecent(attendance));
            } else {
                dispatch(errorCallAction(attendanceResp.errors));
            }
            return;
        } else if (attendanceArray.length === 0 && previousAttendance !== "") {
            if (previousAttendance.campaign_id !== selectedCamp.id) {
                previousAttendance.check_out = formatDate(new Date());
                attendanceArray.push(previousAttendance);
                let attendance = newAttendanceRequestForEodOffline(selectedCamp.id, location);
                attendanceArray.push(attendance);
                dispatch(selectedCampaignAction(selectedCamp));
                dispatch(selectedCampaignArray(attendanceArray));
                return;
            }
            attendanceArray.push(previousAttendance);
            dispatch(selectedCampaignAction(selectedCamp));
            dispatch(selectedCampaignArray(attendanceArray));
            return;
        } else if (attendanceArray.length > 0) {
            if (attendanceArray.some((x: Attendance) => x.check_out.match("23:59:59")
                && x.campaign_id !== selectedCamp.id)) {
                let attendance = newAttendanceRequestForEodOffline(selectedCamp.id, location);
                let previousCampaignData = attendanceArray.find((x: Attendance) => x.check_out.match("23:59:59"));
                previousCampaignData.check_out = formatDate(new Date());
                previousCampaignData.check_out_flag = true;
                attendanceArray.push(attendance);
                dispatch(selectedCampaignAction(selectedCamp));
                dispatch(selectedCampaignArray(attendanceArray));
            }
            return;
        }


    } catch (e) {
        let errors = Array<ErrorResponse>();
        errors.push(new ErrorResponse('Server', e.message));
        dispatch(serverErrorCallAction(errors));
        dispatch(campaignFailureAction(e));
    }
};

export const newAttendanceRequestOnline = (selectedCampaignId: string, location: any): Attendance => {
    let attendance = new Attendance();
    let locationReq = new Location(location.latitude, location.longitude);
    attendance.campaign_id = selectedCampaignId;
    attendance.location = locationReq;
    return attendance;
}

export const newAttendanceRequestForEodOffline = (selectedCampaignId: string, location: any): Attendance => {
    let attendance = new Attendance();
    let locationReq = new Location(location.latitude, location.longitude);
    attendance.campaign_id = selectedCampaignId;
    attendance.check_in = formatDate(new Date());
    let checkoutDate = new Date();
    checkoutDate.setHours(23, 59, 59);
    attendance.check_out = formatDate(checkoutDate);
    attendance.check_out_flag = false;
    attendance.location = locationReq;
    return attendance;
}

export const syncOfflineAttendance = () => async (dispatch: Dispatch, getState: any) => {
    try {
        let attendanceArray = getState().campaignReducer.attendance;
        if (getState().connectionStateReducer.isConnected) {
            do {
                let batch = new BatchOfAttendance();
                batch.attendances = attendanceArray.slice(0, config.OFFLINE_ATTENDANCE_BATCH_SIZE);
                const response = await CampaignService.attendance_offlineSync(batch)
                if (response && response.data) {
                    attendanceArray.splice(0, config.OFFLINE_ATTENDANCE_BATCH_SIZE);
                    if (attendanceArray.length === 1 && attendanceArray.some((x: Attendance) => x.check_out.match("23:59:59"))) {
                        dispatch(selectedCampaignRecent(attendanceArray.find((x: Attendance) => x.check_out.match("23:59:59"))));
                    }
                    dispatch(syncSuccess(attendanceArray));
                }
            } while (attendanceArray.length > 0)
        }
    } catch (e) {
        let errors = Array<ErrorResponse>();
        errors.push(new ErrorResponse('Server', e.message));
        dispatch(serverErrorCallAction(errors));
        dispatch(campaignFailureAction(e));
    }
}