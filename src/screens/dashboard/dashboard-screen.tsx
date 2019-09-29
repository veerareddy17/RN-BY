import * as React from 'react';
import {
    Container,
    Header,
    Title,
    Content,
    Text,
    Button,
    Icon,
    Left,
    Body,
    Right,
    Card,
    CardItem,
    Item,
    Spinner,
} from 'native-base';
import { NavigationScreenProp } from 'react-navigation';
import { View, Platform, Dimensions, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { logout } from '../../redux/actions/user-actions';
import { AppState } from '../../redux/store';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from '../../components/bottom-sheet/bottom-sheet';
import { selectedCampaign, syncOfflineAttendance, fetchCampaigns } from '../../redux/actions/campaign-actions';
import { withNavigation } from 'react-navigation';
import { NetworkContext } from '../../provider/network-provider';
import { fetchLeadReport } from '../../redux/actions/lead-report-action';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { syncOfflineLeads } from '../../redux/actions/lead-actions';
import { AlertError } from '../error/alert-error';
import { ToastError } from '../error/toast-error';
import { captureLocation } from '../../redux/actions/location-action';

import { MetaResponse } from '../../models/response/meta-response';
import styles from './dashboard-style';
import images from '../../assets';
export interface Props {
    navigation: NavigationScreenProp<any>;
    logout(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    userState: any;
    campaignState: any;
    metaData: any;
    errorState: any;
    leadReportState: any;
    locationState: any;
    leadState: any;
    sysnAttendance(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    fetchCampaigns(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    captureLocation(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    selectCampaign(campaignId: any): void;
    fetchLeadReport(): (dispatch: Dispatch, getState: any) => Promise<void>;
    syncOfflineLeads(): (dispatch: Dispatch, getState: any) => Promise<void>;
}

export interface State {
    campaignName: string;
    campaignId: string;
    campaignList: Array<String>;
}

class Dashboard extends React.Component<Props, State> {
    static contextType = NetworkContext;
    constructor(props: Props) {
        super(props);
        this.state = {
            campaignId: '',
            campaignName: '',
            campaignList: [],
        };
    }

    componentDidMount = async () => {
        try {
            this.focusListener = this.props.navigation.addListener('didFocus', async () => {
                const selectedCampaign = this.props.campaignState.selectedCampaign;
                const compaignList = this.props.campaignState.campaignList;
                this.setState({ campaignList: compaignList });
                this.setState({ campaignId: selectedCampaign.id });
                this.setState({ campaignName: selectedCampaign.name });

                // check for user login
                this.checkUserLogIn();

                if (this.context.isConnected) {
                    this.props.navigation.navigate(selectedCampaign === '' ? 'Campaigns' : 'App');

                    await this.props.fetchLeadReport();
                    if (this.props.errorState.showAlertError) {
                        AlertError.alertErr(this.props.errorState.error);
                        return;
                    } else if (this.props.errorState.showToastError) {
                        ToastError.toastErr(this.props.errorState.error);
                        return;
                    }
                    //Run background task to sync offline leads
                    if (this.props.leadState.offlineLeadList && this.props.leadState.offlineLeadList.length > 0) {
                        this.sync();
                    }
                    if (this.props.campaignState.attendance.length > 0) {
                        this.props.sysnAttendance();
                    }
                }
            });
        } catch (error) {
            /*
            error to be handled
            */
        }
    };

    checkUserLogIn = () => {
        if (
            (this.context.isConnected && this.props.userState.user.token === '') ||
            (!this.context.isConnected && !this.props.userState.user.isOfflineLoggedIn)
        ) {
            this.logout(true);
        }
    };

    componentWillUnmount() {
        if (this.focusListener) this.focusListener.remove();
    }

    getLeads = (flag: string) => {
        this.props.navigation.navigate('FilteredLeads', { flag: flag }); // Can be set to 'FilteredLeads' screen
    };

    logout = async (isAutoLogOff: boolean) => {
        await this.props.logout();
        isAutoLogOff
            ? AlertError.reLoginAlert(this.context.isConnected, this.props.navigation)
            : this.props.navigation.navigate('Auth');
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
                { text: 'Ok', onPress: () => this.logout(false) },
            ],
            { cancelable: false },
        );
    };

    closeBottomSheet = () => {
        this.RBSheet.close();
    };

    onPressCampaign = async (index: number, selectedCampaign: MetaResponse) => {
        await this.props.captureLocation();
        await this.props.selectCampaign(selectedCampaign);
        if (this.props.errorState.showAlertError) {
            AlertError.alertErr(this.props.errorState.error);
        }
        if (this.props.errorState.showToastError) {
            ToastError.toastErr(this.props.errorState.error);
        } else {
            this.setState({
                campaignName: selectedCampaign.name,
                campaignId: selectedCampaign.id,
            });
        }
    };

    sync = () => {
        this.props.syncOfflineLeads();
    };

    onPressOpenRBSheet = async () => {
        await this.props.fetchCampaigns();
        this.setState({ campaignList: this.props.campaignState.campaignList });
        this.RBSheet.open();
    };

    render() {
        return (
            <Container>
                {Platform.OS === 'ios' ? (
                    <Header style={[styles.headerBackground, { borderBottomWidth: 0 }]} androidStatusBarColor="#813588">
                        <Left />
                        <Body style={styles.headeriOS}>
                            <Title style={styles.headeriOSTitle}>Dashboard</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.confirmLogout}>
                                <Icon name="ios-log-out" style={styles.whiteColor} />
                            </Button>
                        </Right>
                    </Header>
                ) : (
                    <Header style={styles.headerBackground} androidStatusBarColor="#813588">
                        <Body>
                            <Title style={styles.headerAndroidTitle}>Dashboard</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.confirmLogout}>
                                <Icon name="ios-log-out" style={styles.whiteColor} />
                            </Button>
                        </Right>
                    </Header>
                )}

                <Content style={styles.contentBg}>
                    <View style={styles.containerStyle}>
                        <View style={styles.sliderContainerStyle}>
                            {/* <SpinnerOverlay visible={this.props.leadReportState.isLoading} /> */}
                        </View>
                    </View>
                    <View style={styles.cardShadow}></View>
                    <Card style={styles.leadsCard}>
                        <CardItem header style={styles.leadsCardHeader}>
                            <View style={styles.leadCountSection}>
                                <Text style={styles.leadCountUsername}>Hi {this.props.userState.user.name}</Text>
                                <View style={styles.leadCountCircle}>
                                    <Text style={styles.leadCountNumber}>
                                        {!this.context.isConnected
                                            ? this.props.leadState.offlineLeadList
                                                ? this.props.leadState.offlineLeadList.length
                                                : 0
                                            : this.props.leadReportState.leadReport.total}
                                    </Text>
                                </View>
                                {!this.context.isConnected ? (
                                    <Text style={styles.leadCountText}>Total Offline Leads</Text>
                                ) : (
                                    <Text style={styles.leadCountText}>Total Leads</Text>
                                )}
                            </View>
                        </CardItem>
                        {!this.context.isConnected ? (
                            <CardItem style={styles.leadCardItem}>
                                <Image
                                    resizeMode={'contain'}
                                    source={images.noInternet}
                                    style={styles.noInternetImageWidth}
                                />
                                <Text style={styles.offlineText}>You're Offline</Text>
                                <Text style={styles.offlineSubText}>Please get back online to view more details</Text>
                            </CardItem>
                        ) : (
                            <CardItem style={styles.leadCardItem}>
                                <Item>
                                    <Button
                                        iconRight
                                        transparent
                                        onPress={() => {
                                            this.props.leadReportState.leadReport.today > 0 && this.getLeads('today');
                                        }}
                                        style={styles.leadCardItemButton}
                                    >
                                        <Text uppercase={false} style={styles.leadCardItemText}>
                                            Leads today
                                        </Text>
                                        <Text style={styles.leadCardItemNumber}>
                                            {this.props.leadReportState.leadReport.today}
                                        </Text>
                                        {this.props.leadReportState.leadReport.today > 0 && (
                                            <Icon style={styles.leadCardItemIcon} name="ios-arrow-forward" />
                                        )}
                                    </Button>
                                </Item>
                                <Item>
                                    <Button
                                        iconRight
                                        transparent
                                        onPress={() => {
                                            this.props.leadReportState.leadReport.week > 0 && this.getLeads('week');
                                        }}
                                        style={styles.leadCardItemButton}
                                    >
                                        <Text uppercase={false} style={styles.leadCardItemText}>
                                            Leads this week
                                        </Text>
                                        <Text style={styles.leadCardItemNumber}>
                                            {this.props.leadReportState.leadReport.week}
                                        </Text>
                                        {this.props.leadReportState.leadReport.week > 0 && (
                                            <Icon style={styles.leadCardItemIcon} name="ios-arrow-forward" />
                                        )}
                                    </Button>
                                </Item>
                                <Item style={styles.noBorderBottom}>
                                    <Button
                                        iconRight
                                        transparent
                                        onPress={() => {
                                            this.props.leadReportState.leadReport.month > 0 && this.getLeads('month');
                                        }}
                                        style={styles.leadCardItemButton}
                                    >
                                        <Text uppercase={false} style={styles.leadCardItemText}>
                                            Leads this month
                                        </Text>
                                        <Text style={styles.leadCardItemNumber}>
                                            {this.props.leadReportState.leadReport.month}
                                        </Text>
                                        {this.props.leadReportState.leadReport.month > 0 && (
                                            <Icon style={styles.leadCardItemIcon} name="ios-arrow-forward" />
                                        )}
                                    </Button>
                                </Item>
                            </CardItem>
                        )}
                    </Card>
                    <Card style={styles.campaignCard}>
                        <CardItem header style={styles.campaignCardItem}>
                            <Text style={styles.campaignCardTitle}>Current Campaign</Text>
                        </CardItem>
                        <CardItem>
                            <Text numberOfLines={1} style={styles.campaignName}>
                                {this.state.campaignName}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.onPressOpenRBSheet();
                                }}
                                style={styles.campaignCardButton}
                            >
                                {this.props.campaignState.isLoading ? (
                                    <View
                                        style={{
                                            flex: 1,
                                            height: 22,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Spinner size={15} color="#813588" style={{ marginTop: 0 }} />
                                    </View>
                                ) : (
                                    <Text uppercase={false} style={styles.campaignCardButtonText}>
                                        Change
                                    </Text>
                                )}
                            </TouchableOpacity>
                            <RBSheet
                                ref={ref => {
                                    this.RBSheet = ref;
                                }}
                                height={400}
                                animationType="fade"
                                duration={100}
                                closeOnDragDown={false}
                                customStyles={{
                                    container: styles.bottomSheetContainer,
                                }}
                            >
                                <BottomSheet
                                    type="List"
                                    currentcampaign={this.state.campaignId}
                                    data={this.state.campaignList}
                                    close={this.closeBottomSheet}
                                    title="Change Campaign"
                                    onPress={this.onPressCampaign}
                                />
                            </RBSheet>
                        </CardItem>
                    </Card>
                </Content>
                {!this.context.isConnected && (
                    <View style={styles.noInternetContainer}>
                        <Text style={styles.noInternetText}>No Internet</Text>
                    </View>
                )}
            </Container>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    userState: state.userReducer,
    campaignState: state.campaignReducer,
    errorState: state.errorReducer,
    leadReportState: state.leadReportReducer,
    locationState: state.locationReducer,
    leadState: state.leadReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    logout: bindActionCreators(logout, dispatch),
    fetchCampaigns: bindActionCreators(fetchCampaigns, dispatch),
    selectCampaign: bindActionCreators(selectedCampaign, dispatch),
    fetchLeadReport: bindActionCreators(fetchLeadReport, dispatch),
    syncOfflineLeads: bindActionCreators(syncOfflineLeads, dispatch),
    captureLocation: bindActionCreators(captureLocation, dispatch),
    sysnAttendance: bindActionCreators(syncOfflineAttendance, dispatch),
});

export default withNavigation(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(Dashboard),
);
