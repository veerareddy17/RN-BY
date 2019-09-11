import * as React from 'react';

import { ErrorResponse } from "../../models/response/error-response";
import { Toast } from "native-base";

export class ToastError extends React.Component {

    public static toastErr = (errors: ErrorResponse[]) => {
        console.log('inside toastErr', errors.toString());
        const all_erros = errors.map((error, i) => {
            return error.message;
        });

        Toast.show({
            text: all_erros.toString(),
            buttonText: 'Ok',
            duration: 5000,
            type: 'danger',
        });
    }
}