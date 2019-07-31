import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import authHeader from '../helpers/authHeader';
import config from '../helpers/config';

export const getCampaigns = async () => {
    let header = await authHeader();
    const options = {
        params: {},
        headers: { ...header, 'Content-Type': 'application/json' },
    };
    try {
        let response = await axios.get(`${config.api.baseURL}/campaign/all`, options);
        if (response.status == 200) {
            console.log(response.data.data);
            try {
                await AsyncStorage.setItem('campaigns', JSON.stringify(response.data.data));
            } catch (error) {
                console.log('Error in storing asyncstorage', error);
            }
            return response.data.data;
        }
    } catch (error) {
        // Error
        console.log(error);
    }
};
