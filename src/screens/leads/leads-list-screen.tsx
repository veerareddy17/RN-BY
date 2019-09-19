import React, { Component } from 'react';
import { FlatList, ListView, Platform, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
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
    Image,
} from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/store';
import Lead from './lead';
import { fetchAllLeadsApi } from '../../redux/actions/lead-actions';
import { NetworkContext } from '../../provider/network-provider';
import { NavigationScreenProp } from 'react-navigation';
import { Alert } from 'react-native';
import { logout } from '../../redux/actions/user-actions';
import Loader from '../../components/content-loader/content-loader';
import images from '../../assets';
export interface LeadListProps {
    navigation: NavigationScreenProp<any>;
    leadState: any;
    fetchLeads(pageNumber: number): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    logout(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    userState: any;
}

export interface LeadListState {
    pageNumber: number;
    loadingMore: boolean;
    flag: string;
}

class LeadList extends Component<LeadListProps, LeadListState> {
    static contextType = NetworkContext;

    constructor(props: LeadListProps) {
        super(props);
        this.state = {
            pageNumber: 1,
            loadingMore: false,
            flag: '',
        };
    }

    async componentDidMount() {
        this.focusLeadListener = this.props.navigation.addListener('didFocus', async () => {
            if (this.context.isConnected && this.props.userState.user.token === '') {
                this.logout();
                return;
            }
            if (!this.context.isConnected && !this.props.userState.user.isOfflineLoggedIn) {
                this.logout();
                return;
            }
            await this.fetchLeadsList(this.state.pageNumber, '');
            this.setState({
                pageNumber: this.props.leadState.paginatedLeadList.current_page,
                loadingMore: false,
            });
        });
    }

    logout = async () => {
        await this.props.logout();
        this.props.navigation.navigate('Auth');
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
                { text: 'Ok', onPress: () => this.logout() },
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
        const { width, height } = Dimensions.get('window');
        return (
            <View style={{ paddingTop: 0 }}>
                <Card
                    style={{
                        marginTop: 0,
                        marginBottom: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        borderTopWidth: 0,
                        borderLeftWidth: 0,
                        borderBottomWidth: 0,
                        borderRightWidth: 0,
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ fontFamily: 'system font' }}>No Data to Display</Text>
                    {/* <ImageBackground source={images.noData} style={{ width, height }}></ImageBackground> */}
                </Card>
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
        return (
            <Container>
                {Platform.OS === 'ios' ? (
                    <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                        <Left />
                        <Body style={{ flex: 3 }}>
                            <Title style={{ color: 'white', fontSize: 18 }}>Leads</Title>
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
                            <Title style={{ color: 'white', marginLeft: 10, fontSize: 18, fontFamily: 'system font' }}>
                                Leads
                            </Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.confirmLogout}>
                                <Icon name="ios-log-out" style={{ color: 'white' }} />
                            </Button>
                        </Right>
                    </Header>
                )}
                <Content style={{ flex: 1, backgroundColor: '#eee', padding: 10 }} contentContainerStyle={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
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
                    </View>
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
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchLeads: bindActionCreators(fetchAllLeadsApi, dispatch),
    logout: bindActionCreators(logout, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LeadList);
