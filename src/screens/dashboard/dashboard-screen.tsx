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
    Footer,
    FooterTab,
    Card,
    CardItem,
    List,
    ListItem,
    Item,
    Spinner,
} from 'native-base';
import { NavigationScreenProp } from 'react-navigation';
import images from '../../assets';
import { Image, View, Platform, Dimensions, StyleSheet, Alert } from 'react-native';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { logout } from '../../redux/actions/user-actions';
import { AppState } from '../../redux/store';
import RBSheet from 'react-native-raw-bottom-sheet';
import BottomSheet from '../../components/bottom-sheet/bottom-sheet';
import StorageService from '../../database/storage-service';
import { StorageConstants } from '../../helpers/storage-constants';
import { selectedCampaign } from '../../redux/actions/campaign-actions';
import { withNavigation } from 'react-navigation';
import { NetworkContext } from '../../provider/network-provider';
import { fetchLeadReport } from '../../redux/actions/lead-report-action';
import SpinnerOverlay from 'react-native-loading-spinner-overlay';
import { syncOfflineLeads } from '../../redux/actions/lead-actions';
export interface Props {
    navigation: NavigationScreenProp<any>;
    logout(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    userState: any;
    campaignState: any;
    metaData: any;
    leadReportState: any;

    selectCampaign(campaignId: any): void;
    fetchLeadReport(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    syncOfflineLeads(): (dispatch: Dispatch, getState: any) => Promise<void>;
}

export interface State {
    campaignName: string;
    campaignId: string;
    campaignList: Array<String>;
}
const window = Dimensions.get('window');
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
            if (this.context.isConnected) {
                this.focusListener = this.props.navigation.addListener('didFocus', async () => {
                    this.checkToken();
                    // const selectedCampaign = await StorageService.get<string>(StorageConstants.SELECTED_CAMPAIGN);
                    // this.props.navigation.navigate(selectedCampaign === null ? 'Campaigns' : 'App');
                    const selectedCampaign = this.props.campaignState.selectedCampaign;
                    this.props.navigation.navigate(selectedCampaign === null ? 'Campaigns' : 'App');
                    const compaignList = this.props.campaignState.campaignList;
                    this.setState({ campaignList: compaignList });
                    this.setState({ campaignId: selectedCampaign.id });
                    this.setState({ campaignName: selectedCampaign.name });
                    await this.props.fetchLeadReport();
                });
            } else {
                /*
            show offline
            */
            }
        } catch (error) {
            /*
            error to be handled
            */
        }
    };

    checkToken = async () => {
        // const userToken = await StorageService.get<string>(StorageConstants.TOKEN_KEY);
        const userToken = this.props.userState.user.token;
        if (userToken === null) {
            this.logout();
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
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                { text: 'OK', onPress: () => this.logout() },
            ],
            { cancelable: false },
        );
    };

    closeBottomSheet = () => {
        this.RBSheet.close();
    };

    onPressCampaign = (index: number, campaign: Object) => {
        this.props.selectCampaign(campaign);
        this.setState({
            ...this.state,
            campaignName: campaign.name,
            campaignId: campaign.id,
        });
    };

    sync = () => {
        console.log('In Sync DB');
        this.props.syncOfflineLeads();
    };

    render() {
        return (
            <Container>
                {Platform.OS === 'ios' ? (
                    <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                        <Left />
                        <Body>
                            <Title style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Dashboard</Title>
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
                                Dashboard
                            </Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.confirmLogout}>
                                <Icon name="ios-log-out" style={{ color: 'white' }} />
                            </Button>
                        </Right>
                    </Header>
                )}

                <Content style={{ backgroundColor: '#eee' }}>
                    <View style={styles.containerStyle}>
                        <View style={styles.sliderContainerStyle}>
                            <SpinnerOverlay visible={this.props.leadReportState.isLoading} />
                        </View>
                    </View>
                    <Card
                        style={{ position: 'relative', top: -120, marginLeft: 20, marginRight: 20, marginBottom: 20 }}
                    >
                        <CardItem
                            header
                            style={{
                                justifyContent: 'center',
                                paddingTop: 0,
                                paddingBottom: 0,
                                height: 80,
                            }}
                        >
                            <View
                                style={{
                                    alignItems: 'center',
                                    flexDirection: 'column',
                                    top: -50,
                                }}
                            >
                                <Text style={{ fontSize: 18, color: '#fff', fontWeight: 'bold', marginBottom: 10 }}>
                                    Hi {this.props.userState.user.name}
                                </Text>
                                <View
                                    style={{
                                        backgroundColor: '#fbd4ff',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 10,
                                        borderRadius: 50,
                                        borderWidth: 1,
                                        borderColor: '#813588',
                                        width: 95,
                                        height: 95,
                                    }}
                                >
                                    <Text style={{ fontSize: 30, color: '#813588', fontWeight: 'bold' }}>
                                        {this.props.leadReportState.leadReport.total}
                                    </Text>
                                </View>
                                <Text style={{ fontSize: 16, color: '#813588', fontWeight: 'bold' }}>Total Leads</Text>
                            </View>
                        </CardItem>
                        <CardItem style={{ flexDirection: 'column', paddingTop: 0 }}>
                            <Item>
                                <Button
                                    iconRight
                                    transparent
                                    onPress={() => this.getLeads('today')}
                                    style={{ flex: 1, marginBottom: 5, marginTop: 5 }}
                                >
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 16, flex: 1 }}>
                                        Leads today
                                    </Text>
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 24 }}>
                                        {this.props.leadReportState.leadReport.today}
                                    </Text>
                                    <Icon style={{ color: '#813588', marginRight: 0 }} name="arrow-forward" />
                                </Button>
                            </Item>
                            <Item>
                                <Button
                                    iconRight
                                    transparent
                                    onPress={() => this.getLeads('week')}
                                    style={{ flex: 1, marginBottom: 5, marginTop: 5 }}
                                >
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 16, flex: 1 }}>
                                        Leads this week
                                    </Text>
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 24 }}>
                                        {this.props.leadReportState.leadReport.week}
                                    </Text>
                                    <Icon style={{ color: '#813588', marginRight: 0 }} name="arrow-forward" />
                                </Button>
                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Button
                                    iconRight
                                    transparent
                                    onPress={() => this.getLeads('month')}
                                    style={{ flex: 1, marginBottom: 5, marginTop: 5 }}
                                >
                                    <Text
                                        style={{
                                            color: '#555',
                                            paddingLeft: 0,
                                            fontSize: 16,
                                            flex: 1,
                                            textTransform: 'none',
                                        }}
                                    >
                                        Leads this month
                                    </Text>
                                    <Text style={{ color: '#555', paddingLeft: 0, fontSize: 24 }}>
                                        {this.props.leadReportState.leadReport.month}
                                    </Text>
                                    <Icon style={{ color: '#813588', marginRight: 0 }} name="arrow-forward" />
                                </Button>
                            </Item>
                            <Item style={{ borderBottomWidth: 0 }}>
                                <Button
                                    iconRight
                                    transparent
                                    onPress={() => this.sync()}
                                    style={{ flex: 1, marginBottom: 5, marginTop: 5 }}
                                >
                                    <Text
                                        style={{
                                            color: '#555',
                                            paddingLeft: 0,
                                            fontSize: 16,
                                            flex: 1,
                                            textTransform: 'none',
                                        }}
                                    >
                                        Sync Offline leads
                                    </Text>

                                    <Icon style={{ color: '#813588', marginRight: 0 }} name="arrow-forward" />
                                </Button>
                            </Item>
                        </CardItem>
                    </Card>
                    <Card style={{ position: 'relative', top: -120, marginLeft: 20, marginRight: 20 }}>
                        <CardItem header style={{ borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text style={{ fontWeight: 'bold', color: '#555' }}>Current Campaign</Text>
                        </CardItem>
                        <CardItem>
                            {this.props.campaignState.isLoading ? (
                                <View style={{ flex: 1, height: 30 }}>
                                    <Spinner size={15} color="#813588" style={{ marginTop: -25 }} />
                                </View>
                            ) : (
                                <Text numberOfLines={1} style={{ flex: 1, marginRight: 10, color: '#555' }}>
                                    {this.props.campaignState.selectedCampaign.name}
                                </Text>
                            )}
                            <Button
                                small
                                bordered
                                onPress={() => {
                                    this.RBSheet.open();
                                }}
                                style={{ borderColor: '#813588' }}
                            >
                                <Text style={{ color: '#813588', paddingLeft: 8, paddingRight: 8 }}>Change</Text>
                            </Button>
                            <RBSheet
                                ref={ref => {
                                    this.RBSheet = ref;
                                }}
                                height={400}
                                duration={150}
                                closeOnDragDown={false}
                                customStyles={{
                                    container: {
                                        flex: 1,
                                        borderTopRightRadius: 20,
                                        borderTopLeftRadius: 20,
                                    },
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
            </Container>
        );
    }
}
const styles = StyleSheet.create({
    containerStyle: {
        alignSelf: 'center',
        width: window.width,
        overflow: 'hidden',
        height: window.width / 1.6,
    },
    sliderContainerStyle: {
        borderRadius: window.width,
        width: window.width * 2,
        height: window.width * 2,
        marginLeft: -(window.width / 2),
        position: 'absolute',
        bottom: 0,
        overflow: 'hidden',
        backgroundColor: '#813588',
    },
});
const mapStateToProps = (state: AppState) => ({
    userState: state.userReducer,
    campaignState: state.campaignReducer,
    leadReportState: state.leadReportReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    logout: bindActionCreators(logout, dispatch),
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
