import React, { Component } from 'react';
import { FlatList, ListView } from 'react-native';
import { connect } from 'react-redux';
import { Text, View, Spinner, Content, Container, Body, ListItem, Button, Icon } from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/store';
import Lead from './lead';
import { fetchAllLeadsApi, fetchLeadsAction } from '../../redux/actions/lead-actions';
import { NetworkContext } from '../../provider/network-provider';
import { NavigationScreenProp } from 'react-navigation';
import { Alert } from 'react-native';
import { logout } from '../../redux/actions/user-actions';

export interface FilteredLeadsProps {
    navigation: NavigationScreenProp<any>;
    leadState: any;
    fetchLeads(pageNumber: number): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    logout(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    userState: any;
}

export interface FilteredLeadsState {
    pageNumber: number;
}

class FilteredLeads extends Component<FilteredLeadsProps, FilteredLeadsState> {
    static contextType = NetworkContext;
    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Filtered Leads',
            // headerRight: (
            //     <Button transparent onPress={this.logout}>
            //         <Icon name="ios-log-out" style={{ color: 'white' }} />
            //     </Button>
            // ),
        };
    };

    constructor(props: FilteredLeadsProps) {
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
        console.log('Logged FL oi');
        await this.props.logout();
        if (this.props.userState.user == '') {
            this.props.navigation.navigate('Auth');
        }
    };

    render() {
        return (
            <Container>
                <Content>
                    <View style={{ flex: 1 }}>
                        {this.props.leadState.isLoading ? (
                            <View>
                                <Spinner />
                                <Text>Fetching Leads...</Text>
                            </View>
                        ) : (
                            <View>
                                <FlatList
                                    data={this.props.leadState.leadList}
                                    renderItem={({ item, index }) => (
                                        <ListItem key={item.id}>
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
)(FilteredLeads);
