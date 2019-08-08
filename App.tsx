import React from 'react';
import { Provider } from 'react-redux';

import AppContainer from './src/navigation/router';
import { NetworkProvider } from './src/provider/network-provider';
import store from './src/redux/store';

const App = () => {
    console.disableYellowBox = true;
    return (
        <Provider store={store}>
            <NetworkProvider>
                <AppContainer />
            </NetworkProvider>
        </Provider>
    );
};

export default App;
