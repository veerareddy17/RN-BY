import * as React from 'react'
import { Component } from 'react'
import { Text, Button, View, Picker, Container, Header, Left, Body, Title, Right, Content, Form, Card, CardItem, Item, Label, Input } from 'native-base'
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

//const Item = Picker.Item
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
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Text>Customer Registration</Text>
            </Button>
          </Left>
          <Body>
            <Title>Customer Registration</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View style={{ backgroundColor: 'lightgrey', flexDirection: 'row' }}>
            <Text>Your Campaign:</Text>
            <Button small bordered style={{ borderColor: 'purple', marginLeft: 'auto' }}>
              <Text style={{ color: 'purple' }}>Change</Text>
            </Button>
          </View>
          <View>
            <Form>
              <Card>
                <CardItem header>
                  <Text style={{ fontWeight: 'bold' }}>Student Details</Text>
                </CardItem>
                <CardItem>
                  <Body>
                    <Item floatingLabel={true}>
                      <Label>Student Name</Label>
                      <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                    </Item>
                    <View style={{flexDirection:'row'}}>
                    <Item floatingLabel={true}>
                      <Label>Student Name</Label>
                      <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0,width:50 }} />
                    </Item>
                    <Item floatingLabel={true}>
                      <Label>Student Name</Label>
                      <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0,width:50 }} />
                    </Item>
                    </View>
                  </Body>
                </CardItem>

              </Card>
            </Form>
          </View>

        </Content>
      </Container>
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
