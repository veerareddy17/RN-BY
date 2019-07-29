import * as React from 'react'
import { Component } from 'react'
import { Text, Button, View, Picker } from 'native-base'
import { connect } from 'react-redux'
import { createLead } from '../../services/leadService'
import { Dispatch } from 'redux'
import { fetchCampaignList } from '../../services/leadService'
export interface CreateLeadProps {
  createItem(lead: any): void
  campaigns: []
  fetchCampaigns(): any
}

export interface CreateLeadState {
  lead: {}
  selectedCampaign: ''
}

const Item = Picker.Item
class CreateLead extends Component<CreateLeadProps, CreateLeadState> {
  componentDidMount() {
    this.props.fetchCampaigns()
  }

  handleSubmit = () => {
    const newLead = {
      id: 200,
      name: 'sappa',
      username: 'Ums',
    }
    this.props.createItem(newLead)
  }

  //   onValueChange = (value: string) => {
  //     this.setState({
  //       selectedCampaign: value,
  //     })
  //   }

  render() {
    let campaignItems = this.props.campaigns.map(camp => {
      return <Picker.Item key={camp.id} value={camp.title} label={camp.title} />
    })

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
    )
  }
}

const mapStateToProps = state => {
  return {
    campaigns: state.campaigns,
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    createItem: lead => {
      dispatch(createLead(lead))
    },
    fetchCampaigns: () => {
      dispatch(fetchCampaignList())
    },
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateLead)
