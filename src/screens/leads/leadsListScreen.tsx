import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Header, Title, Content, Text, Button, Icon, Left, Body, Right, List, ListItem, Footer, FooterTab } from 'native-base';
import { NavigationScreenProp } from 'react-navigation';
import Lead from './lead';
import { fetchAllLeads } from '../../services/leadService';
import { fetchLeadsAction } from '../../redux/actions/leadsAction';
import { View } from 'react-native';

export interface LeadListProps {
  navigation: NavigationScreenProp<any>;
  leads: [];
  fetchLeads(leads): any;
}

export interface LeadListState { }

class LeadList extends Component<LeadListProps, LeadListState> {
  async componentDidMount() {
    try {
      let leadList = await fetchAllLeads();
      this.props.fetchLeads(leadList);
    } catch (error) {
      console.log(error);
    }
  }

  getLeads = () => {
    this.props.navigation.navigate('LeadList');
  };
  createLead = () => {
    this.props.navigation.navigate('CreateLead');
  };
  loadDashboard = () => {
    this.props.navigation.navigate('Dashboard');
  };

  render() {
    if (!this.props.leads.length) {
      return <Text>No Leads</Text>;
    }
    return (
      <Container >
        <Header style={{ backgroundColor: 'purple' }} androidStatusBarColor="purple">
          <Left>
            <Button transparent>
              <Text></Text>
            </Button>
          </Left>
          <Body>
            <Title>Lead List</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          <View>
            {this.props.leads.map(lead => {
              return <Lead lead={lead} key={lead.id} />;
            })}
          </View>
        </Content>
        <Footer>
          <FooterTab style={{ backgroundColor: 'purple' }}>
            <Button
              vertical
              //   active={props.navigationState.index === 0}
              onPress={() => this.props.navigation.navigate('Dashboard')}
            >
              <Icon name="home" style={{ color: 'white' }} />
              <Text style={{ color: 'white' }}>Dashboard</Text>
            </Button>
            <Button
              vertical
              //   active={props.navigationState.index === 1}
              onPress={this.createLead}
            >
              <Icon name="add" style={{ color: 'white' }} />
              <Text style={{ color: 'white' }}>Lead Capture</Text>

            </Button>
            <Button
              vertical
            //   active={props.navigationState.index === 2}
            // onPress={this.getLeads}
            >
              <Icon name="person" style={{ color: 'white' }} />
              <Text style={{ color: 'white' }}>Lead List</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container >
    );
  }
}

const mapStateToProps = state => {
  return {
    leads: state.leads,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchLeads: leads => {
      dispatch(fetchLeadsAction(leads));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeadList);
