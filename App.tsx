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

import AppContainer from './src/navigation/router'
import { NetworkProvider } from './src/provider/network-provider'

const App = () => {
  return (
    <NetworkProvider>
      <AppContainer />
    </NetworkProvider>
  )
}

export default App
