import React, { Component } from 'react';
import { FlatList, ListView, Platform, ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import { View, Header, Container, Content, Left, Button, Title, Right, Body, ListItem, Icon } from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/store';
import Lead from './lead';
import { fetchAllLeadsApi } from '../../redux/actions/lead-actions';
import { NetworkContext } from '../../provider/network-provider';
import { NavigationScreenProp } from 'react-navigation';
import { Alert } from 'react-native';
import { logout } from '../../redux/actions/user-actions';
import Loader from '../../components/content-loader/content-loader';
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
}

class LeadList extends Component<LeadListProps, LeadListState> {
    static contextType = NetworkContext;
    static navigationOptions = {
        title: 'Leads',
    };
    constructor(props: LeadListProps) {
        super(props);
        this.state = {
            pageNumber: this.props.leadState.paginatedLeadList.current_page,
            loadingMore: false,
        };
    }
    async componentDidMount() {
        if (this.props.leadState.paginatedLeadList.next_page_url == null) {
            this.setState({ loadingMore: false });
            return;
        }
        this.setState({ pageNumber: this.props.leadState.paginatedLeadList.current_page });
        this.fetchLeadsList();
    }

    fetchLeadsList = async () => {
        if (this.context.isConnected) {
            await this.props.fetchLeads(this.state.pageNumber);
            this.setState({ loadingMore: false });
        } else {
            //Fetch leads from lead state where sync_status is false
            Alert.alert('Offline', 'Your app is offline');
        }
    };

    logout = async () => {
        await this.props.logout();
        if (this.props.userState.user == '') {
            this.props.navigation.navigate('Auth');
        }
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

    fetchMore = () => {
        console.log('Fetchmore :', this.state.loadingMore);
        if (this.props.leadState.paginatedLeadList.next_page_url == null) {
            this.setState({ loadingMore: false });
            return;
        }
        this.setState(
            (prevState, nextProps) => ({
                pageNumber: prevState.pageNumber + 1,
                loadingMore: true,
            }),
            () => {
                this.fetchLeadsList();
            },
        );
    };

    renderFooter = () => {
        if (!this.state.loadingMore) return null;

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
    render() {
        return (
            <Container>
                {Platform.OS === 'ios' ? (
                    <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                        <Left />
                        <Body>
                            <Title style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Leads</Title>
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
                            <Title style={{ color: 'white', fontWeight: 'bold', marginLeft: 10, fontSize: 18 }}>
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
                <Content style={{ backgroundColor: '#eee', padding: 15 }}>
                    <View style={{ flex: 1, paddingBottom: 15 }}>
                        {this.props.leadState.isLoading ? (
                            <View>
                                <Loader />
                            </View>
                        ) : (
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={
                                        this.context.isConnected
                                            ? this.props.leadState.leadList
                                            : this.props.leadState.offlineLeadList
                                    }
                                    renderItem={({ item, index }) => this.renderItem(item)}
                                    keyExtractor={(item, index) => `${item.id}+${index}`}
                                    ListFooterComponent={this.renderFooter}
                                    onEndReached={this.fetchMore}
                                    onEndReachedThreshold={0.5}
                                />
                            </View>
                        )}
                    </View>
                </Content>
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
