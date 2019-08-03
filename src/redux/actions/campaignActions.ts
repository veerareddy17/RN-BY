import { Dispatch } from 'redux';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import authHeader from '../../helpers/authHeader';
import config from '../../helpers/config';
import { FETCH_CAMPAIGN } from './actionTypes';

export const fetchCampaignsAction = campaigns => {
    return {
        type: FETCH_CAMPAIGN,
        payload: campaigns,
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
