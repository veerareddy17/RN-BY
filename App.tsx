import React from 'react';
import { Provider } from 'react-redux';
import { Root } from 'native-base';
import { PersistGate } from 'redux-persist/es/integration/react';
import AppContainer from './src/navigation/router';
import { NetworkProvider } from './src/provider/network-provider';
import { store, persistor } from './src/redux/store';
import { HttpBaseService } from './src/services/http-base-service';

const App = () => {
    console.disableYellowBox = true;
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <NetworkProvider>
                    <Root>
                        <AppContainer />
                    </Root>
                </NetworkProvider>
            </PersistGate>
        </Provider>
    );
};

HttpBaseService.init(() => {
    console.log('Init Http Base Service...');
});

export default App;
