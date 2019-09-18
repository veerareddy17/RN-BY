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

const AuthStack = createStackNavigator({ Login: Login });

const CampaignListStack = createStackNavigator({
    CampaignList: {
        screen: CampaignList,
        navigationOptions: {
            header: null,
        },
    },
});

const DashboardStack = createStackNavigator(
    {
        Dashboard: {
            screen: Dashboard,
            navigationOptions: {
                header: null,
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
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="home" style={{ color: tintColor }} />
                        <Text
                            style={{
                                color: tintColor,
                                fontSize: focused ? 16 : 15,
                                fontWeight: focused ? '700' : '100',
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
            navigationOptions: () => ({
                tabBarIcon: <AddNewIcon />,
                tabBarVisible: false,
            }),
        },
        LeadList: {
            screen: LeadList,
            navigationOptions: {
                tabBarIcon: ({ tintColor, focused }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name="people" style={{ color: tintColor }} />
                        <Text
                            style={{
                                color: tintColor,
                                fontSize: focused ? 16 : 15,
                                fontWeight: focused ? '700' : '100',
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

const AppContainer = createAppContainer(
    createSwitchNavigator(
        {
            AuthLoading: Splash,
            Auth: AuthStack,
            Campaigns: CampaignListStack,
            App: TabStack,
        },
        {
            initialRouteName: 'AuthLoading',
        },
    ),
);

export default AppContainer;
