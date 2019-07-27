import * as React from 'react'
import { Component } from 'react'
import { connect } from 'react-redux'
import { Text, Button, View } from 'native-base'
import Lead from './lead'

export interface LeadListProps {
  leads: []
}

export interface LeadListState {}

class LeadList extends Component<LeadListProps, LeadListState> {
  render() {
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

export default connect(mapStateToProps)(LeadList)
