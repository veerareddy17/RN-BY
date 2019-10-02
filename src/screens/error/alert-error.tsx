import * as React from 'react';

import { Alert } from 'react-native';
import { ErrorResponse } from '../../models/response/error-response';
import { NavigationScreenProp } from 'react-navigation';

export class AlertError extends React.Component {
    public static alertErr = (errors: ErrorResponse[]) => {
        const all_erros = errors.map((error, i) => {
            return error.message;
        });

        Alert.alert('Error', all_erros.toString(), [{ text: 'OK', onPress: () => console.log('OK Pressed') }], {
            cancelable: false,
        });
    };

    public static reLoginAlert = (status: boolean, nav: NavigationScreenProp<any, any>) => {
        let message = status ? 'You are Online' : 'You are Offline';
        Alert.alert('Error', 'Please Re-Login, ' + message, [{ text: 'OK', onPress: () => nav.navigate('Auth') }], {
            cancelable: false,
        });
    };
}
