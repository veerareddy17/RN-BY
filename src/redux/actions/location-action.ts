import { ErrorResponse } from './../../models/response/error-response';
import { Dispatch } from 'redux';
import { LOCATION_CAPTURE_SUCCESS, LOCATION_CAPTURE_FAILURE, LOCATION_CAPTURE_START } from './action-types';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import SystemSetting from 'react-native-system-setting';
import { Location } from '../init/location-initial-state';
import { errorCallResetAction, serverErrorCallAction, errorCallAction } from './error-actions';

export const locationCaptureStart = () => {
    return {
        type: LOCATION_CAPTURE_START,
    };
};

export const locationCaptureSuccessAction = (location: Location) => {
    return {
        type: LOCATION_CAPTURE_SUCCESS,
        payload: location,
    };
};

export const locationCaptureFailureAction = (error: string) => {
    return {
        type: LOCATION_CAPTURE_FAILURE,
        payload: error,
    };
};

export const captureLocation = (): ((dispatch: Dispatch) => Promise<boolean>) => {
    return async (dispatch: Dispatch) => {
        dispatch(locationCaptureStart());
        return new Promise(async (resolve, reject) => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                    title: 'Location Permission',
                    message: 'Need Permission to access your location',
                    buttonPositive: 'OK',
                });
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the Location...');
                    SystemSetting.isLocationEnabled().then((enable: boolean) => {
                        const state = enable ? 'On' : 'Off';
                        console.log('Current location is ' + state);
                        if (state === 'On') {
                            dispatch(errorCallResetAction());
                            dispatch(locationCaptureStart());
                            Geolocation.getCurrentPosition(
                                position => {
                                    console.log('success..', position);
                                    dispatch(locationCaptureSuccessAction(position.coords));
                                    resolve(true);
                                },
                                error => {
                                    console.log('error', error);
                                    dispatch(locationCaptureFailureAction(error.message));
                                    let errors = Array<ErrorResponse>();
                                    errors.push(new ErrorResponse('Server', error.message));
                                    dispatch(serverErrorCallAction(errors));
                                    reject(errors);
                                },
                                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                            );
                        } else {
                            Alert.alert(
                                'Enable Location',
                                "To continue, turn on device location, which uses Google's location service",
                                [
                                    {
                                        text: 'Cancel',
                                        onPress: () => console.log('Cancel Pressed'),
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            SystemSetting.switchLocation(() => {
                                                console.log('switch location successfully...');
                                                dispatch(errorCallResetAction());
                                                dispatch(locationCaptureStart());
                                                Geolocation.getCurrentPosition(
                                                    position => {
                                                        console.log('success', position);
                                                        dispatch(locationCaptureSuccessAction(position.coords));
                                                        resolve(true);
                                                    },
                                                    error => {
                                                        console.log('error', error);
                                                        dispatch(locationCaptureFailureAction(error.message));
                                                        let errors = Array<ErrorResponse>();
                                                        errors.push(new ErrorResponse('Server', error.message));
                                                        dispatch(serverErrorCallAction(errors));
                                                        reject(errors);
                                                    },
                                                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                                                );
                                            });
                                        },
                                    },
                                ],
                                { cancelable: false },
                            );
                        }
                    });
                } else {
                    let errors = Array<ErrorResponse>();
                    errors.push(
                        new ErrorResponse(
                            'Server',
                            'Location permission not granted, Allow permission from Settings->Location->App Permission, Select Byjus App and click Allow',
                        ),
                    );
                    dispatch(errorCallAction(errors));
                    reject(errors);
                }
            } else {
                SystemSetting.isLocationEnabled().then((enable: boolean) => {
                    const state = enable ? 'On' : 'Off';
                    if (state === 'On') {
                        dispatch(errorCallResetAction());
                        dispatch(locationCaptureStart());
                        Geolocation.getCurrentPosition(
                            position => {
                                dispatch(locationCaptureSuccessAction(position.coords));
                                resolve(true);
                            },
                            error => {
                                dispatch(locationCaptureFailureAction(error.message));
                                let errors = Array<ErrorResponse>();
                                if (error.code !== 1) {
                                    errors.push(new ErrorResponse('Server', error.message));
                                    dispatch(serverErrorCallAction(errors));
                                } else {
                                    errors.push(new ErrorResponse('Server', 'Please enable location from Settings'));
                                    dispatch(errorCallAction(errors));
                                }
                                reject(errors);
                            },
                            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                        );
                    } else {
                        Alert.alert(
                            'Enable Location',
                            "To continue, turn on device location from Settings->Privacy->Location Services->On, which uses Google's location service",
                            [
                                {
                                    text: 'OK',
                                    onPress: () => console.log('OK Pressed'),
                                    style: 'default',
                                },
                            ],
                            { cancelable: false },
                        );
                    }
                });
            }
        });
    };
};
