import {
    createStackNavigator,
    createAppContainer,
    createSwitchNavigator,
    createBottomTabNavigator,
} from 'react-navigation';
import Dashboard from '../screens/dashboard/dashboard-screen';
import Login from '../screens/login/login-screen';
import Splash from '../screens/splash/splash-screen';
import LeadList from '../screens/leads/leads-list-screen';
import CreateLead from '../screens/leads/create-lead-screen';
import CampaignList from '../screens/campaign/campaign-list-selection';
import { View, Icon, Text } from 'native-base';
import React from 'react';
import AddNewIcon from './add-new';
import FilteredLeads from '../screens/leads/filtered-leads';

const AuthStack = createStackNavigator({
    Login: {
        screen: Login,
        path: 'login',
    },
});

const CampaignListStack = createStackNavigator({
    CampaignList: {
        screen: CampaignList,
        path: 'campaignList',
        navigationOptions: {
            header: null,
        },
    },
});

const DashboardStack = createStackNavigator(
    {
        Dashboard: {
            screen: Dashboard,
            path: 'dashboard',
            navigationOptions: {
                header: null,
                headerBackTitle: null,
            },
        },
        FilteredLeads: {
            screen: FilteredLeads,
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#813588',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: '700',
                alignSelf: 'center',
            },
        },
    },
);

DashboardStack.navigationOptions = ({ navigation }) => {
    return {
        tabBarVisible: navigation.state.index === 0,
    };
};

const TabStack = createBottomTabNavigator(
    {
        Dashboard: {
            screen: DashboardStack,
            path: 'dashboardStack',
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="home" style={{ color: tintColor, fontSize: 20 }} />
                        <Text
                            style={{
                                color: tintColor,
                                fontSize: focused ? 15 : 14,
                                fontWeight: focused ? '700' : '100',
                                fontFamily: 'system font',
                            }}
                        >
                            Dashboard
                        </Text>
                    </View>
                ),
            },
        },
        CreateLead: {
            screen: CreateLead,
            path: 'createLead',
            navigationOptions: () => ({
                tabBarIcon: <AddNewIcon />,
                tabBarVisible: false,
            }),
        },
        LeadList: {
            screen: LeadList,
            path: 'LeadList',
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="people" style={{ color: tintColor, fontSize: 20 }} />
                        <Text
                            style={{
                                color: tintColor,
                                fontSize: focused ? 15 : 14,
                                fontWeight: focused ? '700' : '100',
                                fontFamily: 'system font',
                            }}
                        >
                            Leads
                        </Text>
                    </View>
                ),
            },
        },
    },
    {
        initialRouteName: 'Dashboard',
        lazy: false,
        tabBarOptions: {
            activeTintColor: '#813588',
            inactiveTintColor: '#555',
            showLabel: false,
            style: {
                backgroundColor: '#fff',
                elevation: 25,
                shadowOffset: { width: 5, height: 5 },
                shadowColor: 'grey',
                shadowOpacity: 0.5,
                shadowRadius: 10,
                borderTopWidth: 0,
            },
            tabStyle: {
                // borderColor: 'red',
                // borderWidth: 1,
            },
        },
    },
);

const MainApp = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: {
                screen: Splash,
                path: '',
            },
            Auth: {
                screen: AuthStack,
                path: '',
            },
            Campaigns: {
                screen: CampaignListStack,
                path: '',
            },
            App: {
                screen: TabStack,
                path: '',
            },
        },
        {
            initialRouteName: 'AuthLoading',
        },
    ),
);

const prefix = 'sso://';

const AppContainer = () => <MainApp uriPrefix={prefix} />;

export default AppContainer;
