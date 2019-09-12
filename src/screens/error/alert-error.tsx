
import * as React from 'react';

import { Alert } from "react-native";
import { ErrorResponse } from "../../models/response/error-response";

export class AlertError extends React.Component {

    public static alertErr = (errors: ErrorResponse[]) => {
        console.log('inside alertErr', errors.toString());
        const all_erros = errors.map((error, i) => {
            return error.message;
        });

        Alert.alert(
            'Error',
            all_erros.toString(),
            [
                { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false },
        );
        // Alert.alert();
    }
}
