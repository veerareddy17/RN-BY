import { Dispatch } from 'redux';
import axios from 'axios';
import authHeader from '../../helpers/authHeader';
import config from '../../helpers/config';
import {
import storage from '../../database/storage';
import {
    FETCH_CAMPAIGN,
    LOAD_CAMPAIGN_START,
    LOAD_CAMPAIGN_SUCCESS,
    LOAD_CAMPAIGN_FAIL,
    CAMPAIGN_SELECTED,
} from './actionTypes';

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

export const fetchCampaignsApi = (newLead: any) => async (dispatch: Dispatch) => {
    let header = await authHeader();
    const options = {
        params: {},
        headers: { ...header, 'Content-Type': 'application/json' },
    };
    try {
        dispatch(campaignStartAction());
        let response = await axios.get(`${config.api.baseURL}/campaign/all`, options);
        if (response.data.data !== null) {
            dispatch(fetchCampaignsAction(response.data.data));
            try {
                await storage.storeData('campaigns', response.data.data);
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            dispatch(campaignFailureAction(response.data.errors));
        }
    } catch (error) {
        // Error
        console.log(error);
    }
};

export const selectedCampaign = (campaignId: any) => async (dispatch: Dispatch) => {
    console.log('inside campaign action', campaignId);
    dispatch(campaignStartAction());
    try {
        await AsyncStorage.setItem('campaignSelectedId', JSON.stringify(campaignId));
        console.log('campaign successfully stored in async');
        dispatch(campaignSuccessAction());
    } catch (error) {
        console.log(error);
        dispatch(campaignFailureAction(error));
    }
};
