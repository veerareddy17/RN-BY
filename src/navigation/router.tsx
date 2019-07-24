import Settings from '../screens/settings/settings-screen';
import Dashboard from '../screens/dashboard/dashboard-screen';
import Login from '../screens/login/login-screen';
import Splash from '../screens/splash/splash-screen';

import { createStackNavigator, createAppContainer } from "react-navigation";

const homeStackNavigator = createStackNavigator({
    Dashboard: {
      screen: Dashboard
    },
    Login: {
        screen: Login
      },
      Settings: {
        screen: Settings
      },
      Splash: {
        screen: Splash
      }
  },
  {
      initialRouteName: 'Splash',
      headerMode: 'none'
  }

  );
  const AppContainer = createAppContainer(homeStackNavigator);

  export default AppContainer;