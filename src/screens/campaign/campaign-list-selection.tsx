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
// import { NetworkContext } from '../../provider/network-provider';
import store from '../../redux/store';
import { NavigationScreenProp } from 'react-navigation';
import { fetchCampaigns, selectedCampaign } from '../../redux/actions/campaign-actions';
import { StatusBar } from 'react-native';

export interface CampaignListProps {
    navigation: NavigationScreenProp<any>;
    campaignState: any;
    fetchCampaigns(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    selectCampaign(campaignId: any): void;
}

export interface CampaignListState {}

class CampaignList extends Component<CampaignListProps, CampaignListState> {
    // static contextType = NetworkContext;
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Select Campaign',
            headerStyle: {
                backgroundColor: '#813588',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                fontWeight: 'bold',
                alignSelf: 'center',
                fontSize: 18,
            },
        };
    };

    async componentDidMount() {
        await this.props.fetchCampaigns();
    }

    handleSelections = (campaignId: any) => {
        //this.setState({ campaignId: campaignId });
        this.props.selectCampaign(campaignId);

        this.props.navigation.navigate('App');
    };

    render() {
        return (
            <Container>
                <StatusBar backgroundColor="#813588" barStyle="light-content" />
                <Content>
                    {this.props.campaignState.isLoading ? (
                        <View>
                            <Spinner />
                            <Text style={{ textAlign: 'center' }}>Fetching Campaigns...</Text>
                        </View>
                    ) : (
                        <View>
                            <List>
                                {this.props.campaignState.campaignList.map(campaign => {
                                    return (
                                        <ListItem
                                            button={true}
                                            key={campaign.id}
                                            onPress={() => this.handleSelections(campaign)}
                                        >
                                            <Left>
                                                <Text>{campaign.name}</Text>
                                            </Left>
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
