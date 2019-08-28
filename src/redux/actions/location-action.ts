import { Dispatch } from 'redux';
import { LOCATION_CAPTURE_SUCCESS, LOCATION_CAPTURE_FAILURE, LOCATION_CAPTURE_START } from './action-types';
import Geolocation from 'react-native-geolocation-service';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import SystemSetting from 'react-native-system-setting';
import { Location } from '../init/location-initial-state';

export const locationCaptureStart = () => {
    return {
        type: LOCATION_CAPTURE_START,
    };
};

export const locationCaptureSuccessAction = (location: Location) => {
    console.log('from action', location);
    return {
        type: LOCATION_CAPTURE_SUCCESS,
        payload: location,
    };
};

export const locationCaptureFailureAction = (error: string) => {
    console.log('fail action val', error);
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
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                });
                console.log('granted android', granted);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log('You can use the Location...');
                    SystemSetting.isLocationEnabled().then((enable: boolean) => {
                        const state = enable ? 'On' : 'Off';
                        console.log('Current location is ' + state);
                        if (state === 'On') {
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
                                    reject(error);
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
                                                        reject(error);
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
                    console.log('Location permission denied');
                }
            } else {
                console.log('ios');
                SystemSetting.isLocationEnabled().then((enable: boolean) => {
                    const state = enable ? 'On' : 'Off';
                    console.log('Current location is ' + state);
                    if (state === 'On') {
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
                                reject(error)
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
                                            dispatch(locationCaptureStart());
                                            Geolocation.getCurrentPosition(
                                                position => {
                                                    console.log('success', position);
                                                    // let lat = position.coords.latitude;
                                                    dispatch(locationCaptureSuccessAction(position.coords));
                                                    resolve(true);
                                                },
                                                error => {
                                                    console.log('error', error);
                                                    dispatch(locationCaptureFailureAction(error.message));
                                                    reject(error);
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
            }
        });
    };
};
