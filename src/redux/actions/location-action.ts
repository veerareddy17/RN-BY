import { Dispatch } from 'redux';
import { LOCATION_CAPTURE_SUCCESS, LOCATION_CAPTURE_FAILURE, LOCATION_CAPTURE_START } from './action-types';

import Geolocation from 'react-native-geolocation-service';

export const locationCaptureSuccessAction = location => {
    return {
        type: LOCATION_CAPTURE_SUCCESS,
        payload: location,
    };
};

export const locationCaptureStart = () => {

    return {
        type: LOCATION_CAPTURE_START,
    };
};

export const locationCaptureFailureAction = error => {
    console.log('fail action val', error);
    return {
        type: LOCATION_CAPTURE_FAILURE,
        payload: error,
    };
};

export const captureLocation = (): ((dispatch: Dispatch) => Promise<boolean>) => {
    return async (dispatch: Dispatch) => {
        return new Promise((resolve, reject) => {
            Geolocation.getCurrentPosition(
                position => {
                    console.log('position', position);
                    dispatch(locationCaptureSuccessAction(position.coords));
                    resolve(true);
                },
                err => {
                    dispatch(locationCaptureFailureAction(err));
                    reject(reject);
                },
                { enableHighAccuracy: false }
            );
        });
    };
};
