import React, { Component } from 'react';
import { FlatList, ListView, Platform, ActivityIndicator, Dimensions, Image } from 'react-native';
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
    Card,
    Text,
    Tabs,
    Tab,
} from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/store';
import Lead from './lead';
import { fetchFilteredLeads } from '../../redux/actions/lead-actions';
import { NetworkContext } from '../../provider/network-provider';
import { NavigationScreenProp } from 'react-navigation';
import Loader from '../../components/content-loader/content-loader';
import { logout } from '../../redux/actions/user-actions';
import { AlertError } from '../error/alert-error';
import images from '../../assets';
export interface FLeadListProps {
    navigation: NavigationScreenProp<any>;
    leadState: any;
    userState: any;
    leadReportState: any;
    fetchFilteredLeads(
        pageNumber: number,
        flag: string,
        isOtpVerified: boolean,
    ): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    logout(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}

export interface FLeadListState {
    verifiedPageNumber: number;
    nonVerifiedPageNumber: number;
    loadingMore: boolean;
    flag: string;
    showSpinner: boolean;
}

class FilteredLeads extends Component<FLeadListProps, FLeadListState> {
    static contextType = NetworkContext;
    static navigationOptions = {
        title: 'Leads',
        headerTitleStyle: { color: '#fff', fontWeight: '700' },
    };
    constructor(props: FLeadListProps) {
        super(props);
        this.state = {
            verifiedPageNumber: 1,
            nonVerifiedPageNumber: 1,
            loadingMore: false,
            flag: '',
            showSpinner: true,
        };
    }

    async componentDidMount() {
        this.focusLeadListener = this.props.navigation.addListener('didFocus', async () => {
            let selectedFlag = this.props.navigation.getParam('flag', '');
            this.checkUserLogIn();
            await this.fetchVerifiedLeadsList(this.state.verifiedPageNumber, selectedFlag, true);
            await this.fetchNonVerifiedLeadsList(this.state.nonVerifiedPageNumber, selectedFlag, false);
            this.setState({
                verifiedPageNumber: this.props.leadState.verifiedFilteredPaginatedLeadList.current_page,
                nonVerifiedPageNumber: this.props.leadState.nonVerifiedFilteredPaginatedLeadList.current_page,
                flag: selectedFlag,
                loadingMore: false,
            });
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

    fetchVerifiedLeadsList = async (pgNo: number, flag: string, isOtpVerified: boolean) => {
        try {
            await this.props.fetchFilteredLeads(pgNo, flag, isOtpVerified);
            this.setState({
                loadingMore: false,
            });
        } catch (error) {
            /* show server error here*/
        }
    };

    fetchNonVerifiedLeadsList = async (pgNo: number, flag: string, isOtpVerified: boolean) => {
        try {
            await this.props.fetchFilteredLeads(pgNo, flag, isOtpVerified);
            this.setState({
                loadingMore: false,
            });
        } catch (error) {
            /* show server error here*/
        }
    };

    fetchVerifiedMore = () => {
        if (this.props.leadState.verifiedFilteredPaginatedLeadList.next_page_url == null) {
            this.setState({ loadingMore: false });
            return;
        }
        this.setState(
            {
                verifiedPageNumber:
                    this.props.leadState.flag !== this.state.flag ? 1 : this.state.verifiedPageNumber + 1,
                flag: this.state.flag,
                loadingMore: true,
            },
            async () => {
                await this.fetchVerifiedLeadsList(this.state.verifiedPageNumber, this.state.flag, true);
            },
        );
    };

    fetchNonVerifiedMore = () => {
        if (this.props.leadState.nonVerifiedFilteredPaginatedLeadList.next_page_url == null) {
            this.setState({ loadingMore: false });
            return;
        }
        this.setState(
            {
                nonVerifiedPageNumber:
                    this.props.leadState.flag !== this.state.flag ? 1 : this.state.nonVerifiedPageNumber + 1,
                flag: this.state.flag,
                loadingMore: true,
            },
            async () => {
                await this.fetchNonVerifiedLeadsList(this.state.nonVerifiedPageNumber, this.state.flag, false);
            },
        );
    };

    renderFooter = () => {
        if (!this.state.loadingMore) {
            return null;
        }
        return (
            <View>
                <ActivityIndicator animating size="large" />
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

    render() {
        const leadCount = !this.context.isConnected
            ? this.props.leadState.offlineLeadList.length
            : this.props.leadReportState.leadReport[this.state.flag];
        return (
            <Container>
                <Content style={{ flex: 1, backgroundColor: '#eee' }} contentContainerStyle={{ flex: 1 }}>
                    {this.state.showSpinner ? (
                        <View style={{ padding: 10 }}>
                            <Loader />
                        </View>
                    ) : (
                        <Tabs tabBarUnderlineStyle={{ backgroundColor: '#813588' }}>
                            <Tab
                                textStyle={{ color: '#555' }}
                                activeTextStyle={{ color: '#813588', fontWeight: '700' }}
                                heading={`Verified (${this.props.leadState.verifiedFilteredPaginatedLeadList.total})`}
                                tabStyle={{ backgroundColor: '#f0ecf0' }}
                                activeTabStyle={{ backgroundColor: '#f0ecf0' }}
                            >
                                <View style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 10 }}>
                                    {this.context.isConnected && (
                                        <View style={{ flex: 1 }}>
                                            <FlatList
                                                data={this.props.leadState.verifiedFilteredLeadList}
                                                renderItem={({ item, index }) => this.renderItem(item)}
                                                keyExtractor={(item, index) => `${item.id}+${index}`}
                                                ListFooterComponent={this.renderFooter}
                                                ListEmptyComponent={this.renderEmptyView}
                                                onEndReached={this.fetchVerifiedMore}
                                                onEndReachedThreshold={0.1}
                                            />
                                        </View>
                                    )}
                                </View>
                            </Tab>
                            <Tab
                                heading={`Non Verified (${this.props.leadState.nonVerifiedFilteredPaginatedLeadList.total})`}
                                textStyle={{ color: '#555' }}
                                activeTextStyle={{ color: '#813588', fontWeight: '700' }}
                                tabStyle={{ backgroundColor: '#f0ecf0' }}
                                activeTabStyle={{ backgroundColor: '#f0ecf0' }}
                            >
                                <View style={{ flex: 1, backgroundColor: '#f6f6f6', padding: 10 }}>
                                    <View style={{ flex: 1 }}>
                                        <FlatList
                                            data={this.props.leadState.nonVerifiedFilteredLeadList}
                                            renderItem={({ item, index }) => this.renderItem(item)}
                                            keyExtractor={(item, index) => `${item.id}+${index}`}
                                            ListFooterComponent={this.renderFooter}
                                            ListEmptyComponent={this.renderEmptyView}
                                            onEndReached={this.fetchNonVerifiedMore}
                                            onEndReachedThreshold={0.1}
                                        />
                                    </View>
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
    fetchFilteredLeads: bindActionCreators(fetchFilteredLeads, dispatch),
    logout: bindActionCreators(logout, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FilteredLeads);
