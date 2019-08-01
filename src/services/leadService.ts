import axios from 'axios';
import { createLeadAction, fetchLeadsAction, fetchCampaignsAction } from '../redux/actions/leadsAction';
import AsyncStorage from '@react-native-community/async-storage';
import authHeader from '../helpers/authHeader';
import config from '../helpers/config';

// // GET method to fetch all captured leads
// export const fetchAllLeads = () => {
//   return dispatch => {
//     return axios
//       .get(`${apiUrl}/users/`)
//       .then(response => {
//         console.log(response.data)
//         dispatch(fetchLeadsAction(response.data))
//       })
//       .catch(error => {
//         console.log(error)
//         throw error
//       })
//   }
// }

// POST method to create Lead
// export const createLead = lead => {
//   return dispatch => {
//     return axios
//       .post(`${apiUrl}/posts/`, lead)
//       .then(response => {
//         console.log('response', response.data)
//         dispatch(createLeadAction(response.data))
//       })
//       .catch(error => {
//         throw error
//       })
//   }
// }

// GET method to fetch all captured leads
// export const fetchAllLeads = async () => {
//     let header = await authHeader();
//     const options = {
//         params: {},
//         headers: { ...header, 'Content-Type': 'application/json' },
//     };
//     try {
//         let response = await axios.get(`${config.api.baseURL}/lead/all`, options);
//         if (response.status == 200) {
//             console.log(response.data.data);
//             try {
//                 await AsyncStorage.setItem('leads', JSON.stringify(response.data.data));
//             } catch (error) {
//                 console.log('Error in storing asyncstorage', error);
//             }
//             return response.data.data;
//         }
//     } catch (error) {
//         // Error 😨
//         console.log(error);
//     }
// };

// // POST method to create Lead
export const createLead = async newLead => {
    let header = await authHeader();
    const options = {
        headers: { ...header, 'Content-Type': 'application/json' },
    };
    const body = JSON.stringify(newLead);
    try {
        let response = await axios.post(`${config.api.baseURL}/lead`, body, options);
        if (response.status == 200) {
            console.log(response.data.data);
            try {
                //Fetch exisiting leads and append new lead to the list
                let leadlist = await AsyncStorage.setItem('leads', response.data.data);
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
