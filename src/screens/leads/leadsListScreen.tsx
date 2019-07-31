import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Text, View, Container, Header, Body, Title, Right, Content } from 'native-base';
import Lead from './lead';
import { fetchAllLeads } from '../../services/leadService';
import { fetchLeadsAction } from '../../redux/actions/leadsAction';
export interface LeadListProps {
    leads: [];
    fetchLeads(leads): any;
}
export interface LeadListState {}

class LeadList extends Component<LeadListProps, LeadListState> {
    async componentDidMount() {
        try {
            let leadList = await fetchAllLeads();
            this.props.fetchLeads(leadList);
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        if (!this.props.leads.length) {
            return <Text>No Leads</Text>;
        }
        return (
            <Container >
        <Header>
          {/* <Left>
            <Button transparent>
              <Text></Text>
            </Button>
          </Left> */}
          <Body>
            <Title>Lead</Title>
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
        </Container>
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
