import { Dispatch } from 'redux';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import authHeader from '../../helpers/authHeader';
import config from '../../helpers/config';
import { FETCH_CAMPAIGN, LOAD_CAMPAIGN_START, LOAD_CAMPAIGN_SUCCESS, LOAD_CAMPAIGN_FAIL, CAMPAIGN_SELECTED } from './actionTypes';

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
        let response = await axios.get(`${config.api.baseURL}/campaign/all`, options);
        // console.log(response.data.data);
        if (response.data.data !== null) {
            dispatch(fetchCampaignsAction(response.data.data));
            try {
                await AsyncStorage.setItem('campaigns', JSON.stringify(response.data.data));
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
        } else {
            dispatch(fetchCampaignsAction(response.data.errors));
        }
    } catch (error) {
        // Error
        console.log(error);
    }
};

export const selectedCampaign = (campaignId: any) => async (dispatch: Dispatch) => {
    console.log('inside campaign action', campaignId)
    dispatch(campaignStartAction());
    try {
        await AsyncStorage.setItem('campaignSelectedId', JSON.stringify(campaignId));
        console.log('campaign successfully stored in async');
        dispatch(campaignSuccessAction());
    } catch (error) {
        console.log(error);
        dispatch(campaignFailureAction(error))
    }

};