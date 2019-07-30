import * as React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Text, View } from 'native-base'
import Lead from './lead'
import { fetchAllLeads } from '../../services/leadService'
import { getCampaigns } from '../../services/campaignService'
export interface LeadListProps {
  leads: []
  fetchLeads(): any
}
export interface LeadListState {}

class LeadList extends Component<LeadListProps, LeadListState> {
  async componentDidMount() {
    // this.props.fetchLeads()
    await getCampaigns()
  }

  render() {
    if (!this.props.leads.length) {
      return <Text>No Leads</Text>
    }
    return (
      <View>
        {this.props.leads.map(lead => {
          return <Lead lead={lead} key={lead.id} />
        })}
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    leads: state.leads,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchLeads: () => {
      dispatch(fetchAllLeads())
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LeadList)
