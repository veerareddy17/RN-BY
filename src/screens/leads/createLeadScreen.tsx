import * as React from 'react';
import { Component } from 'react';
import { Text, Button, View, Picker } from 'native-base';
import { connect } from 'react-redux';
import { createLead } from '../../services/leadService';
import { Dispatch } from 'redux';

export interface CreateLeadProps {
    createItem(lead: any): void;
    campaigns: [];
    fetchCampaigns(): any;
}

export interface CreateLeadState {
    lead: {};
    selectedCampaign: '';
}

const Item = Picker.Item;
class CreateLead extends Component<CreateLeadProps, CreateLeadState> {
    componentDidMount() {
        // let camps = await getCampaigns()
        // console.log(camps)
        // this.props.fetchCampaigns()
    }

    handleSubmit = async () => {
        const newLead = {
            name: 'Appusdhj',
            parent_name: 'sdasdasd',
            email: 'sadsd@example.com',
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
            let lead = await createLead(newLead);
            this.props.createItem(lead);
        } catch (error) {
            console.log('Error in createlead api call');
        }
    };

    render() {
        let campaignItems = this.props.campaigns.map(camp => {
            return <Picker.Item key={camp.id} value={camp.title} label={camp.title} />;
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

const mapStateToProps = state => {
    return {
        campaigns: state.campaigns,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        createItem: lead => {
            dispatch(createLeadAction(lead));
        },
        fetchCampaigns: () => {
            dispatch(fetchCampaignsAction(campaigns));
        },
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(CreateLead);
