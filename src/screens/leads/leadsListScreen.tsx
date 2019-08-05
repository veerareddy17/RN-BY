import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Spinner, Content, Header, Container, Left, Button, Title, Right, Body, Footer, FooterTab, Icon } from 'native-base';
import { Dispatch, bindActionCreators, AnyAction } from 'redux';
import { AppState } from '../../redux/reducers';
import Lead from './lead';
import { fetchAllLeadsApi } from '../../redux/actions/leadActions';
import { NetworkContext } from '../../provider/network-provider';
import store from '../../redux/store';
import { NavigationScreenProp } from 'react-navigation';

export interface LeadListProps {
  navigation: NavigationScreenProp<any>;
  leadState: any;
  fetchLeads(): (dispatch: Dispatch<AnyAction>) => Promise<void>;
}

export interface LeadListState { }

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
    return (
      <Container>
        <Header style={{ backgroundColor: '#813588' }} androidStatusBarColor="purple">
          <Left>

          </Left>
          <Body>
            <Title>Leads</Title>
          </Body>
          <Right />
        </Header>
        <Content padder>
          {this.props.leadState.isLoading ? (
            <View>
              <Spinner />
              <Text>Fetching Leads...</Text>
            </View>
          ) : (
              <View>
                {this.props.leadState.leadList.map(lead => {
                  return <Lead lead={lead} key={lead.id} />;
                })}
              </View>
            )}
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
      </Container>
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
