import * as React from 'react'
import { Component } from 'react'
import { Text, Button, View, Picker, Container, Header, Left, Body, Title, Right, Content, Form, Card, CardItem, Item, Label, Input, DatePicker, Icon, Textarea } from 'native-base'
import { connect } from 'react-redux'
import { createLead } from '../../services/leadService'
import { Dispatch } from 'redux'
import { fetchCampaignList } from '../../services/leadService'
import { LeadModel } from '../../models/leadModel';
export interface CreateLeadProps {
  createItem(lead: any): void
  campaigns: []
  fetchCampaigns(): any
}

export interface CreateLeadState {
  lead: object
  selectedCampaign: object
  leadModel: LeadModel;
}

//const Item = Picker.Item
class CreateLead extends Component<CreateLeadProps, CreateLeadState> {

  constructor(props: CreateLeadProps) {
    super(props);
    this.state = {
      lead: {},
      selectedCampaign: {},
      leadModel:  new LeadModel,
    }
  }
  componentDidMount() {
    this.props.fetchCampaigns()
  }

  handleChangeFor = (propertyName: string) => (event:any)=>{
     const { leadModel  } = this.state;
    // const lead = { ...leadModel, [propertyName]: event.target.value };
    // this.setState({ leadModel: lead });
    // console.log(this.state.leadModel)
    console.log('handle for change');
    console.log('event',event);
    const lead = this.state.leadModel;
    leadModel[propertyName] = event.nativeEvent.text;
    this.setState({ leadModel: lead });
    console.log(this.state.leadModel)
    } 

  handleSubmit = () => {
    // const newLead = {
    //   id: 200,
    //   name: 'sappa',
    //   username: 'Ums',
    // }
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
      <Container >
        <Header>
          {/* <Left>
            <Button transparent>
              <Text></Text>
            </Button>
          </Left> */}
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
          <View style={{flex:1}}>
            <Card>
              <CardItem header>
                <Text style={{ fontWeight: 'bold' }}>Student Details</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                    <Label>Student Name</Label>
                    <Input onChange={this.handleChangeFor.bind(this, 'studentName')} value={this.state.leadModel.studentName} style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <View style={{ flexDirection: 'row' }}>
                    <Item style={{ width: 150 }}>
                      <Label>DOB</Label>
                      <DatePicker ref='datePicker'
                        defaultDate={new Date()}
                        locale={"en"}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={"fade"}
                        androidMode={"default"}
                        // textStyle={{ color: "green" }}
                        // placeHolderTextStyle={{ color: "#d3d3d3" }}
                        onDateChange={this.handleChangeFor('dob')}
                        disabled={false}
                      />
                    </Item>
                    <Item style={{ width: 150, marginLeft: 15 }}>
                      <Label>Gender</Label>
                      {/* <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} /> */}
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ width: undefined }}
                        selectedValue={this.state.leadModel.gender}
                        onValueChange={this.handleChangeFor('gender')}
                      >
                        <Picker.Item label="M" value="key0" />
                        <Picker.Item label="F" value="key1" />
                      </Picker>
                    </Item>
                  </View>
                  <Item picker>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholder="Select your Board"
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.leadModel.schoolBoard}
                      onValueChange={this.handleChangeFor('schoolBoard')}
                    >
                      <Picker.Item label="Karnataka Board" value="key0" />
                      <Picker.Item label="Madya Pradesh Board" value="key1" />
                      <Picker.Item label="Delhi Board" value="key2" />
                    </Picker>
                  </Item>
                </Body>
              </CardItem>

            </Card>

            <Card>
              <CardItem header>
                <Text style={{ fontWeight: 'bold' }}>Parent Details</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                    <Label>Parent Name</Label>
                    <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                    <Label>Contact Number</Label>
                    <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                    <Label>Alternate Mobile Number</Label>
                    <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                    <Label>Email</Label>
                    <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                    <Label>Address</Label>
                    <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <View style={{ flexDirection: 'row' }}>
                    <Item style={{ width: 150, marginLeft: 15 }}>
                      <Label>Country</Label>
                      {/* <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} /> */}
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ width: undefined }}
                      // selectedValue={this.state.selected}
                      // onValueChange={this.onValueChange.bind(this)}
                      >
                        <Picker.Item label="India" value="key0" />
                        <Picker.Item label="Sri Lanka" value="key1" />
                      </Picker>
                    </Item>
                    <Item style={{ width: 150, marginLeft: 15 }}>
                      <Label>State</Label>
                      {/* <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} /> */}
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholder="State"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ width: undefined }}
                      // selectedValue={this.state.selected}
                      // onValueChange={this.onValueChange.bind(this)}
                      >
                        <Picker.Item label="Karnataka" value="key0" />
                        <Picker.Item label="Madya Pradesh" value="key1" />
                      </Picker>
                    </Item>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                  <Item floatingLabel={true} style={{ width: 150 }}>
                      <Label>City</Label>
                      <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                    </Item>
                    <Item floatingLabel={true} style={{ width: 150 }}>
                      <Label>Pin code</Label>
                      <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                    </Item>
                  </View>
                  <View padder>
                    <Textarea rowSpan={5} bordered placeholder="Comments" />
                  </View>
                </Body>
              </CardItem>
            </Card>
          </View>
          <View style={{justifyContent:'flex-end'}}>
            <Button full={true} onPress={this.handleSubmit} style={{ backgroundColor: 'purple' }}>
              <Text>Submit</Text>
            </Button>
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
