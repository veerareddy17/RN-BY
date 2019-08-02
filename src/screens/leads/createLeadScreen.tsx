import * as React from 'react';
import { Component } from 'react';
import { Text, Button, View, Picker } from 'native-base';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { fetchCampaignsApi } from '../../redux/actions/campaignActions';
import { createLeadApi } from '../../redux/actions/leadActions';
import { NetworkContext } from '../../provider/network-provider';
import store, { AppState } from '../../redux/store';
import { NavigationScreenProp } from 'react-navigation';

export interface CreateLeadProps {
    navigation: NavigationScreenProp<any>;
    campaignState: any;
    fetchCampaigns(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
    createLead(newLead: any): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}

export interface CreateLeadState {
    lead: {};
    selectedCampaign: '';
}

const Item = Picker.Item;
class CreateLead extends Component<CreateLeadProps, CreateLeadState> {
    static contextType = NetworkContext;

    componentDidMount = async () => {
        if (this.context.isConnected) {
            console.log('before fetch campaing---state', store.getState());
            await this.props.fetchCampaigns();
            console.log('After fetchCampaigns---state', store.getState());
        } else {
            console.log('Show Offline pop-up');
        }
    };

    handleSubmit = async () => {
        const newLead = {
            name: 'JySoBhSu',
            parent_name: 'iowir',
            email: 'bysvr@example.com',
            phone: 9995255234999,
            class_name: '9',
            school_board: 'HBSC',
            school_name: 'KHS High',
            address: 'KAR',
            comments: 'Put ur text here',
            user_id: 'f4493b36-6139-4c2d-a0a8-227c88cff71c',
            campaign_id: 'ccd15ed8-af0f-476a-b74b-0d28f7644412',
            country_id: 1,
            state_id: 1,
            city: 'banglore',
        };
        try {
            await this.props.createLead(newLead);
            console.log('After createLead---state', store.getState());
            this.props.navigation.navigate('LeadList');
        } catch (error) {
            console.log('Error in createlead api call');
        }
    };

    render() {
        let campaignItems = this.props.campaignState.campaignList.map(camp => {
            return <Picker.Item key={camp.id} value={camp.name} label={camp.name} />;
        });

        return (
            <View>
                <View>
                    <Text>Select Campaign</Text>
                    <Picker
                    // selectedValue={this.state.selectedCampaign}
                    // onValueChange={camp => this.setState({ selectedCampaign: camp })}
                    >
                        {campaignItems}
                    </Picker>
                </View>
                <Button onPress={this.handleSubmit}>
                    <Text>Create Lead</Text>
                </Button>
            </View>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    campaignState: state.campaignReducer,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    createLead: bindActionCreators(createLeadApi, dispatch),
    fetchCampaigns: bindActionCreators(fetchCampaignsApi, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CreateLead);
