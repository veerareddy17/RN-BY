import React, { Component } from 'react';
import { FlatList, ListView } from "react-native"
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

export interface LeadListProps {
    navigation: NavigationScreenProp<any>;
    leadState: any;
    fetchLeads(pageNumber: number): (dispatch: Dispatch<AnyAction>) => Promise<void>;
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

        }
    }
    async componentDidMount() {
        if (this.context.isConnected) {
            await this.props.fetchLeads(0);
        } else {
            console.log('Show Offline pop-up');
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
    async  fetchLeadsList() {
        if (this.context.isConnected) {
            await this.props.fetchLeads(this.state.pageNumber);
        } else {
            console.log('Show Offline pop-up');
        }
    }
    loadMorePage = () => {
        this.setState((prevState, props) => ({
            pageNumber: prevState.pageNumber + 1
        }));
        this.fetchLeadsList()

    }

    render() {
        return (
            <Container>
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
                                    renderItem={({ item, index }) => <ListItem key={item.id} ><Body><Lead lead={item} /></Body></ListItem>
                                    }
                                    onEndReached={(x) => this.loadMorePage()}
                                    keyExtractor={(item, index) => `${item.id}+${index}`}

                                    onEndReachedThreshold={0.1}
                                    initialNumToRender={2}
                                />
                            </View>


                        )}
                </View>
                <Footer>
                    <FooterTab style={{ backgroundColor: 'purple' }}>
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
                </Footer>
            </Container>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    leadState: state.leadReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchLeads: bindActionCreators(fetchAllLeadsApi, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LeadList);
