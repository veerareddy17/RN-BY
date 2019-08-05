import { createStackNavigator, createAppContainer } from 'react-navigation';
import Settings from '../screens/settings/settingsScreen';
import Dashboard from '../screens/dashboard/dashboardScreen';
import Login from '../screens/login/loginScreen';
import Splash from '../screens/splash/splashScreen';
import LeadList from '../screens/leads/leadsListScreen';
import CreateLead from '../screens/leads/createLeadScreen';
import CampaignList from '../screens/campaignList/campaignListSelection';
import OTPScreen from '../screens/leads/OTPScreen';

const homeStackNavigator = createStackNavigator(
    {
        Dashboard: {
            screen: Dashboard,
        },
        Login: {
            screen: Login,
        },
        Settings: {
            screen: Settings,
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
        initialRouteName: 'Splash',
        headerMode: 'none',
    },
);
const AppContainer = createAppContainer(homeStackNavigator);

export default AppContainer;
