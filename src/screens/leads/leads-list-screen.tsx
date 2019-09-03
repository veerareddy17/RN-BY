import React, { Component } from 'react';
import { FlatList, ListView, Platform } from 'react-native';
import { connect } from 'react-redux';
import {
    Text,
    View,
    Spinner,
    Content,
    Header,
    Container,
    Left,
    Button,
    Title,
    Right,
    Body,
    List,
    ListItem,
    Footer,
    FooterTab,
    Icon,
} from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/store';
import Lead from './lead';
import { fetchAllLeadsApi, fetchLeadsAction } from '../../redux/actions/lead-actions';
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
}

class LeadList extends Component<LeadListProps, LeadListState> {
    static contextType = NetworkContext;
    static navigationOptions = {
        title: 'Leads',
    };
    constructor(props: LeadListProps) {
        super(props);
        this.fetchLeadsList = this.fetchLeadsList.bind(this);
        this.state = {
            pageNumber: 1,
        };
    }
    async componentDidMount() {
        if (this.context.isConnected) {
            await this.props.fetchLeads(0);
        } else {
            console.log('Show Offline pop-up');
            Alert.alert('Offline', 'Your app is offline');
        }
    }

    getLeads = () => {
        this.props.navigation.navigate('LeadList');
    };
    createLead = () => {
        this.props.navigation.navigate('CreateLead');
    };
    loadDashboard = () => {
        this.props.navigation.navigate('Dashboard');
    };
    async fetchLeadsList() {
        if (this.context.isConnected) {
            await this.props.fetchLeads(this.state.pageNumber);
        } else {
            console.log('Show Offline pop-up');
        }
    }
    loadMorePage = () => {
        this.setState((prevState, props) => ({
            pageNumber: prevState.pageNumber + 1,
        }));
        this.fetchLeadsList();
    };

    logout = async () => {
        console.log('Logged oi');
        await this.props.logout();
        if (this.props.userState.user == '') {
            this.props.navigation.navigate('Auth');
        }
    };

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
                            <Button transparent onPress={this.logout}>
                                <Icon name="ios-log-out" style={{ color: 'white' }} />
                            </Button>
                        </Right>
                    </Header>
                ) : (
                    <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="#813588">
                        <Body>
                            <Title style={{ color: 'white', fontWeight: 'bold', marginLeft:10, fontSize: 18 }}>Leads</Title>
                        </Body>
                        <Right>
                            <Button transparent onPress={this.logout}>
                                <Icon name="ios-log-out" style={{ color: 'white' }} />
                            </Button>
                        </Right>
                    </Header>
                )}
                <Content style={{ backgroundColor: '#eee', padding: 15 }}>
                    <View style={{ flex: 1, paddingBottom: 15}}>
                        {this.props.leadState.isLoading ? (
                            <View>
                                <Loader />
                            </View>
                        ) : (
                            <View>
                                <FlatList
                                    data={this.props.leadState.leadList}
                                    renderItem={({ item, index }) => (
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
                                    )}
                                    onEndReached={x => this.loadMorePage()}
                                    keyExtractor={(item, index) => `${item.id}+${index}`}
                                    onEndReachedThreshold={0.1}
                                    initialNumToRender={2}
                                />
                            </View>
                        )}
                    </View>
                </Content>
                {/* <Footer>
                    <FooterTab style={{ backgroundColor: '#813588' }}>
                        <Button
                            vertical
                            //   active={props.navigationState.index === 0}
                            onPress={() => this.props.navigation.navigate('Dashboard')}
                        >
                            <Icon name="home" style={{ color: 'white' }} />
                            <Text style={{ color: 'white' }}>Dashboard</Text>
                        </Button>
                        <Button
                            vertical
                            //   active={props.navigationState.index === 1}
                            onPress={this.createLead}
                        >
                            <Icon name="add" style={{ color: 'white' }} />
                            <Text style={{ color: 'white' }}>Lead Capture</Text>
                        </Button>
                        <Button
                            vertical
                        //   active={props.navigationState.index === 2}
                        // onPress={this.getLeads}
                        >
                            <Icon name="person" style={{ color: 'white' }} />
                            <Text style={{ color: 'white' }}>Lead List</Text>
                        </Button>
                    </FooterTab>
                </Footer> */}
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
