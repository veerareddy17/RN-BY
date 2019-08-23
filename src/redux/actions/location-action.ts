import { Dispatch } from 'redux';
import { LOCATION_CAPTURE_SUCCESS, LOCATION_CAPTURE_FAILURE, LOCATION_CAPTURE_PERMISSION, LOCATION_CAPTURE_START } from './action-types';

import Geolocation from 'react-native-geolocation-service';

export const locationCaptureSuccessAction = location => {
    console.log('success action val', location);
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

export const captureLocation = (): ((dispatch: Dispatch) => Promise<void>) => {
    return async (dispatch: Dispatch) => {
        dispatch(locationCaptureStart());
        // dispatch(locationCaptureSuccessAction({ res: 'kjbkj' }));
        // dispatch(locationCaptureSuccessAction({ name: 'hcgh' }));
        await Geolocation.getCurrentPosition(async (position) => {
            console.log('position capture in action', position.coords);
            await dispatch(locationCaptureSuccessAction(position))
        },
            (error) => {
                dispatch(locationCaptureFailureAction(error))
            },
            { enableHighAccuracy: true }
        );

        // console.log('varibale positon..', JSON.parse(location.));
        // dispatch(locationCaptureSuccessAction(positionValue))
    };
};
