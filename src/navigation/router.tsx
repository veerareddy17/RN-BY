import { createStackNavigator, createAppContainer } from 'react-navigation';
import Dashboard from '../screens/dashboard/dashboard-screen';
import Login from '../screens/login/login-screen';
import Splash from '../screens/splash/splash-screen';
import LeadList from '../screens/leads/leads-list-screen';
import CreateLead from '../screens/leads/create-lead-screen';
import CampaignList from '../screens/campaign/campaign-list-selection';
import OTPScreen from '../screens/leads/otp-screen';

const homeStackNavigator = createStackNavigator(
    {
        Dashboard: {
            screen: Dashboard,
        },
        Login: {
            screen: Login,
        },
        Splash: {
            screen: Splash,
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
        initialRouteName: 'Login',
        headerMode: 'none',
    },
);
const AppContainer = createAppContainer(homeStackNavigator);

export default AppContainer;
