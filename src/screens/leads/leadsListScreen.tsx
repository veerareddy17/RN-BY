import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/reducers';
import Lead from './lead';
import { fetchAllLeadsApi } from '../../redux/actions/leadsAction';
import { NetworkContext } from '../../provider/network-provider';

export interface LeadListProps {
    leads: any;
    fetchLeads(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}
export interface LeadListState {}

class LeadList extends Component<LeadListProps, LeadListState> {
    static contextType = NetworkContext;

    async componentDidMount() {
        console.log('Network status:', this.context.isConnected);
        if (this.context.isConnected) {
            await this.props.fetchLeads();
            console.log('Leads screen----', this.props.leads);
        } else {
            console.log('Show Offline pop-up');
        }
    }

    render() {
        if (this.props.leads.length == 0) {
            return <Text>No Leads</Text>;
        }
        return (
            <View>
                {this.props.leads.map(lead => {
                    return <Lead lead={lead} key={lead.id} />;
                })}
            </View>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    leads: state.leads,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    fetchLeads: bindActionCreators(fetchAllLeadsApi, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(LeadList);
