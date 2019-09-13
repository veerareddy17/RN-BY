import * as React from 'react';

import { Toast } from 'native-base';

export class Utility extends React.Component {
    public static showToast = (message: string, type: any) => {
        Toast.show({
            text: message,
            duration: 5000,
            type: type,
        });
    };
}
