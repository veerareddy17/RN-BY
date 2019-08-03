import { Dispatch } from 'redux';
import axios from 'axios';
import authHeader from '../../helpers/authHeader';
import config from '../../helpers/config';
import { FETCH_CAMPAIGN } from './actionTypes';
import storage from '../../database/storage';

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
        if (response.data.data !== null) {
            dispatch(fetchCampaignsAction(response.data.data));
            try {
                await storage.storeData('campaigns', response.data.data);
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
