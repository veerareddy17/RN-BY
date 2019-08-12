import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import Dashboard from '../screens/dashboard/dashboard-screen';
import Login from '../screens/login/login-screen';
import Splash from '../screens/splash/splash-screen';
import LeadList from '../screens/leads/leads-list-screen';
import CreateLead from '../screens/leads/create-lead-screen';
import CampaignList from '../screens/campaign/campaign-list-selection';
import OTPScreen from '../screens/leads/otp-screen';

const AuthStack = createStackNavigator({ Login: Login });

const AppStack = createStackNavigator(
    {
        Dashboard: {
            screen: Dashboard,
        },
        LeadList: {
            screen: LeadList,
        },
        CreateLead: {
            screen: CreateLead,
        },
        CampaignList: {
            screen: CampaignList,
        },
        OTP: {
            screen: OTPScreen,
        },
    },
    {
        initialRouteName: 'Dashboard',
        /* The header config from Dashboard */
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#813588',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center',
            },
        },
    },
);
const AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: Splash,
            App: AppStack,
            Auth: AuthStack,
        },
        {
            initialRouteName: 'AuthLoading',
        },
    ),
);

export default AppContainer;
