import { PermissionsAndroid } from 'react-native';

export default function requestLocationPermission() {
    try {
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'App needs Location Permission',
                message: 'Access location',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );

    } catch (err) {
        console.warn(err);
    }
}