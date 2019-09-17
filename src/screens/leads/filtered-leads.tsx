import React, { Component } from 'react';
import { FlatList, ListView, Platform, ActivityIndicator, Dimensions } from 'react-native';
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
} from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/store';
import Lead from './lead';
import { fetchFilteredLeads } from '../../redux/actions/lead-actions';
import { NetworkContext } from '../../provider/network-provider';
import { NavigationScreenProp } from 'react-navigation';
import Loader from '../../components/content-loader/content-loader';
export interface FLeadListProps {
    navigation: NavigationScreenProp<any>;
    leadState: any;
    fetchFilteredLeads(pageNumber: number, flag: string): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    userState: any;
}

export interface FLeadListState {
    pageNumber: number;
    loadingMore: boolean;
    flag: string;
}

class FilteredLeads extends Component<FLeadListProps, FLeadListState> {
    static contextType = NetworkContext;
    static navigationOptions = () => {
        return {
            title: 'Leads',
        };
    };
    constructor(props: FLeadListProps) {
        super(props);
        this.state = {
            pageNumber: 1,
            loadingMore: false,
            flag: '',
        };
    }

    async componentDidMount() {
        this.focusLeadListener = this.props.navigation.addListener('didFocus', async () => {
            let selectedFlag = this.props.navigation.getParam('flag', '');
            await this.fetchLeadsList(this.state.pageNumber, selectedFlag);
            this.setState({
                pageNumber: this.props.leadState.filteredPaginatedLeadList.current_page,
                flag: selectedFlag,
                loadingMore: false,
            });
        });
    }

    componentWillUnmount() {
        if (this.focusLeadListener) this.focusLeadListener.remove();
    }

    fetchLeadsList = async (pgNo: number, flag: string) => {
        try {
            await this.props.fetchFilteredLeads(pgNo, flag);
            this.setState({
                loadingMore: false,
            });
        } catch (error) {
            /* show server error here*/
        }
    };

    fetchMore = () => {
        if (this.props.leadState.filteredPaginatedLeadList.next_page_url == null) {
            this.setState({ loadingMore: false });
            return;
        }
        this.setState(
            {
                pageNumber: this.props.leadState.flag !== this.state.flag ? 1 : this.state.pageNumber + 1,
                flag: this.state.flag,
                loadingMore: true,
            },
            async () => {
                await this.fetchLeadsList(this.state.pageNumber, this.state.flag);
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
                    <Text>No Data to Display</Text>
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
                                        data={this.props.leadState.filteredLeadList}
                                        renderItem={({ item, index }) => this.renderItem(item)}
                                        keyExtractor={(item, index) => `${item.id}+${index}`}
                                        ListEmptyComponent={this.renderEmptyView}
                                        ListFooterComponent={this.renderFooter}
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
            </Container>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    leadState: state.leadReducer,
    userState: state.userReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchFilteredLeads: bindActionCreators(fetchFilteredLeads, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FilteredLeads);
