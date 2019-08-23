import React, { Component } from 'react';
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
    Footer,
    FooterTab,
    Icon,
    List,
    ListItem,
} from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/store';
import { NetworkContext } from '../../provider/network-provider';
import store from '../../redux/store';
import { NavigationScreenProp } from 'react-navigation';
import { fetchCampaigns, selectedCampaign } from '../../redux/actions/campaign-actions';

export interface CampaignListProps {
    navigation: NavigationScreenProp<any>;
    campaignState: any;
    fetchCampaigns(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    selectCampaign(campaignId: any): void;
}

export interface CampaignListState { }

class CampaignList extends Component<CampaignListProps, CampaignListState> {
    static contextType = NetworkContext;
    static navigationOptions = {
        title: 'Select Campaign',
    };
    async componentDidMount() {
        await this.props.fetchCampaigns();
        console.log('After fetch campains---state', store.getState());
    }

    handleSelections = (campaignId: any) => {
        console.log('campaign selected', campaignId);
        //this.setState({ campaignId: campaignId });
        this.props.selectCampaign(campaignId);
        console.log('After fetch campains---state', store.getState());

        this.props.navigation.navigate('Dashboard');
    };

    render() {
        return (
            <Container>
                <Content>
                    {this.props.campaignState.isLoading ? (
                        <View>
                            <Spinner />
                            <Text>Fetching Campaigns...</Text>
                        </View>
                    ) : (
                            <View>
                                <List>
                                    {this.props.campaignState.campaignList.map(campaign => {
                                        return (
                                            <ListItem>
                                                <Left>
                                                    <Text>{campaign.name}</Text>
                                                </Left>
                                                <Right>
                                                    <Icon
                                                        name="arrow-forward"
                                                        onPress={() => this.handleSelections(campaign)}
                                                    />
                                                </Right>
                                            </ListItem>
                                        );
                                    })}
                                </List>
                            </View>
                        )}
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    campaignState: state.campaignReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchCampaigns: bindActionCreators(fetchCampaigns, dispatch),
    selectCampaign: bindActionCreators(selectedCampaign, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CampaignList);
