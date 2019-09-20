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
import { View, Platform, Dimensions, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { logout } from '../../redux/actions/user-actions';
import { AppState } from '../../redux/store';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from '../../components/bottom-sheet/bottom-sheet';
import { selectedCampaign, fetchCampaigns } from '../../redux/actions/campaign-actions';
import { withNavigation } from 'react-navigation';
import { NetworkContext } from '../../provider/network-provider';
import { fetchLeadReport } from '../../redux/actions/lead-report-action';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { syncOfflineLeads } from '../../redux/actions/lead-actions';
import { AlertError } from '../error/alert-error';
import { ToastError } from '../error/toast-error';
import { MetaResponse } from '../../models/response/meta-response';
import styles from './dashboard-style';
export interface Props {
    navigation: NavigationScreenProp<any>;
    logout(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    userState: any;
    campaignState: any;
    metaData: any;
    errorState: any;
    leadReportState: any;
    leadState: any;
    fetchCampaigns(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
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

                if (this.context.isConnected) {
                    if (this.props.userState.user.token === '') {
                        this.logout();
                        return;
                    }
                    this.props.navigation.navigate(selectedCampaign === null ? 'Campaigns' : 'App');
                    if (this.props.errorState.showAlertError) {
                        AlertError.alertErr(this.props.errorState.error);
                        return;
                    }
                    if (this.props.errorState.showToastError) {
                        ToastError.toastErr(this.props.errorState.error);
                        return;
                    }
                    await this.props.fetchLeadReport();

                    //Run background task to sync offline leads
                    if (this.props.leadState.offlineLeadList.length > 0) {
                        this.sync();
                    }
                } else {
                    if (!this.props.userState.user.isOfflineLoggedIn) {
                        this.logout();
                        return;
                    }
                    /*
                    show offline
                    */
                }
            });
        } catch (error) {
            /*
            error to be handled
            */
        }
    };

    componentWillUnmount() {
        if (this.focusListener) this.focusListener.remove();
    }

    getLeads = (flag: string) => {
        this.props.navigation.navigate('FilteredLeads', { flag: flag }); // Can be set to 'FilteredLeads' screen
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

    closeBottomSheet = () => {
        this.RBSheet.close();
    };

    onPressCampaign = (index: number, selectedCampaign: MetaResponse) => {
        this.props.selectCampaign(selectedCampaign);
        this.setState({
            campaignName: selectedCampaign.name,
            campaignId: selectedCampaign.id,
        });
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
                        <Body style={{ flex: 3 }}>
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
                            <SpinnerOverlay visible={this.props.leadReportState.isLoading} />
                        </View>
                    </View>
                    <View style={styles.cardShadow}></View>
                    <Card style={styles.leadsCard}>
                        <CardItem header style={styles.leadsCardHeader}>
                            <View style={styles.leadCountSection}>
                                <Text style={styles.leadCountUsername}>Hi {this.props.userState.user.name}</Text>
                                <View style={styles.leadCountCircle}>
                                    <Text style={styles.leadCountNumber}>
                                        {this.props.leadReportState.leadReport.total}
                                    </Text>
                                </View>
                                <Text style={styles.leadCountText}>Total Leads</Text>
                            </View>
                        </CardItem>
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
                    </Card>
                    <Card style={styles.campaignCard}>
                        <CardItem header style={styles.campaignCardItem}>
                            <Text style={styles.campaignCardTitle}>Current Campaign</Text>
                        </CardItem>
                        <CardItem>
                            {this.props.campaignState.isLoading ? (
                                <View style={styles.campaignSpinnerContainer}>
                                    <Spinner size={15} color="#813588" style={styles.campaignSpinner} />
                                </View>
                            ) : (
                                <Text numberOfLines={1} style={styles.campaignName}>
                                    {this.state.campaignName}
                                </Text>
                            )}
                            <TouchableOpacity
                                onPress={() => {
                                    this.onPressOpenRBSheet();
                                }}
                                style={styles.campaignCardButton}
                            >
                                <Text uppercase={false} style={styles.campaignCardButtonText}>
                                    Change
                                </Text>
                            </TouchableOpacity>
                            <RBSheet
                                ref={ref => {
                                    this.RBSheet = ref;
                                }}
                                height={400}
                                duration={150}
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
                    <View
                        style={{
                            backgroundColor: '#555',
                            bottom: 0,
                            position: 'absolute',
                            padding: 2,
                            paddingLeft: 20,
                            width: '100%',
                        }}
                    >
                        <Text style={{ color: '#fff', fontSize: 12, fontFamily: 'system font' }}>No Internet</Text>
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
    leadState: state.leadReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    logout: bindActionCreators(logout, dispatch),
    fetchCampaigns: bindActionCreators(fetchCampaigns, dispatch),
    selectCampaign: bindActionCreators(selectedCampaign, dispatch),
    fetchLeadReport: bindActionCreators(fetchLeadReport, dispatch),
    syncOfflineLeads: bindActionCreators(syncOfflineLeads, dispatch),
});

export default withNavigation(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(Dashboard),
);
