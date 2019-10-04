import React, { Component } from 'react';
import { FlatList, ListView, Platform, ActivityIndicator, ImageBackground, Dimensions, Image } from 'react-native';
import { connect } from 'react-redux';
import {
    View,
    Header,
    Container,
    Content,
    Left,
    Button,
    Title,
    Right,
    Body,
    ListItem,
    Icon,
    Text,
    Card,
    Tabs,
    Tab,
} from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/store';
import Lead from './lead';
import { fetchAllLeadsApi, resetLeads } from '../../redux/actions/lead-actions';
import { NetworkContext } from '../../provider/network-provider';
import { NavigationScreenProp } from 'react-navigation';
import { Alert } from 'react-native';
import { logout } from '../../redux/actions/user-actions';
import Loader from '../../components/content-loader/content-loader';
import images from '../../assets';
import { fetchLeadReport } from '../../redux/actions/lead-report-action';
import { AlertError } from '../error/alert-error';
export interface LeadListProps {
    navigation: NavigationScreenProp<any>;
    leadState: any;
    userState: any;
    leadReportState: any;
    fetchLeads(pageNumber: number): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    logout(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    resetLead(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    fetchLeadReport(): (dispatch: Dispatch, getState: any) => Promise<void>;
}

export interface LeadListState {
    pageNumber: number;
    loadingMore: boolean;
    flag: string;
    verifiedLeadList: [];
    nonverifiedLedList: [];
    showSpinner: boolean;
}

class LeadList extends Component<LeadListProps, LeadListState> {
    static contextType = NetworkContext;

    constructor(props: LeadListProps) {
        super(props);
        this.state = {
            pageNumber: 1,
            loadingMore: false,
            flag: '',
            verifiedLeadList: [],
            nonverifiedLedList: [],
        };
    }

    async componentDidMount() {
        this.focusLeadListener = this.props.navigation.addListener('didFocus', async () => {
            this.checkUserLogIn();
            this.setState({ showSpinner: true });
            await this.props.fetchLeadReport();
            await this.fetchLeadsList(this.state.pageNumber, '');
            this.setState({
                pageNumber: this.props.leadState.paginatedLeadList.current_page,
                loadingMore: false,
            });
            console.log(' lead report list', this.props.leadReportState.leadList);
            console.log(' lead list', this.props.leadState.leadList);
            const verifiedLead = this.props.leadState.leadList.filter(i => {
                return i.is_otp_verified === true;
            });
            const nonverifiedLead = this.props.leadState.leadList.filter(i => {
                return i.is_otp_verified === false;
            });
            this.setState({ verifiedLeadList: verifiedLead });
            this.setState({ nonverifiedLedList: nonverifiedLead });
            this.setState({ showSpinner: false });
        });
    }

    checkUserLogIn = () => {
        if (
            (this.context.isConnected && this.props.userState.user.token === '') ||
            (!this.context.isConnected && !this.props.userState.user.isOfflineLoggedIn)
        ) {
            this.logout(true);
        }
    };

    logout = async (isAutoLogOff: boolean) => {
        await this.props.logout();
        isAutoLogOff
            ? AlertError.reLoginAlert(this.context.isConnected, this.props.navigation)
            : this.props.navigation.navigate('Auth');
    };

    componentWillUnmount() {
        if (this.focusLeadListener) this.focusLeadListener.remove();
    }

    fetchLeadsList = async (pgNo: number, flag: string) => {
        await this.props.fetchLeads(pgNo);
        this.setState({
            loadingMore: false,
        });
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

    fetchMore = () => {
        if (this.props.leadState.paginatedLeadList.next_page_url == null) {
            this.setState({ loadingMore: false });
            return;
        }
        this.setState(
            {
                pageNumber: this.state.pageNumber + 1,
                loadingMore: true,
            },
            async () => {
                await this.fetchLeadsList(this.state.pageNumber, this.state.flag);
            },
        );
    };

    renderFooter = () => {
        if (!this.state.loadingMore || this.props.leadState.paginatedLeadList.next_page_url == null) {
            return null;
        }
        return (
            <View style={{ marginBottom: 20 }}>
                <ActivityIndicator animating size="large" />
            </View>
        );
    };

    renderEmptyView = () => {
        const SCREEN_HEIGHT = Dimensions.get('window').height - 180;
        return (
            <View
                style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: SCREEN_HEIGHT, //responsible for 100% height
                    backgroundColor: '#f6f6f6',
                }}
            >
                <Image resizeMode={'contain'} source={images.noData} style={{ width: 240 }} />
                <Text style={{ fontFamily: 'system font', color: '#555', marginTop: 10 }}>There are no leads</Text>
            </View>
        );
    };

    renderItem(item) {
        return (
            <ListItem
                key={item.id}
                style={{
                    marginLeft: 0,
                    paddingRight: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    marginBottom: 15,
                    borderBottomWidth: 0,
                }}
            >
                <Body>
                    <Lead lead={item} />
                </Body>
            </ListItem>
        );
    }
    render() {
        const leadCount = !this.context.isConnected
            ? this.props.leadState.offlineLeadList.length
            : this.props.leadReportState.leadReport.total;

        return (
            <Container>
                {Platform.OS === 'ios' ? (
                    <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                        <Left />
                        <Body style={{ flex: 3 }}>
                            <Title style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>Leads</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.confirmLogout}>
                                <Icon name="ios-log-out" style={{ color: '#fff', fontSize: 22 }} />
                            </Button>
                        </Right>
                    </Header>
                ) : (
                    <Header hasTabs style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                        <Body>
                            <Title
                                style={{
                                    color: '#fff',
                                    fontWeight: '700',
                                    marginLeft: 10,
                                    fontSize: 18,
                                    fontFamily: 'system font',
                                }}
                            >
                                Leads
                            </Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.confirmLogout}>
                                <Icon name="ios-log-out" style={{ color: '#fff', fontSize: 22 }} />
                            </Button>
                        </Right>
                    </Header>
                )}
                <Content style={{ flex: 1, backgroundColor: '#f6f6f6' }} contentContainerStyle={{ flex: 1 }}>
                    {/* <View style={{ paddingBottom: 5 }}>
                        {leadCount > 0 && (
                            <Text style={{ fontSize: 15, color: '#555' }}>Total Leads : {leadCount}</Text>
                        )}
                    </View> */}
                    {/* <View style={{ flex: 1 }}>
                        {this.context.isConnected ? (
                            this.props.leadState.isLoading ? (
                                <View>
                                    <Loader />
                                </View>
                            ) : (
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        data={this.props.leadState.leadList}
                                        renderItem={({ item, index }) => this.renderItem(item)}
                                        keyExtractor={(item, index) => `${item.id}+${index}`}
                                        ListFooterComponent={this.renderFooter}
                                        ListEmptyComponent={this.renderEmptyView}
                                        onEndReached={this.fetchMore}
                                        onEndReachedThreshold={0.1}
                                    />
                                </View>
                            )
                        ) : (
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={this.props.leadState.offlineLeadList}
                                    renderItem={({ item, index }) => this.renderItem(item)}
                                    keyExtractor={(item, index) => `${item.id}+${index}`}
                                    ListEmptyComponent={this.renderEmptyView}
                                />
                            </View>
                        )}
                    </View> */}
                    {this.state.showSpinner ? (
                        <View style={{ padding: 10 }}>
                            <Loader />
                            {/* <ActivityIndicator size="large" /> */}
                        </View>
                    ) : (
                        <Tabs tabBarUnderlineStyle={{ backgroundColor: '#813588' }}>
                            <Tab
                                textStyle={{ color: '#555' }}
                                activeTextStyle={{ color: '#813588', fontWeight: '700' }}
                                heading={`Verified (${this.state.verifiedLeadList.length})`}
                                tabStyle={{ backgroundColor: '#f0ecf0' }}
                                activeTabStyle={{ backgroundColor: '#f0ecf0' }}
                            >
                                <View style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 10 }}>
                                    {this.context.isConnected ? (
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={this.props.leadState.leadList.filter(i => {
                                                    return i.is_otp_verified === true;
                                                })}
                                                renderItem={({ item, index }) => this.renderItem(item)}
                                                keyExtractor={(item, index) => `${item.id}+${index}`}
                                                ListFooterComponent={this.renderFooter}
                                                ListEmptyComponent={this.renderEmptyView}
                                                onEndReached={this.fetchMore}
                                                onEndReachedThreshold={0.1}
                                            />
                                        </View>
                                    ) : (
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={this.props.leadState.offlineLeadList}
                                                renderItem={({ item, index }) => this.renderItem(item)}
                                                keyExtractor={(item, index) => `${item.id}+${index}`}
                                                ListEmptyComponent={this.renderEmptyView}
                                            />
                                        </View>
                                    )}
                                </View>
                            </Tab>
                            <Tab
                                heading={`Non Verified (${this.state.nonverifiedLedList.length})`}
                                textStyle={{ color: '#555' }}
                                activeTextStyle={{ color: '#813588', fontWeight: '700' }}
                                tabStyle={{ backgroundColor: '#f0ecf0' }}
                                activeTabStyle={{ backgroundColor: '#f0ecf0' }}
                            >
                                <View style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 10 }}>
                                    {this.context.isConnected ? (
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={this.props.leadState.leadList.filter(i => {
                                                    return i.is_otp_verified === false;
                                                })}
                                                renderItem={({ item, index }) => this.renderItem(item)}
                                                keyExtractor={(item, index) => `${item.id}+${index}`}
                                                ListFooterComponent={this.renderFooter}
                                                ListEmptyComponent={this.renderEmptyView}
                                                onEndReached={this.fetchMore}
                                                onEndReachedThreshold={0.1}
                                            />
                                        </View>
                                    ) : (
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={this.props.leadState.offlineLeadList}
                                                renderItem={({ item, index }) => this.renderItem(item)}
                                                keyExtractor={(item, index) => `${item.id}+${index}`}
                                                ListEmptyComponent={this.renderEmptyView}
                                            />
                                        </View>
                                    )}
                                </View>
                            </Tab>
                        </Tabs>
                    )}
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
    leadState: state.leadReducer,
    userState: state.userReducer,
    leadReportState: state.leadReportReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchLeads: bindActionCreators(fetchAllLeadsApi, dispatch),
    logout: bindActionCreators(logout, dispatch),
    resetLead: bindActionCreators(resetLeads, dispatch),
    fetchLeadReport: bindActionCreators(fetchLeadReport, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LeadList);
