import React from 'react';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import AppContainer from './src/navigation/router';
import { NetworkProvider } from './src/provider/network-provider';
import store from './src/redux/store';
import { HttpBaseService } from './src/services/http-base-service';

const App = () => {
    console.disableYellowBox = true;
    return (
        <Provider store={store}>
            <NetworkProvider>
                <Root>
                    <AppContainer />
                </Root>
            </NetworkProvider>
        </Provider>
    );
};

HttpBaseService.init(() => {
    console.log('Init Http Base Service...');
});

export default App;
