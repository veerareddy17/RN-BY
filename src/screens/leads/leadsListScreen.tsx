import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View } from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/reducers';
import Lead from './lead';
import { fetchAllLeadsApi } from '../../redux/actions/leadActions';
import { NetworkContext } from '../../provider/network-provider';
import store from '../../redux/store';

export interface LeadListProps {
    leadState: any;
    fetchLeads(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}
export interface LeadListState {}

class LeadList extends Component<LeadListProps, LeadListState> {
    static contextType = NetworkContext;

    async componentDidMount() {
        if (this.context.isConnected) {
            console.log('before fetch leads -state', store.getState());
            await this.props.fetchLeads();
            console.log('After fetch leads---state', store.getState());
        } else {
            console.log('Show Offline pop-up');
        }
    }

    render() {
        if (this.props.leadState.leadList.length == 0) {
            return <Text>No Leads</Text>;
        }
        return (
            <View>
                {this.props.leadState.leadList.map(lead => {
                    return <Lead lead={lead} key={lead.id} />;
                })}
            </View>
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
