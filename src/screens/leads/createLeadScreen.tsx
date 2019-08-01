import * as React from 'react';
import { Component } from 'react';
import { Text, Button, View, Picker, Container, Header, Body, Title, Right, Content, Card, CardItem, Label, Input, DatePicker, Icon, Textarea, Item, Left } from 'native-base';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { createLeadAction, fetchCampaignsAction } from '../../redux/actions/leadsAction';
import { createLead } from '../../services/leadService';
import { NavigationScreenProp } from 'react-navigation';

export interface CreateLeadProps { 
  navigation: NavigationScreenProp<any>;
  createItem(lead: any): void; 
  campaigns: []; 
  fetchCampaigns(): any; 
} 

export interface CreateLeadState { 
  // lead: {}; 
  // selectedCampaign: ''; 
            name: string,
            parent_name: string,
            email: string,
            phone: number,
            class_name: string,
            school_board: string,
            school_name: string,
            address: string,
            comments: string,
            user_id: string,
            campaign_id: string,
            country_id: number,
            state_id: number,
            city: string,
} 

//const Item = Picker.Item; 
class CreateLead extends Component<CreateLeadProps, CreateLeadState> { 

  constructor(props: CreateLeadProps) {
    super(props);
    this.state = {
      name: '',
      parent_name: '',
      email: '',
      phone: 0,
      class_name: '',
      school_board: '',
      school_name: '',
      address: '',
      comments: '',
      //user_id: 'f4493b36-6139-4c2d-a0a8-227c88cff71c',
      user_id: '84d6410a-fb4e-4dd9-8fdb-0e439eebd5d4',
      campaign_id: 'ccd15ed8-af0f-476a-b74b-0d28f7644412',
      country_id: 0,
      state_id: 0,
      city: '',
    }
  }
  componentDidMount() { 
      // let camps = await getCampaigns() 
      // console.log(camps) 
      // this.props.fetchCampaigns() 
  } 

    handleSubmit = async () => {
        // const newLead = {
        //     name: 'Appusdhj',
        //     parent_name: 'sdasdasd',
        //     email: 'sadsd@example.com',
        //     phone: 9995255234999,
        //     class_name: '9',
        //     school_board: 'HBSC',
        //     school_name: 'KHS High',
        //     address: 'KAR',
        //     comments: 'Put ur text here',
        //     user_id: 'f4493b36-6139-4c2d-a0a8-227c88cff71c',
        //     campaign_id: 'ccd15ed8-af0f-476a-b74b-0d28f7644412',
        //     country_id: 1,
        //     state_id: 1,
        //     city: 'banglore',
        // };
        console.log('state',this.state);
        const newLead = this.state;
        console.log('new Const',newLead);
        // uncomment below and pass state
        try {
            let lead = await createLead(newLead);
            this.props.createItem(lead);
            this.props.navigation.navigate('Dashboard');
        } catch (error) {
            console.log('Error in createlead api call');
        }
        
    };

    onBoardChange(value: string) {
      this.setState({
        school_board: value
      });
    }
    onCountryChange(value: string) {
      this.setState({
        country_id: parseInt(value)
      });
    }
    onStateChange(value: string) {
      this.setState({
        state_id: parseInt(value)
      });
    }
    onClassChange(value: string) {
      this.setState({
        class_name: value
      });
    }
    render() {
        let campaignItems = this.props.campaigns.map(camp => {
            return <Picker.Item key={camp.id} value={camp.title} label={camp.title} />;
        });

    return (
      <Container >
        <Header>
          <Left>
            <Button transparent>
              <Text></Text>
            </Button>
          </Left> 
          <Body>
            <Title>Lead Capture</Title>
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
                    <Input onChangeText={(text) => this.setState({name: text})} value={this.state.name} style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <Item picker>
                    <Picker
                      mode="dropdown"
                      iosIcon={<Icon name="arrow-down" />}
                      style={{ width: undefined }}
                      placeholder="Select your Board"
                      placeholderStyle={{ color: "#bfc6ea" }}
                      placeholderIconColor="#007aff"
                      selectedValue={this.state.school_board}
                      onValueChange={this.onBoardChange.bind(this)}
                    >
                      <Picker.Item label="Karnataka Board" value="Karnataka Board" />
                      <Picker.Item label="Madya Pradesh Board" value="Madya Pradesh Board" />
                      <Picker.Item label="Delhi Board" value="Delhi Board" />
                    </Picker>
                  </Item>
                  <View style={{flexDirection:'row'}}>
                  <Item floatingLabel={true} style={{ marginBottom: 15,width:170 }}>
                    <Label>School</Label>
                    <Input onChangeText={(text) => this.setState({school_name: text})} value={this.state.school_name} style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <Item style={{ width: 150, marginLeft: 15 }}>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ width: undefined }}
                        selectedValue={this.state.country_id}
                       onValueChange={this.onClassChange.bind(this)}
                      >
                        <Picker.Item label="Class 1" value="Class 1" />
                        <Picker.Item label="Class 2" value="Class 2" />
                        <Picker.Item label="Class 3" value="Class 3" />
                        <Picker.Item label="Class 4" value="Class 4" />
                      </Picker>
                    </Item>
                  </View>
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
                    <Input onChangeText={(text) => this.setState({parent_name: text})} value={this.state.parent_name} style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                    <Label>Contact Number</Label>
                    <Input onChangeText={(text) => this.setState({phone: parseInt(text)})} value={String(this.state.phone)} style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                    <Label>Alternate Mobile Number</Label>
                    <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                    <Label>Email</Label>
                    <Input onChangeText={(text) => this.setState({email: text})} value={this.state.email} style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <Item floatingLabel={true} style={{ marginBottom: 15 }}>
                    <Label>Address</Label>
                    <Input onChangeText={(text) => this.setState({address: text})} value={this.state.address} style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                  </Item>
                  <View style={{ flexDirection: 'row' }}>
                    <Item style={{ width: 150, marginLeft: 15 }}>
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholder="Gender"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ width: undefined }}
                        selectedValue={this.state.country_id}
                       onValueChange={this.onCountryChange.bind(this)}
                      >
                        <Picker.Item label="India" value="1" />
                        <Picker.Item label="Sri Lanka" value="2" />
                      </Picker>
                    </Item>
                    <Item style={{ width: 150, marginLeft: 15 }}>
                      {/* <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} /> */}
                      <Picker
                        mode="dropdown"
                        iosIcon={<Icon name="arrow-down" />}
                        placeholder="State"
                        placeholderStyle={{ color: "#bfc6ea" }}
                        placeholderIconColor="#007aff"
                        style={{ width: undefined }}
                        selectedValue={this.state.state_id}
                        onValueChange={this.onStateChange.bind(this)}
                      >
                        <Picker.Item label="Karnataka" value="1" />
                        <Picker.Item label="Madya Pradesh" value="2" />
                      </Picker>
                    </Item>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                  <Item floatingLabel={true} style={{ width: 150 }}>
                      <Label>City</Label>
                      <Input onChangeText={(text) => this.setState({city: text})} value={this.state.city} style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                    </Item>
                    <Item floatingLabel={true} style={{ width: 150 }}>
                      <Label>Pin code</Label>
                      <Input style={{ borderColor: 'lightgrey', borderWidth: 1, borderRadius: 3, top: 0 }} />
                    </Item>
                  </View>
                  <View padder>
                    <Textarea onChangeText={(text) => this.setState({comments: text})} value={this.state.comments} rowSpan={5} bordered placeholder="Comments" />
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