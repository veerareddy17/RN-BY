import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Text,
    View,
    Spinner,
    Content,
    Container,
    Left,
    List,
    ListItem,
    Header,
    Title,
    Body,
    Right,
    Button,
    Icon,
} from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/store';
import { NetworkContext } from '../../provider/network-provider';
import { NavigationScreenProp } from 'react-navigation';
import { selectedCampaign } from '../../redux/actions/campaign-actions';
import { StatusBar, Alert, Platform } from 'react-native';
import { AlertError } from '../error/alert-error';
import { ToastError } from '../error/toast-error';
import { logout } from '../../redux/actions/user-actions';

export interface CampaignListProps {
    navigation: NavigationScreenProp<any>;
    campaignState: any;
    errorState: any;
    selectCampaign(campaignId: any): void;
    logout(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}

export interface CampaignListState {}

class CampaignList extends Component<CampaignListProps, CampaignListState> {
    static contextType = NetworkContext;

    handleSelections = (campaignId: any) => {
        this.props.selectCampaign(campaignId);
        if (this.props.errorState.showAlertError) {
            AlertError.alertErr(this.props.errorState.error);
        }
        if (this.props.errorState.showToastError) {
            ToastError.toastErr(this.props.errorState.error);
        } else {
            this.props.navigation.navigate('App');
        }
    };

    logout = async () => {
        await this.props.logout();
        this.props.navigation.navigate('Auth');
    };

    confirmLogout = () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to logout?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                { text: 'Ok', onPress: () => this.logout() },
            ],
            { cancelable: false },
        );
    };

    render() {
        return (
            <Container>
                {/* <StatusBar backgroundColor="#813588" barStyle="light-content" /> */}
                {Platform.OS === 'ios' ? (
                    <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                        <Body>
                            <Title style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Select Campaign</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.confirmLogout}>
                                <Icon name="ios-log-out" style={{ color: 'white' }} />
                            </Button>
                        </Right>
                    </Header>
                ) : (
                    <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                        <Body>
                            <Title style={{ color: 'white', fontWeight: 'bold', fontSize: 18, marginLeft: 10 }}>
                                Select Campaign
                            </Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.confirmLogout}>
                                <Icon name="ios-log-out" style={{ color: 'white' }} />
                            </Button>
                        </Right>
                    </Header>
                )}
                <Content>
                    {this.props.campaignState.isLoading ? (
                        <View>
                            <Spinner />
                            <Text style={{ textAlign: 'center' }}>Fetching Campaigns...</Text>
                        </View>
                    ) : (
                        <View>
                            <List>
                                {this.props.campaignState.campaignList.map(campaign => {
                                    return (
                                        <ListItem
                                            button={true}
                                            key={campaign.id}
                                            onPress={() => this.handleSelections(campaign)}
                                        >
                                            <Left>
                                                <Text>{campaign.name}</Text>
                                            </Left>
                                        </ListItem>
                                    );
                                })}
                            </List>
                        </View>
                    )}
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    campaignState: state.campaignReducer,
    errorState: state.errorReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    selectCampaign: bindActionCreators(selectedCampaign, dispatch),
    logout: bindActionCreators(logout, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CampaignList);
