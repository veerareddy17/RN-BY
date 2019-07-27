/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/emin93/react-native-template-typescript
 *
 * @format
 */

import React, { Fragment } from 'react'
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

import AppContainer from './src/navigation/router'
import { NetworkProvider } from './src/provider/network-provider'
import store from './src/redux/store'
import { fetchAllLeads } from './src/services/lead-service'

// store.dispatch(fetchAllLeads())

const App = () => {
  return (
    <Provider store={store}>
      <NetworkProvider>
        <AppContainer />
      </NetworkProvider>
    </Provider>
  )
}

export default App
