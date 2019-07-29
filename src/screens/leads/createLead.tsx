import * as React from 'react'
import { Component } from 'react'
import { Text, Button, View } from 'native-base'
import { connect } from 'react-redux'
import store from '../../redux/store'
import { createLead } from '../../services/lead-service'
import { createLeadAction } from '../../redux/actions/leads'
export interface CreateLeadProps {
  createItem(any): void
}

export interface CreateLeadState {
  lead: {}
}

class CreateLead extends Component<CreateLeadProps, CreateLeadState> {
  handleSubmit = () => {
    const newLead = {
      id: 200,
      name: 'sappa',
      username: 'Ums',
    }
    this.props.createItem(newLead)
  }

  render() {
    return (
      <View>
        <Button onPress={this.handleSubmit}>
          <Text>Create Lead</Text>
        </Button>
      </View>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createItem: lead => {
      dispatch(createLead(lead))
    },
  }
}

export default connect(
  null,
  mapDispatchToProps
)(CreateLead)
