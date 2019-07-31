import * as React from 'react';
import { Component } from 'react';
import { Text, Button, View, Picker, Container, Header, Body, Title, Right, Content, Card, CardItem, Label, Input, DatePicker, Icon, Textarea, Item } from 'native-base';
import { connect } from 'react-redux';
import { createLead } from '../../services/leadService';
import { Dispatch } from 'redux';
import { createLeadAction, fetchCampaignsAction } from '../../redux/actions/leadsAction';

export interface CreateLeadProps { 
  createItem(lead: any): void; 
  campaigns: []; 
  fetchCampaigns(): any; 
} 

export interface CreateLeadState { 
  lead: {}; 
  selectedCampaign: ''; 
} 

//const Item = Picker.Item; 
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
                    <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
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
                        // onDateChange={this.handleChangeFor('dob')}
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
                        // selectedValue={this.state.leadModel.gender}
                        // onValueChange={this.handleChangeFor('gender')}
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
                      // selectedValue={this.state.leadModel.schoolBoard}
                      // onValueChange={this.handleChangeFor('schoolBoard')}
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