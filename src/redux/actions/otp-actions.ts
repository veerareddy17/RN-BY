import { SMSService } from './../../services/sendSMS-service';
import { OTP_SENT, LOAD_OTP_START, LOAD_OTP_FAIL, LOAD_OTP_INIT } from './action-types';
import { OTPRequest } from './../../models/request/otp-request';
import { LeadService } from './../../services/lead-service';
import { Dispatch } from 'redux';
import generateOTP from "../../helpers/otp-creation";
import StorageService from '../../database/storage-service';
import { StorageConstants } from '../../helpers/storage-constants';
import SendSMS from 'react-native-sms'
import config from '../../helpers/config';

export const otpStartAction = () => {
    return {
        type: LOAD_OTP_START,
    };
};

export const otpInitAction = () => {
    return {
        type: LOAD_OTP_INIT,
    };
};

export const otpFailureAction = (error) => {
    return {
        type: LOAD_OTP_FAIL,
        payload: error,
    };
};

export const otpSuccessAction = (successData) => {
    return {
        type: OTP_SENT,
        payload: successData,
    };
};

export const verifyOTP = (phone: string, connection: boolean) => async (dispatch: Dispatch) => {

    dispatch(otpStartAction());
    let OTP = await generateOTP();
    console.log('OTP generated - ', OTP);
    console.log('connection', connection);
    let otpRequest = new OTPRequest(phone, OTP);
    try {
        if (connection) {
            let response = await LeadService.verifyOTP(otpRequest);
            console.log(response.data);
            if (response && response.data) {
                try {
                    dispatch(otpSuccessAction(response.data));
                } catch (error) {
                    console.log('Error in storing asyncstorage', error);
                }
            } else {
                dispatch(otpFailureAction(response.errors));
            }
        } else {
            console.log('else');
            console.log('request in sendSMS', otpRequest)
            return new Promise((resolve, reject) => {
                SendSMS.send({
                    //Message body
                    body: config.offlineMessageBody + otpRequest.code,
                    //Recipients Number
                    recipients: [otpRequest.phone],
                    //An array of types that would trigger a "completed" response when using android
                    successTypes: ['sent', 'queued']
                }, (completed, cancelled, error) => {
                    if (completed) {
                        console.log('SMS Sent Completed');
                        dispatch(otpSuccessAction({ success: true }));
                        resolve(true);
                    } else if (cancelled) {
                        console.log('SMS Cancelled');
                        dispatch(otpFailureAction('SMS Sent Cancelled'));
                        reject(reject);
                    } else if (error) {
                        console.log('SMS error');
                        dispatch(otpFailureAction('Some error occured'));
                        reject(reject);
                    }
                });

                //await sendSMS(otpRequest);

                // let response = await SMSService.sendSMS(otpRequest);
                // console.log('response sms service', response);
            });
        }

    } catch (error) {
        // Error
        console.log(error);
    }
};

// export const sendSMS = (otpRequest: OTPRequest) => async (dispatch: Dispatch) => {
//     console.log('request in sendSMS', otpRequest)
//     await SendSMS.send({
//         //Message body
//         body: config.offlineMessageBody + otpRequest.code,
//         //Recipients Number
//         recipients: [otpRequest.phone],
//         //An array of types that would trigger a "completed" response when using android
//         successTypes: ['sent', 'queued']
//     }, (completed, cancelled, error) => {
//         if (completed) {
//             //console.log('SMS Sent Completed');
//             dispatch(otpSuccessAction({ success: true }));
//         } else if (cancelled) {
//             dispatch(otpFailureAction('SMS Sent Cancelled'));
//         } else if (error) {
//             dispatch(otpFailureAction('Some error occured'));
//         }
//     });
// }


export const submitOTP = (otp: String) => async (dispatch: Dispatch) => {
    dispatch(otpStartAction());
    let storedOTP = await StorageService.get<string>(StorageConstants.USER_OTP);
    console.log('stored otp', storedOTP);
    console.log('entered', otp);
    if (otp === storedOTP) {
        dispatch(otpSuccessAction(true));
        await StorageService.removeKey(StorageConstants.USER_OTP);
    } else {
        dispatch(otpFailureAction('OTP invalid'));
    }

};

export const otpInit = () => async (dispatch: Dispatch) => {
    dispatch(otpInitAction());
};

