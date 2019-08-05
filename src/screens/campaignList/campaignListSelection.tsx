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
import { AppState } from '../../redux/reducers';
import { NetworkContext } from '../../provider/network-provider';
import store from '../../redux/store';
import { NavigationScreenProp } from 'react-navigation';
import { fetchCampaignsApi, selectedCampaign } from '../../redux/actions/campaignActions';

export interface CampaignListProps {
    navigation: NavigationScreenProp<any>;
    campaignState: any;
    fetchCampaigns(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    selectCampaign(campaignId: any): void;
}

export interface CampaignListState {}

class CampaignList extends Component<CampaignListProps, CampaignListState> {
    static contextType = NetworkContext;

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
                <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="purple">
                    <Left></Left>
                    <Body>
                        <Title>Select Campaign</Title>
                    </Body>
                    <Right />
                </Header>
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
    fetchCampaigns: bindActionCreators(fetchCampaignsApi, dispatch),
    selectCampaign: bindActionCreators(selectedCampaign, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CampaignList);
