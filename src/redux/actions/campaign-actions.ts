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

export const selectedCampaignActions = campaignSelectedId => {
    return {
        type: CAMPAIGN_SELECTED,
    };
};

export const fetchCampaigns = (): ((dispatch: Dispatch) => Promise<void>) => {
    return async (dispatch: Dispatch) => {
        const user = await StorageService.get<string>(StorageConstants.USER);
        console.log('Fetch camp action User ->', user);
        dispatch(campaignStartAction());
        const response = await CampaignService.fetchCampaigns(user.id, 1);
        console.log('Fetch camp action resp: --', response);
        if (response && response.data) {
            dispatch(fetchCampaignsAction(response.data.data));
        } else {
            dispatch(campaignFailureAction(response.errors));
        }
    };
};

export const selectedCampaign = (selectedCampaign: any) => async (dispatch: Dispatch) => {
    console.log('inside campaign action', selectedCampaign);
    dispatch(campaignStartAction());
    try {
        await StorageService.store(StorageConstants.SELECTED_CAMPAIGN, selectedCampaign);
        console.log('campaign successfully stored in async');
        dispatch(campaignSuccessAction());
    } catch (error) {
        console.log(error);
        dispatch(campaignFailureAction(error));
    }
};
