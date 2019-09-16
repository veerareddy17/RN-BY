import { ErrorResponse } from './../../models/response/error-response';
import { serverErrorCallAction, errorCallAction, errorCallResetAction } from './error-actions';
import { Dispatch } from 'redux';
import {
    FETCH_CAMPAIGN,
    LOAD_CAMPAIGN_START,
    LOAD_CAMPAIGN_SUCCESS,
    LOAD_CAMPAIGN_FAIL,
    CAMPAIGN_SELECTED,
} from './action-types';
import StorageService from '../../database/storage-service';
import { CampaignService } from '../../services/campaign-service';
import { StorageConstants } from '../../helpers/storage-constants';
import { MetaResponse } from '../../models/response/meta-response';

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
            console.log('response', response.data && response.data ? response.data : "");
            if (response && response.data) {
                dispatch(fetchCampaignsAction(response.data));
            } else {
                dispatch(errorCallAction(response.errors));
                dispatch(campaignFailureAction(response.errors));
            }
        } catch (e) {
            let errors = Array<ErrorResponse>();
            errors.push(new ErrorResponse('Server', e.message));
            dispatch(serverErrorCallAction(errors));
            dispatch(campaignFailureAction(e.message));
        }
    };
};

export const selectedCampaign = (selectedCampaign: any) => async (dispatch: Dispatch) => {
    dispatch(errorCallResetAction());
    dispatch(campaignStartAction());
    try {
        let selectedCamp = new MetaResponse();
        selectedCamp.id = selectedCampaign.id;
        selectedCamp.name = selectedCampaign.name;
        dispatch(selectedCampaignAction(selectedCamp));
    } catch (e) {
        console.log(e);
        let errors = Array<ErrorResponse>();
        errors.push(new ErrorResponse('Server', e.message));
        dispatch(serverErrorCallAction(errors));
        dispatch(campaignFailureAction(e));
    }
};
